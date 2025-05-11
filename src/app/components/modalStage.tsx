import React, { useEffect } from 'react';
import StagesList, { ConstructionStage } from './StagesList';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    stages: ConstructionStage[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, stages }) => {
    // Блокировка скролла при открытом модальном окне
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Закрытие по ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose} // Закрытие по клику вне модального окна
        >
            <div 
                className="bg-[#2D3538] border border-[#C34D3F] rounded-lg shadow-lg p-6 relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике внутри модалки
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-white hover:text-[#C34D3F] transition-colors"
                    aria-label="Закрыть модальное окно"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <StagesList stages={stages} />
            </div>
        </div>
    );
};

export default Modal;