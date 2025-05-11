import { useState, useEffect } from "react"

export const SearchInput = ({ value, onChange }: {
  value: string
  onChange: (value: string) => void
}) => {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(inputValue)
    }, 300)

    return () => clearTimeout(handler)
  }, [inputValue, onChange])

  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-white mb-1">
        Расширенный поиск
      </label>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="ID, имя, email, телефон, услуга, этап..."
          className="w-full px-4 py-2 bg-[#3A4549] border border-[#C34D3F] rounded-lg text-white placeholder-gray-400"
        />
        {inputValue && (
          <button
            onClick={() => setInputValue('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
            aria-label="Очистить поиск"
          >
            ×
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Ищите по любому полю: ID 123, фундамент, example@mail.com, +79001234567
      </p>
    </div>
  )
}