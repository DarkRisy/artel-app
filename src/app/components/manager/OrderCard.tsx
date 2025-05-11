// import { useState } from "react"
// import { Order, OrderStatus } from "../managerServer"
// import { formatDate, formatDateTime, ORDER_TITLES } from "./types"
// import { StatusSelect } from "./StatusSelect"
// import { StageForm } from "./StageForm"
// import { StagesModal } from "./StagesModal"
// import { StagePreview } from "./ui/StagePreview"

// export const OrderCard = ({
//   order,
//   onStageAdded,
//   onStatusChange
// }: {
//   order: Order
//   onStageAdded: () => void
//   onStatusChange: (orderId: number, newStatus: OrderStatus) => void
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const orderTitle = ORDER_TITLES[order.serviceType] || order.serviceType

//   return (
//     <div className="border border-[#C34D3F] rounded-lg p-4 bg-[#3C4447] hover:shadow-lg transition-shadow">
//       <div className="flex justify-between items-start">
//         <div>
//           <h2 className="text-lg font-bold text-white">{orderTitle}</h2>
//           <p className="text-gray-300">Бюджет: {order.budget}</p>
//           <p className="text-gray-300">Клиент: {order.user.name}</p>
//           <div className="mt-1">
//             <StatusSelect
//               currentStatus={order.status}
//               orderId={order.id}
//               onChange={onStatusChange}
//             />
//           </div>
//         </div>
//         <div className="text-right">
//           <time className="text-sm text-gray-400 block" title={formatDateTime(order.createdAt)}>
//             {formatDate(order.createdAt)}
//           </time>
//           <p className="text-sm text-gray-400">{order.location}</p>
//         </div>
//       </div>

//       {order.notes && (
//         <div className="mt-3 p-2 bg-[#3A4549] rounded">
//           <p className="text-sm text-gray-300">{order.notes}</p>
//         </div>
//       )}

//       <div className="mt-4">
//         <h3 className="text-md font-semibold text-white mb-2">Этапы ({order.stages.length}):</h3>
//         {order.stages.length > 0 ? (
//           <ul className="space-y-2">
//             {order.stages.slice(0, 2).map(stage => (
//               <StagePreview key={stage.id} stage={stage} />
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-400">Нет добавленных этапов</p>
//         )}
//       </div>

//       <div className="flex gap-2 mt-4">
//         {order.stages.length > 0 && (
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="text-[#C34D3F] hover:text-[#A93F32] text-sm font-medium"
//           >
//             Показать все этапы
//           </button>
//         )}
//         <StageForm orderId={order.id} onStageAdded={onStageAdded} />
//       </div>

//       <StagesModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         stages={order.stages}
//         serviceType={orderTitle}
//       />
//     </div>
//   )
// }
import { useState } from "react";
import { formatDate, formatDateTime, Order, ORDER_TITLES, OrderStatus } from "./types";
import { StatusSelect } from "./StatusSelect";
import { StageForm } from "./StageForm";
import { StagesModal } from "./StagesModal";
import { StagePreview } from "./ui/StagePreview";
import { generateOrderDocument } from "./GenerateOrderDocument";

const statusColorMap: Record<OrderStatus, string> = {
  pending: "bg-[#C34D3F]",
  in_progress: "bg-amber-400",
  completed: "bg-emerald-500",
  cancelled: "bg-gray-500"
};

interface OrderCardProps {
  order: Order;
  onStageAdded: () => void;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
}

export const OrderCard = ({ order, onStageAdded, onStatusChange }: OrderCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const orderTitle = ORDER_TITLES[order.serviceType] || order.serviceType;
  const handleGenerateDocument = () => {
    generateOrderDocument(order);
  };

  const renderStatusBar = () => (
    <div 
      className={`absolute top-0 left-0 w-full h-1.5 ${statusColorMap[order.status]} transition-all duration-500 ${isHovered ? "opacity-100" : "opacity-90"}`}
    />
  );

  const renderHeader = () => (
    <div className="flex items-start gap-4 mb-4">
      <div className={`p-2.5 rounded-xl ${isHovered ? "bg-[#C34D3F]/20" : "bg-[#3A4549]"} transition-colors duration-300`}>
        <svg className="w-6 h-6 text-[#C34D3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-2">
          <h2 className="text-xl font-bold text-white group-hover:text-[#C34D3F] transition-colors truncate">
            {orderTitle}
          </h2>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#C34D3F]/10 text-[#C34D3F] border border-[#C34D3F]/20">
            #{order.id}
          </span>
        </div>
        
        <div className="mt-2">
          <StatusSelect
            currentStatus={order.status}
            orderId={order.id}
            onChange={onStatusChange}
          />
        </div>
      </div>
    </div>
  );

  const renderInfoCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <InfoCard 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        label="Бюджет"
        value={order.projectDetails.general.budget}
        accentColor="#C34D3F"
      />

      <InfoCard 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
        label="Клиент"
        value={order.user.name}
        accentColor="#C34D3F"
      />

      <InfoCard 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
        label="Локация"
        value={order.projectDetails.general.location}
        accentColor="#C34D3F"
      />

      <InfoCard 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        label="Создан"
        value={formatDate(order.createdAt)}
        tooltip={formatDateTime(order.createdAt)}
        accentColor="#C34D3F"
      />
    </div>
  );



  const renderAttachments = () => (
    order.attachments && (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-[#C34D3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Проектная документация</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <a 
            href={order.attachments} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-[#3A4549]/50 rounded-lg hover:bg-[#3A4549]/70 transition-colors"
          >
            <div className="p-2 bg-[#C34D3F]/10 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {order.attachments.split('/').pop() || 'Документ'}
              </p>
              <p className="text-xs text-gray-400">Нажмите для просмотра</p>
            </div>
            <svg className="w-5 h-5 text-[#C34D3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>
      </div>
    )
  );

  const renderStages = () => (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${isHovered ? "bg-[#C34D3F]/20" : "bg-[#3A4549]"} transition-colors`}>
            <svg className="w-5 h-5 text-[#C34D3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <span>Этапы работы <span className="text-[#C34D3F] font-bold">{order.stages.length}</span></span>
        </h3>
        {order.stages.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className={`text-sm font-medium ${isHovered ? "bg-[#C34D3F] text-white" : "bg-[#C34D3F]/10 text-[#C34D3F]"} px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 hover:shadow-md`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Показать все
          </button>
        )}
      </div>
      
      {order.stages.length > 0 ? (
        <div className="space-y-3">
          {order.stages.slice(0, 2).map(stage => (
            <StagePreview key={stage.id} stage={stage} />
          ))}
        </div>
      ) : (
        <div className={`p-6 text-center bg-[#3A4549]/30 rounded-xl border-2 border-dashed ${isHovered ? "border-[#C34D3F]/50" : "border-[#4A5659]"} transition-colors`}>
          <svg className="mx-auto w-10 h-10 text-[#4A5659]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p className="text-gray-400 mt-3">Нет добавленных этапов</p>
          <p className="text-xs text-gray-500 mt-1">Добавьте первый этап работы</p>
        </div>
      )}
    </div>
  );

  return (
    <div 
      className={`relative rounded-2xl bg-[#2E3639] overflow-hidden transition-all duration-300 ${isHovered ? "shadow-xl" : "shadow-md"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderStatusBar()}
      
      <div className="p-5">
        <div className="flex flex-col md:flex-row gap-5 mb-5">
          <div className="flex-1 min-w-0">
            {renderHeader()}
            {renderInfoCards()}
          </div>
        </div>


        {renderAttachments()}
        {renderStages()}

        <div className="mt-6">
          <StageForm orderId={order.id} onStageAdded={onStageAdded} />
        </div>
         <button 
        onClick={handleGenerateDocument}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Скачать документ
      </button>
      </div>

      <StagesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stages={order.stages}
        serviceType={orderTitle}
      />
    </div>
  );
};

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  tooltip?: string;
  accentColor?: string;
}

const InfoCard = ({ icon, label, value, tooltip, accentColor = "#C34D3F" }: InfoCardProps) => (
  <div className="flex items-start gap-3 p-3 bg-[#3A4549]/50 rounded-lg hover:bg-[#3A4549]/70 transition-colors group">
    <div className={`p-1.5 rounded-lg bg-[${accentColor}]/10 group-hover:bg-[${accentColor}]/20 transition-colors`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {tooltip ? (
        <div className="tooltip" data-tip={tooltip}>
          <p className="text-sm font-medium text-white truncate hover:text-[#C34D3F] transition-colors">{value}</p>
        </div>
      ) : (
        <p className="text-sm font-medium text-white truncate hover:text-[#C34D3F] transition-colors">{value}</p>
      )}
    </div>
  </div>
);