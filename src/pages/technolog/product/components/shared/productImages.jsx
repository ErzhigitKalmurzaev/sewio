import React, { useEffect, useState } from 'react';
import MultiImagePicker from './../../../../../components/ui/imagePickers/multiImagePicker';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../../components/ui/button';
import { createProductImages, getProductImages } from '../../../../../store/technolog/product';
import { toast } from 'react-toastify';

const ProductImages = ({ id_product, images, setImages, deleteImages, setDeleteImages }) => {
  const dispatch = useDispatch();

  const [existingImages, setExistingImages] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if(id_product) {
      dispatch(getProductImages({ id: id_product }))
      .then(({ payload }) => {
        setExistingImages(payload || []);  // Записываем изображения с сервера в состояние
      });
    }
  }, [dispatch, id_product, update]);

  useEffect(() => {

  }, [])

  const onSubmit = () => {
    const imagesBlob = images.map(image => image.blobFile); // Преобразуем новые изображения в Blob
    dispatch(createProductImages({
      props: {
        product_id: id_product,
        images: imagesBlob,
        delete_ids: deleteImages
      }
    })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast("Изображения успешно обновлены!");
        setImages([]);
        setUpdate(!update);
        setDeleteImages([]);
      }
    });
  };

  return (
    <div className='bg-white p-4 rounded-lg'>
      <div className='flex justify-between'>
        <p className='text-lg font-semibold font-inter'>Лекало</p>
        {/* <Button onClick={onSubmit}>Сохранить</Button> */}
      </div>
      <MultiImagePicker
        existingImages={existingImages}
        setExistingImages={setExistingImages}
        setDeleteImages={setDeleteImages}
        newImages={images}
        setNewImages={setImages}
      />
    </div>
  );
};

export default ProductImages;
