'use server'
import { cookies } from "next/dist/server/request/cookies"
import path from 'path';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { ConstructionStage, Order, User } from '../db';
import { decrypt } from "../lib/session";



export async function GET() {
  try {
    const ordersWithStagesAndUsers = await Order.findAll({
      attributes: [
        'id',
        'serviceType',
        'status',
        'contactMethod',
        'callTime',
        'comment',
        'hasDocs',
        'attachments',
        'createdAt',
        'updatedAt',
        'budget',
        'location',
        'timing',
        'foundationType',
        'foundationArea',
        'foundationDepth',
        'landscapeWorks',
        'landscapeArea',
        'landscapePavingType',
        'farmbildingType',
        'farmbildingArea',
        'farmbildingHeight',
        'farmbildingMaterial',
        'storageType',
        'storageCapacity',
        'storageTemperature',
        'storageVentilation',
        'livestockType',
        'livestockAnimalCount',
        'livestockArea',
        'livestockVentilation',
        'livestockFeatures',
        'greenhouseType',
        'greenhouseArea',
        'greenhouseHeating',
        'greenhouseIrrigation',
        'greenhouseFeatures',
        'earthworkType',
        'earthworkVolume',
        'earthworkDepth',
        'earthworkEquipment',
        'earthworkComment',
        'roadType',
        'roadLength',
        'roadWidth',
        'roadCoating',
        'roadFeatures',
        'drainageType',
        'drainageLength',
        'drainageDepth',
        'drainageMaterial',
        'drainageElements',
        'name',
        'phone',
        'email',
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'Name', 'Email', 'Phone'],
          required: true
        },
        {
          model: ConstructionStage,
          attributes: ['id', 'Name', 'Description', 'Image_1', 'Image_2', 'Image_3'],
          required: false
        }
      ],
      order: [['createdAt']]
    });



    const result = ordersWithStagesAndUsers.map(order => ({
      id: order.id,
      serviceType: order.serviceType,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      attachments: order.attachments,
      contactMethod: order.contactMethod,
      callTime: order.callTime,

      projectDetails: {
        general: {
          budget: order.budget,
          location: order.location,
          timing: order.timing,
          comment: order.comment,
          hasDocs: order.hasDocs,
        },

        foundation: {
          type: order.foundationType,
          area: order.foundationArea,
          depth: order.foundationDepth
        },

        landscape: {
          works: order.landscapeWorks,
          area: order.landscapeArea,
          pavingType: order.landscapePavingType
        },

        farmBuilding: {
          type: order.farmbildingType,
          area: order.farmbildingArea,
          height: order.farmbildingHeight,
          material: order.farmbildingMaterial
        },

        storage: {
          type: order.storageType,
          capacity: order.storageCapacity,
          temperature: order.storageTemperature,
          ventilation: order.storageVentilation
        },

        livestock: {
          type: order.livestockType,
          animalsCount: order.livestockAnimalCount,
          area: order.livestockArea,
          ventilation: order.livestockVentilation,
          features: order.livestockFeatures
        },

        greenhouse: {
          type: order.greenhouseType,
          area: order.greenhouseArea,
          heating: order.greenhouseHeating,
          irrigation: order.greenhouseIrrigation,
          features: order.greenhouseFeatures
        },

        earthwork: {
          type: order.earthworkType,
          volume: order.earthworkVolume,
          depth: order.earthworkDepth,
          equipment: order.earthworkEquipment,
          comments: order.earthworkComment
        },

        road: {
          type: order.roadType,
          length: order.roadLength,
          width: order.roadWidth,
          coating: order.roadCoating,
          features: order.roadFeatures
        },

        drainage: {
          type: order.drainageType,
          length: order.drainageLength,
          depth: order.drainageDepth,
          material: order.drainageMaterial,
          elements: order.drainageElements
        }
      },

      user: {
        id: order.User.id,
        name: order.User.Name,
        email: order.User.Email,
        phone: order.User.Phone
      },

      stages: order.ConstructionStages?.map(stage => ({
        id: stage.id,
        name: stage.Name,
        description: stage.Description,
        images: [stage.Image_1, stage.Image_2, stage.Image_3].filter(img => img)
      })) || []
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}





export async function POST(req: Request) {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const fields = Object.fromEntries(formData.entries());
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    const filePaths: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadsDir, filename);

      await writeFile(filePath, buffer);
      filePaths.push(`/uploads/${filename}`);
    }
    const orderData = Order.create({
      serviceType: fields.serviceType,
      location: fields.location,
      timing: fields.timing,
      budget: fields.budget,
      hasDocs: fields.hasDocs,
      comment: fields.comments,
      name: fields.name,
      phone: fields.phone,
      email: fields.email,
      contactMethod: fields.contactMethod,
      callTime: fields.callTime,
      status: 'pending',
      UserId: session?.userId,
      foundationType: fields.foundationType,
      foundationArea: fields.foundationArea,
      foundationDepth: fields.foundationDepth,
      landscapeWorks: fields.landscapeWorks,
      landscapeArea: fields.landscapeArea,
      landscapePavingType: fields.landscapePavingType,
      farmbildingType: fields.farmBuildingType,
      farmbildingArea: fields.farmBuildingArea,
      farmbildingHeight: fields.farmBuildingHeight,
      farmbildingMaterial: fields.farmBuildingMaterial,
      storageType: fields.storageType,
      storageCapacity: fields.storageCapacity,
      storageTemperature: fields.storageTemperature,
      storageVentilation: fields.storageVentilation,
      livestockType: fields.livestockType,
      livestockAnimalCount: fields.livestockAnimalsCount,
      livestockArea: fields.livestockArea,
      livestockVentilation: fields.livestockVentilation,
      livestockFeatures: fields.livestockFeatures,
      greenhouseType: fields.greenhouseType,
      greenhouseArea: fields.greenhouseArea,
      greenhouseHeating: fields.greenhouseHeating,
      greenhouseIrrigation: fields.greenhouseIrrigation,
      greenhouseFeatures: fields.greenhouseFeatures,
      earthworkType: fields.earthworkType,
      earthworkVolume: fields.earthworkVolume,
      earthworkDepth: fields.earthworkDepth,
      earthworkEquipment: fields.earthworkEquipment,
      earthworkComment: fields.earthworkComments,
      roadType: fields.roadType,
      roadLength: fields.roadLength,
      roadWidth: fields.roadWidth,
      roadCoating: fields.roadCoating,
      roadFeatures: fields.roadFeatures,
      drainageType: fields.drainageType,
      drainageLength: fields.drainageLength,
      drainageDepth: fields.drainageDepth,
      drainageMaterial: fields.drainageMaterial,
      drainageElements: fields.drainageElements,
      attachments: filePaths[0],

    });

    return NextResponse.json(
      { order: orderData },
      { status: 201 }
    );

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error!' },
      { status: 500 }
    );
  }
}