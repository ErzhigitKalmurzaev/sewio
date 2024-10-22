import React, { useState } from 'react';
import { Uploader } from 'rsuite';
import { Plus } from 'lucide-react';

const MultiImagePicker = () => {
  const [images, setImages] = useState([]);

  return (
    <div className="flex gap-y-3 pb-5">
      <Uploader
        multiple
        listType="picture"
        fileList={images}
        method='get'
        onChange={fileList => setImages(fileList)}
        className='w-full'
        style={{ width: '100%' }}
      >
        <button style={{ width: 145, height: 145, borderRadius: 20 }}>
          <Plus size={32} />
        </button>
      </Uploader>

      <style jsx>{`
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
          /* flex-wrap: wrap; */
          width: auto;
          /* border: 1px solid black; */
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
