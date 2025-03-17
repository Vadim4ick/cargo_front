import { useState, useRef } from "react";
import { Trash, UploadCloud } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  onChange?: (file: File | null) => void; // Callback при загрузке фото
  defaultImage?: string; // Если уже есть загруженное изображение
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onChange,
  defaultImage,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultImage || null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Обработчик загрузки файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Создание временного URL для превью
    onChange?.(file);
  };

  // Удаление изображения
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    onChange?.(null);
  };

  // Drag & Drop обработчики
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const file = e.dataTransfer.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    onChange?.(file);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer ${
        isDragging ? "border-violet-500 bg-gray-100" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {previewUrl ? (
        <div className="relative w-48 h-32">
          <Image
            src={previewUrl}
            alt="Загруженное изображение"
            fill
            className="rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveImage();
            }}
            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
          >
            <Trash className="text-red-500" size={20} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-600">
          <UploadCloud size={40} />
          <p className="mt-2 text-sm">Перетащите сюда изображение</p>
          <p className="text-xs text-gray-400">или кликните, чтобы выбрать</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
