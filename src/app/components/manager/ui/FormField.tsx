export const FormField = ({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  textarea = false
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  textarea?: boolean
}) => (
  <div>
    <label className="block text-sm font-medium text-white mb-1">
      {label}
    </label>
    {textarea ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-[#3A4549] border border-[#C34D3F] rounded text-white"
        required={required}
        rows={3}
        placeholder={placeholder}
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-[#3A4549] border border-[#C34D3F] rounded text-white"
        required={required}
        placeholder={placeholder}
      />
    )}
  </div>
)