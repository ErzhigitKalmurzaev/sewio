import React, { useEffect, useState } from 'react';
import MultiImagePicker from './../../../../../components/ui/imagePickers/multiImagePicker';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../../components/ui/button';
import { createProductImages, getProductFiles, getProductImages } from '../../../../../store/technolog/product';
import { toast } from 'react-toastify';
import MultiFileUploader from '../../../../../components/ui/imagePickers/multiFileUploader';

const ProductImages = ({ id_product, images, setImages, files, setFiles, deleteImages, setDeleteImages, deleteFiles, setDeleteFiles }) => {
  const dispatch = useDispatch();

  const [existingImages, setExistingImages] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (id_product) {
      dispatch(getProductImages({ id: id_product })).then(({ payload }) => {
        setExistingImages(payload || []);
      });

      dispatch(getProductFiles({ id: id_product })).then(({ payload }) => {
        setExistingFiles(payload || []);
      });
    }
  }, [dispatch, id_product, update]);

  // const onSubmit = () => {
  //   const imagesBlob = images.map(img => img.blobFile);
  //   const filesBlob = newFiles.map(file => file.blobFile);

  //   dispatch(createProductImages({
  //     props: {
  //       product_id: id_product,
  //       images: imagesBlob,
  //       delete_ids: deleteImages
  //     }
  //   }));

  //   dispatch(createProductFiles({
  //     props: {
  //       product_id: id_product,
  //       files: filesBlob,
  //       delete_ids: deleteFiles
  //     }
  //   })).then((res) => {
  //     if (res.meta.requestStatus === 'fulfilled') {
  //       toast('Файлы успешно обновлены!');
  //       setNewFiles([]);
  //       setDeleteFiles([]);
  //       setUpdate(!update);
  //     }
  //   });
  // };

  return (
    <div className='bg-white p-4 rounded-lg space-y-6'>
      <div className='flex justify-between'>
        <p className='text-lg font-semibold'>Лекало</p>
      </div>

      <MultiImagePicker
        existingImages={existingImages}
        setExistingImages={setExistingImages}
        setDeleteImages={setDeleteImages}
        newImages={images}
        setNewImages={setImages}
      />

      <div className='flex justify-between pt-6'>
        <p className='text-lg font-semibold'>Файлы</p>
      </div>

      <MultiFileUploader
        existingFiles={existingFiles}
        setExistingFiles={setExistingFiles}
        setDeleteFiles={setDeleteFiles}
        newFiles={files}
        setNewFiles={setFiles}
      />

      {/* <div className="pt-6">
        <Button onClick={onSubmit}>Сохранить</Button>
      </div> */}
    </div>
  );
};

export default ProductImages;
