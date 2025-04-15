import React, { useState } from 'react';
import StagesList, { ConstructionStage } from './StagesList';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    stages: ConstructionStage[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, stages }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#2D3538] border border-[#C34D3F] rounded-lg shadow-lg p-6 relative">
                <button onClick={onClose} className="absolute  top-2 right-2 text-white">
                    Закрыть
                </button>
                <StagesList stages={stages} />
            </div>
        </div>
    );
};

export default Modal;