import { OrderStatus, STATUS_CONFIG } from "./types"

export const StatusFilter = ({ value, onChange }: {
  value: OrderStatus | 'all'
  onChange: (value: OrderStatus | 'all') => void
}) => (
  <div className="mb-[22px]">
    <label className="block text-sm font-medium text-white mb-1">
      Фильтр по статусу
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as OrderStatus | 'all')}
      className="w-full px-4 py-2 bg-[#3A4549] border border-[#C34D3F] rounded-lg text-white"
    >
      <option value="all">Все статусы</option>
      {Object.entries(STATUS_CONFIG).map(([value, { label }]) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  </div>
)