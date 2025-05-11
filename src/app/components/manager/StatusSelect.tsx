import { useState } from "react";

import { getStatusConfig, OrderStatus, STATUS_CONFIG, StatusSelectProps } from "./types";

export const StatusSelect: React.FC<StatusSelectProps> = ({
  currentStatus,
  orderId,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const statusConfig = getStatusConfig(currentStatus);

  const handleStatusSelect = async (status: OrderStatus) => {
    try {
      onChange(orderId, status);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2 py-1 text-xs rounded-full ${statusConfig.class} flex items-center`}
      >
        {statusConfig.label}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-40 bg-white rounded-md shadow-lg">
          <div className="py-1">
            {Object.entries(STATUS_CONFIG).map(([status, { label, class: statusClass }]) => (
              <button
                key={status}
                onClick={() => handleStatusSelect(status as OrderStatus)}  // Приведение типа
                className={`block w-full text-left px-4 py-2 text-sm ${statusClass}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};