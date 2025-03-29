import React, { useEffect, useState } from 'react';
import { Uploader } from 'rsuite';
import { Plus } from 'lucide-react';

const MultiImagePicker = ({ existingImages, setExistingImages, setDeleteImages, newImages, setNewImages }) => {
  const [fileList, setFileList] = useState([]);

  // Обновляем fileList, если изменяются existingImages или newImages
  useEffect(() => {
    const formattedExistingImages = existingImages.map(img => ({
      fileId: img.id,      // Уникальный идентификатор
      url: img.image,        // URL изображения с сервера
      name: img.title || 'Image'
    }));

    // Объединяем существующие и новые изображения в fileList
    setFileList([...formattedExistingImages, ...newImages]);
  }, [existingImages, newImages]);

  // Обработчик добавления новых изображений
  const handleChange = (updatedFileList) => {
    // Фильтруем новые файлы
    const newFiles = updatedFileList.filter(file => !file.url);
    setNewImages(newFiles);  // Обновляем новые загруженные изображения
    setFileList(updatedFileList); // Обновляем полный список изображений
  };

  // Обработчик удаления изображения
  const handleRemove = (file) => {
    if (file.url) {
      setDeleteImages(prev => [...prev, file.fileId]);  // Добавляем id удалённого изображения
      setExistingImages(prev => prev.filter(img => img.id !== file.fileId)); // Удаляем изображение из existingImages
    } else {
      setNewImages(prev => prev.filter(img => img.blobFile !== file.blobFile)); // Удаляем изображение из newImages
    }
    setFileList(prev => prev.filter(f => f.fileId !== file.fileId)); // Обновляем fileList
  };

  return (
    <div className="flex gap-y-3 pb-5">
      <Uploader
        multiple
        action=""
        listType="picture"
        method='get'
        fileList={fileList || []} // Используем fileList для управления отображением
        onChange={handleChange}
        onRemove={handleRemove}
        className='w-full'
        style={{ width: '100%' }}
      >
        <button style={{ width: 145, height: 145, borderRadius: 20 }}>
          <Plus size={32} />
        </button>
      </Uploader>

      <style jsx="true">{`
        .rs-uploader-file-item-picture,
        .rs-uploader-file-item-status,
        .rs-uploader-file-item-icon-loading,
        .rs-uploader-file-item,
        .rs-uploader-picture {
          width: 145px !important;
          height: 145px !important;
          border-radius: 0px;
          display: flex;
        }

        .rs-uploader-file-items {
          display: flex !important;
          max-width: 1000px;
          width: auto;
        }

        .rs-uploader-file-item-picture img {
          min-width: 145px !important;
          height: 145px !important;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default MultiImagePicker;
