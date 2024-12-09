import { Uploader, Message, Loader, useToaster } from 'rsuite';
import AvatarIcon from '@rsuite/icons/legacy/Avatar';
import React, { useState } from 'react';
import { CircleX } from 'lucide-react';

function previewFile(file, callback) {
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}

const SingleImagePicker = ({ fileInfo, setFileInfo }) => {
  const toaster = useToaster();
  const [uploading, setUploading] = React.useState(false);
  const [image, setImage] = useState(fileInfo)

  const handleUpload = (file) => {
    setUploading(true);
    previewFile(file.blobFile, value => {
      setFileInfo(file);
      setImage(value)
      setUploading(false);
      toaster.push(<Message type="success">Uploaded successfully</Message>);
    });
  };
  
  return (
    <Uploader
      autoUpload={false}
      fileListVisible={false}
      listType="picture"
      onChange={(fileList) => {
        if (fileList.length > 0) {
          handleUpload(fileList[0]);
        }
      }}
      onError={() => {
        setFileInfo(null);
        setUploading(false);
        toaster.push(<Message type="error">Upload failed</Message>);
      }}
    >
      <button type='button' style={{ width: 150, height: 150 }}>
        {uploading && <Loader backdrop center />}
        {fileInfo ? (
          <div className='w-full h-full relative'>
            <img src={image || fileInfo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <CircleX  fill='white' color='red' size={25} className='absolute top-0 right-0' onClick={(e) => {e.stopPropagation(); setFileInfo(null)}}/>
          </div>
        ) : (
          <AvatarIcon style={{ fontSize: 80 }} />
        )}
      </button>
    </Uploader>
  );
};

export default SingleImagePicker;
