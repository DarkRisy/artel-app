import { ConstructionStage } from "../types";
import Image from 'next/image'

export const StagePreview = ({ stage }: { stage: ConstructionStage }) => (
  <li className="bg-[#3A4549] p-3 rounded">
    <div className="flex justify-between items-start">
      <h4 className="font-medium text-white">{stage.Name}</h4>
    </div>
    <p className="text-sm text-gray-300 mt-1">{stage.Description}</p>
    {stage.Image_1 && (
      <div className="w-full h-32 relative mt-2 rounded overflow-hidden">
        <Image
          src={stage.Image_1}
          alt={`Изображение этапа ${stage.Name}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    )}
  </li>
)