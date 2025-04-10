import React, { useEffect, useState } from 'react';
import { Uploader } from 'rsuite';
import { CloudUpload } from 'lucide-react';
import Button from '../button';

const MultiFileUploader = ({ existingFiles = [], setExistingFiles, setDeleteFiles, newFiles, setNewFiles }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const formattedExistingFiles = existingFiles ? existingFiles?.map(file => ({
      fileId: file?.id,
      name: file?.title || 'Файл',
      url: file?.file, // путь к файлу на сервере
    })) : [];

    setFileList([...formattedExistingFiles, ...newFiles]);
  }, [existingFiles, newFiles]);

  const handleChange = (updatedFileList) => {
    const newUploads = updatedFileList.filter(file => !file.url);
    setNewFiles(newUploads);
    setFileList(updatedFileList);
  };

  const handleRemove = (file) => {
    if (file.url) {
      setDeleteFiles(prev => [...prev, file.fileId]);
      setExistingFiles(prev => prev.filter(f => f.id !== file.fileId));
    } else {
      setNewFiles(prev => prev.filter(f => f.blobFile !== file.blobFile));
    }
    setFileList(prev => prev.filter(f => f.fileId !== file.fileId));
  };

  return (
    <div className="w-full flex flex-col file-uploader-wrapper">
      <Uploader
        multiple
        autoUpload={false}
        listType="text" // <-- ключевое отличие
        fileList={fileList}
        onChange={handleChange}
        onRemove={handleRemove}
        className="vertical-file-uploader"
      >
        <Button>
          <CloudUpload className="mr-2" size={18} />
          Загрузите файл или изображение
        </Button>
      </Uploader>

      <style jsx>{`
            .file-uploader-wrapper .rs-uploader-file-items {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 16px;
            }

            .file-uploader-wrapper .rs-uploader-file-item {
            width: 400px !important;
            height: 30px !important;
            }
        `}</style>
    </div>
  );
};

export default MultiFileUploader;
