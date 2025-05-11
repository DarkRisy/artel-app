import { ConstructionStage } from "./types"
import Image from 'next/image'

export const StagesModal = ({
  isOpen,
  onClose,
  stages,
  serviceType
}: {
  isOpen: boolean
  onClose: () => void
  stages: ConstructionStage[]
  serviceType: string
}) => {
  if (!isOpen) return null
  console.log(stages);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2D3538] p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            Все этапы заказа: {serviceType}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
            aria-label="Закрыть модальное окно"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          {stages.map(stage => (
            <div key={`stage-${stage.id}`} className="bg-[#3A4549] p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-white">{stage.Name}</h3>
              </div>
              <p className="text-gray-300 mt-2">{stage.Description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                {[stage?.Image_1, stage?.Image_2, stage?.Image_3]
                  .filter(Boolean)
                  .map((img, i) => (
                    <div key={`${stage.id}-image-${i}`} className="h-40 relative rounded overflow-hidden group">
                      <Image
                        src={img || ''}
                        alt={`Изображение этапа ${stage.Name} ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <a
                          href={img}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#C34D3F] text-white px-3 py-1 rounded text-sm"
                        >
                          Открыть
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}