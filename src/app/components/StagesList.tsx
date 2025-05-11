import React from 'react';
import Image from 'next/image';

export interface ConstructionStage {
    id: number;
    Name: string;
    Description: string;
    Image_1?: string;
    Image_2?: string;
    Image_3?: string;
    OrderId: number;
    createdAt?: string;
}

interface StagesListProps {
    stages: ConstructionStage[];
}

const StagesList: React.FC<StagesListProps> = ({ stages }) => {
    if (stages.length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <h3 className="text-xl font-medium text-white mb-2">
                    В данный момент информация о выполненных этапах отсутствует
                </h3>
                <p className="text-white max-w-md mx-auto">
                    Здесь будут отображаться этапы произведенных работ.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-4 space-y-6 px-4 sm:px-0">
            <h4 className="font-semibold text-lg text-white">Этапы заказа</h4>
            <ul className="space-y-6">
                {stages
                    .sort((a, b) => a.OrderId - b.OrderId)
                    .map((stage) => {
                        const hasImages = stage.Image_1 || stage.Image_2 || stage.Image_3;
                        
                        return (
                            <li key={stage.id} className="bg-white/10 p-4 rounded-lg">
                                <div className="mb-3">
                                    <h3 className="font-bold text-white text-lg md:text-xl">{stage.Name}</h3>
                                    <p className="text-white/80 mt-1 text-sm md:text-base">{stage.Description}</p>
                                </div>

                                {hasImages && (
                                    <div className="mt-4">
                                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                                            {[stage.Image_1, stage.Image_2, stage.Image_3]
                                                .filter(Boolean)
                                                .map((img, i) => (
                                                    <div 
                                                        key={`${stage.id}-image-${i}`} 
                                                        className="h-32 xs:h-36 sm:h-40 md:h-48 relative rounded-lg overflow-hidden group transition-transform hover:scale-[1.02]"
                                                    >
                                                        <Image
                                                            src={img || ''}
                                                            alt={`${stage.Name} - Фото ${i + 1}`}
                                                            fill
                                                            className="object-cover"
                                                            sizes="(max-width: 479px) 100vw, 
                                                                   (max-width: 639px) 50vw,
                                                                   33vw"
                                                            placeholder={img ? 'empty' : 'blur'}
                                                            blurDataURL="data:image/svg+xml;base64,..."
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                                            <a
                                                                href={img}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-[#C34D3F] hover:bg-[#a53f33] text-white px-3 py-1.5 rounded-md text-xs sm:text-sm transition-colors"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                Открыть в полном размере
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};

export default StagesList;