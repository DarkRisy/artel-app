import axios from "axios"
import { useState } from "react"
import { addStageWithImages } from "../managerServer"
import { useToast } from "../use-toast"
import { FormField } from "./ui/FormField"

export const StageForm = ({ orderId, onStageAdded }: {
  orderId: number
  onStageAdded: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    OrderId: orderId
  })
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...newFiles].slice(0, 3)) // Ограничиваем до 3 файлов
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация обязательных полей
    if (!formData.Name || !formData.Description) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните название и описание этапа',
        variant: 'destructive'
      });
      return;
    }

    // Валидация файлов
    if (files.some(file => file.size > 5 * 1024 * 1024)) { // 5MB лимит
      toast({
        title: 'Ошибка',
        description: 'Размер файлов не должен превышать 5MB',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      // Используем новую функцию для создания этапа с загрузкой изображений
      await addStageWithImages({
        Name: formData.Name,
        Description: formData.Description,
        OrderId: orderId,
        files: files
      });

      toast({
        title: 'Успех',
        description: 'Этап успешно добавлен с прикрепленными изображениями',
      });

      // Сбрасываем форму
      setIsOpen(false);
      setFormData({
        Name: '',
        Description: '',
        OrderId: orderId
      });
      setFiles([]);

      // Обновляем список этапов
      onStageAdded();
    } catch (error) {
      console.error('Ошибка при добавлении этапа:', error);

      let errorMessage = 'Не удалось добавить этап';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-[#C34D3F] hover:text-[#A93F32] text-sm font-medium"
      >
        + Добавить этап
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2D3538] p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Добавить этап</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Название*"
                value={formData.Name}
                onChange={value => setFormData({ ...formData, Name: value })}
                required
              />

              <FormField
                label="Описание*"
                value={formData.Description}
                onChange={value => setFormData({ ...formData, Description: value })}
                textarea
                required
              />

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Фотографии (максимум 3)
                </label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center justify-center w-full px-4 py-6 bg-[#3A4549] border-2 border-dashed border-[#C34D3F] rounded-lg cursor-pointer hover:bg-[#45535A] transition">
                    <span className="text-gray-300">
                      {files.length > 0 ? 'Добавить еще файлы' : 'Выберите файлы'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>

                  {files.length > 0 && (
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-[#3A4549] rounded">
                          <span className="text-sm text-gray-300 truncate max-w-xs">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Поддерживаются изображения (JPG, PNG, etc.)
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    setFiles([])
                  }}
                  className="px-4 py-2 border border-[#C34D3F] text-[#C34D3F] hover:bg-[#F5E9E8] rounded-lg"
                  disabled={isUploading}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C34D3F] hover:bg-[#A93F32] text-white rounded-lg flex items-center justify-center"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Сохранение...
                    </>
                  ) : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}