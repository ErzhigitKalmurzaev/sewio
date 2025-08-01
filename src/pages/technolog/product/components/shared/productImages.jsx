import React, { useEffect, useState } from 'react';
import MultiImagePicker from './../../../../../components/ui/imagePickers/multiImagePicker';
import { useDispatch, useSelector } from 'react-redux';
import { getProductFiles, getProductImages } from '../../../../../store/technolog/product';
import MultiFileUploader from '../../../../../components/ui/imagePickers/multiFileUploader';
import CombinationsPrint from './combinationsPrint';

const ProductImages = ({ id_product, images, setImages, files, setFiles, setDeleteImages, setDeleteFiles, printRef }) => {
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

  return (
    <div className='bg-white p-4 rounded-lg space-y-6'>
      <div className='flex justify-between'>
        <p className='text-lg font-semibold'>Лекало</p>
      </div>

      <div className="hidden">
            <CombinationsPrint
              ref={printRef}
              images={existingImages}
            />
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
    </div>
  );
};

export default ProductImages;
