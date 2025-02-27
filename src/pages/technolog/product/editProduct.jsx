import React, { useEffect, useState } from "react";
import Input from "../../../components/ui/inputs/input";
import Button from "../../../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import ProductImages from "./components/shared/productImages";
import { createProduct, createProductImages, editProductById, getProductById, getProductImages } from "../../../store/technolog/product";
import { Toggle } from "rsuite";
import Title from "../../../components/ui/title";
import ProdTable from "./components/shared/prodTable";

const EditProduct = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const { operations, combinations, consumables, prices, } = useSelector(state => state.product);

  const [images, setImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);

  const [productData, setProductData] = useState({
    title: "",
    is_active: true,
    vendor_code: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getProductById({ id })).then(res => {
        if(res.meta.requestStatus === 'fulfilled') {
            setProductData({
                title: res.payload.title,
                is_active: res.payload.is_active,
                vendor_code: res.payload.vendor_code
            })
        }
    })
  }, [])

  const isObjectFilled = (obj) => Object.values(obj).every(value => value !== '');

  const isDataValid = () => {
      return (
          operations.every(isObjectFilled) &&
          consumables.every(isObjectFilled) &&
          prices.every(isObjectFilled)
      );
  };

  const validateFields = () => {
    const newErrors = {
      title: !productData.title,
      vendor_code: !productData.vendor_code
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };
  
  const onSubmit = () => {
    if(validateFields()) {
      if(isDataValid()) {

        const operationsTotal = operations.reduce((total, operation) => total + Number(operation.price), 0) || 0;
        const pricesTotal = prices.reduce((total, price) => total + Number(price.price), 0) || 0;
        const combinationsTotal = combinations.reduce((acc, combination) => {
          const childrenTotal = combination.children.reduce((sum, child) => {
              const price = Number(child.price) || 0; // Приводим к числу, если не число — берём 0
              return sum + price;
          }, 0);
          return acc + childrenTotal;
      }, 0);
        const cost = (Number(operationsTotal) + Number(pricesTotal)) + Number(combinationsTotal) || 0;

        dispatch(editProductById({
            id,
            props: {
                ...productData,
                cost_price: cost,
                prices,
                operations: operations.map(({ equipment, nomenclature, ...op}) => op),
                combinations: combinations.map(item => ({
                  title: item.title,
                  operations: item.children.map(({ equipment, nomenclature, ...op}) => op)
                })),
                consumables
            }
        })).then(res => {
          if(res.meta.requestStatus === 'fulfilled') {
            dispatch(createProductImages({ props: {
              images: images.map(item => item.blobFile),
              deleteImages,
              product_id: res.payload.id
            }}))
            toast.success("Изменения сохранены!")
            navigate(-1)
          }
        })
      } else {
        toast.error('Заполните правильно данные о товаре!');
      }
    } else {
      toast.error('Заполните правильно данные о заказе!');
    }
    console.log(combinations)
  };

  return (
    <>
      <div className="w-full min-h-[100vh] flex flex-col gap-y-5 position-relative">
        <div className="flex justify-between items-center">
          <Title text="Редактирование товара" />
        </div>

        <ProductImages 
          id_product={id}
          images={images}
          setImages={setImages}
          deleteImages={deleteImages}
          setDeleteImages={setDeleteImages}  
        />

        <div className="w-full bg-white rounded-lg px-6 py-6 flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-4">
            <p className="font-inter text-lg font-semibold">Данные о товаре</p>
            <div className="flex gap-x-5 items-center">
              <Input
                width={"300px"}
                type='text'
                label="Название товара"
                placeholder={"Введите название..."}
                value={`${productData.title}`}
                onChange={(e) => setProductData({ ...productData, title: e.target.value })}
                error={errors.title}
              />
              <Input
                width={"300px"}
                type='text'
                label="Артикул"
                placeholder={"Введите артикул..."}
                value={`${productData.vendor_code}`}
                onChange={(e) => setProductData({ ...productData, vendor_code: e.target.value })}
                error={errors.vendor_code}
              />
            </div>
              <Toggle 
                checked={productData?.is_active}
                onChange={(e) => setProductData({ ...productData, is_active: e })}
              >
                Активный
              </Toggle>
          </div>

          <div className="flex flex-col gap-y-4">

            <ProdTable type='edit'/>
          </div>
          <div className="flex justify-center">
            <Button width='180px' onClick={onSubmit}>
                Сохранить
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
