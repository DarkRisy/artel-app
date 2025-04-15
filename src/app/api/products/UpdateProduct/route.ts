'use server';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { UserProduct } from '../../db';
import { v4 as uuidv4 } from 'uuid'; // для генерации уникальных идентификаторов
import { error } from 'console';

async function getProductById(productId: number) {
  try {
    return await UserProduct.findOne({ where: { id: Number(productId) } });
  } catch (error) {
    throw new Error('Error fetching product');
  }
}

async function updateProduct(productId: number, productName: string, productPrice: number, fileName: string | null) {
  const existingProduct = await getProductById(productId);
  if (!existingProduct) {
    throw new Error('Product not found');
  }

  await UserProduct.update({
    Name: productName,
    Price: productPrice,
    Image: fileName ? fileName : existingProduct.Image,
  }, {
    where: { id: Number(productId) }
  });
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json(
      { message: 'Content-Type must be multipart/form-data' },
      { status: 415 }
    );
  }

  const formData = await request.formData();
  const file = formData.get('image') as File | null;
  const productName = formData.get('name') as string;
  const productPrice = parseInt(formData.get('price') as string); // используем parseFloat для поддержки дробных значений
  const productId = parseInt(formData.get('id') as string);

  if (!productName || isNaN(productPrice) || productPrice < 0 || !productId) {
    return NextResponse.json(
      { message: 'Invalid input data' },
      { status: 422 }
    );
  }

  try {
    const existingProduct = await getProductById(productId);
    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Product not found', error },
        { status: 404 }
      );
    }

    let uniqueFileName = existingProduct.Image;

    // Если файл был загружен, обрабатываем его
    if (file) {
      const buffer = await file.arrayBuffer();
      const originalFileName = file.name.replace(/\s+/g, '_');
      uniqueFileName = `${uuidv4()}_${originalFileName}`; // добавляем уникальный идентификатор к имени файла
      const filePath = path.resolve(process.cwd(), "public/images", uniqueFileName);
      
      // Проверка существования старого файла и его удаление
      const oldFilePath = path.resolve(process.cwd(), "public/images", existingProduct.Image);
      if (await fileExists(oldFilePath)) {
        await fs.unlink(oldFilePath);
      }

      await fs.writeFile(filePath, Buffer.from(buffer));
    }

    await updateProduct(productId, productName, productPrice, uniqueFileName);
    return NextResponse.json({id: productId, Name: productName, Image: uniqueFileName, Price: productPrice });
  } catch (error) {
    console.error("Error during file update:", error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false; 
  }
};