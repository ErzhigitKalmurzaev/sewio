import React, { useEffect, useState } from 'react';
import { Uploader, IconButton } from 'rsuite';
import { CloudUpload, Download } from 'lucide-react';
import Button from '../button';

const MultiFileUploader = ({ existingFiles = [], setExistingFiles, setDeleteFiles, newFiles, setNewFiles }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const formattedExistingFiles = existingFiles?.map(file => ({
      fileId: file?.id,
      name: file?.title || 'Файл',
      url: file?.file, // путь к файлу на сервере
    })) || [];

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

  const renderFileInfo = (file) => {
    return (
      <div className="flex justify-between items-center w-[360px] pr-2 pl-7 pb-1">
        <span className="truncate">{file.name}</span>
        {file.url && (
          <a href={file.url} target="_blank" rel="noopener noreferrer" className="ml-3">
            <Download size={18} />
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col file-uploader-wrapper">
      <Uploader
        multiple
        autoUpload={false}
        listType="text"
        fileList={fileList}
        onChange={handleChange}
        onRemove={handleRemove}
        renderFileInfo={renderFileInfo}
        className="vertical-file-uploader"
      >
        <Button>
          <CloudUpload className="mr-2" size={18} />
          Загрузите файл или изображение
        </Button>
      </Uploader>

      <style>{`
        .file-uploader-wrapper .rs-uploader-file-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }

        .file-uploader-wrapper .rs-uploader-file-item {
          width: 400px !important;
          max-height: 40px;
          padding: 4px 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #f8f8f8;
          border-radius: 6px;
          font-size: 14px;
        }

        .file-uploader-wrapper a {
          color: #3b82f6;
          transition: opacity 0.2s ease;
        }

        .file-uploader-wrapper a:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default MultiFileUploader;
