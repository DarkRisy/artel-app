import React from 'react';

export interface ConstructionStage {
    id: number;
    orderId: number;
    Name: string;
    Description: string;
};

interface StagesListProps {
    stages: ConstructionStage[];
}

const StagesList: React.FC<StagesListProps> = ({ stages }) => {
    return (
        <div className="mt-4">
            <ul className="list-disc list-inside">
                {stages.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium text-white mb-2">В данный моменты информация о выполненных этапах отсутствует</h3>
                        <p className="text-white max-w-md mx-auto">
                            Здесь будут отображаться этапы произведенных работ.
                        </p>
                    </div>
                ) : (<div>
                    <h4 className="font-semibold text-lg">Этапы заказа</h4>
                    {stages.map(stage => (
                        <li key={stage.id} className="mb-2 list-none">
                            <h1 className="font-bold">{stage.Name}:</h1>
                            <p>{stage.Description} </p>
                        </li>
                    ))
                }</div>)}
            </ul>
        </div>
    );
};

export default StagesList;