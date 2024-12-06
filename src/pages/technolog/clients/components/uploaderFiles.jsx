import React, { useEffect, useState } from 'react';
import { Uploader, Button } from 'rsuite';
import { Plus, FileText, Trash2, UploadCloud } from 'lucide-react';

const MultiFilePicker = ({ existingFiles, setExistingFiles, setDeleteFiles, newFiles, setNewFiles }) => {
  const [fileList, setFileList] = useState([]);

  // Обновляем fileList при изменении existingFiles или newFiles
  useEffect(() => {
    const formattedExistingFiles = existingFiles.map(file => ({
      fileId: file.id, // Уникальный идентификатор
      url: file.file, // URL файла с сервера
      name: file.title || decodeURIComponent(file.file.split('/').pop()) // Название файла
    }));

    // Убираем дубликаты
    const combinedFiles = [...formattedExistingFiles, ...newFiles];
    const uniqueFiles = Array.from(new Set(combinedFiles.map(f => f.name))).map(name =>
      combinedFiles.find(f => f.name === name)
    );

    setFileList(uniqueFiles);
  }, [existingFiles, newFiles]);

  // Обработчик добавления новых файлов
  const handleChange = (updatedFileList) => {
    setNewFiles([...newFiles, ...updatedFileList]);
    setFileList([...fileList, ...updatedFileList]); // Обновляем полный список
  };

  // Обработчик удаления файла
  const handleRemove = (file) => {
    if (file.url) {
      // Если файл из existingFiles
      setDeleteFiles(prev => [...prev, file.fileId]);
      setExistingFiles(prev => prev.filter(f => f.id !== file.fileId));
    } else {
      // Если файл из newFiles
      setNewFiles(prev => prev.filter(f => f.blobFile !== file.blobFile));
    }
    setFileList(prev => prev.filter(f => f.fileId !== file.fileId));
  };

  return (
    <div className="flex flex-col gap-y-3 pb-5">
      {/* Список файлов */}
      <div className="file-list flex flex-col gap-2">
        {fileList.map(file => (
          <div
            key={file.fileId || file.name}
            className="file-item flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm"
          >
            <div className="flex items-center gap-2">
              <FileText size={18} />
              <a
                href={file.url || URL.createObjectURL(file.blobFile)}
                download={file.name}
                className="text-blue-600 underline hover:text-blue-800"
              >
                {file.name}
              </a>
            </div>
            <Button
              appearance="ghost"
              color="red"
              onClick={() => handleRemove(file)}
              size="xs"
              className="ml-4"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>

      {/* Компонент загрузки файлов */}
      <Uploader
        multiple
        fileList={[]}
        listType="text"
        method="get"
        onChange={handleChange}
        onRemove={handleRemove}
        onClick={(event) => event.preventDefault()} // Предотвращает перезагрузку страницы
        className="w-full mt-4"
        style={{ width: '100%' }}
      >
        <Button>
          <UploadCloud className='mr-2'/>
          Загрузите файл
        </Button>
      </Uploader>
    </div>
  );
};

export default MultiFilePicker;
