import React, { useEffect, useState } from "react";
import Input from "../../../components/ui/inputs/input";
import Button from "../../../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import ProductImages from "./components/shared/productImages";
import { createProduct, createProductFiles, createProductImages, editProductById, getProductById, getProductImages, getProductInfoById } from "../../../store/technolog/product";
import { Toggle } from "rsuite";
import Title from "../../../components/ui/title";
import ProdTable from "./components/shared/prodTable";
import BackDrop from "../../../components/ui/backdrop";
import { getProductsNames } from "../../../store/technolog/calculation";
import InputWithSuggestion from "../../../components/ui/inputs/inputWithSuggestion";
import { getColors } from "../../../store/technolog/material";
import CombinationsPrint from "./components/shared/combinationsPrint";
import { useReactToPrint } from "react-to-print";
import { Print } from "@mui/icons-material";

const EditProduct = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const { combinations, consumables, prices, product_status } = useSelector(state => state.product);
  const { products } = useSelector(state => state.calculation)
  const { colors_list } = useSelector(state => state.material)
  const printRef = React.useRef();

  const [images, setImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);

  const [files, setFiles] = useState([]);
  const [deleteFiles, setDeleteFiles] = useState([]);

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
    if(!colors_list) {
      dispatch(getColors());
    }
    if(!products) {
      dispatch(getProductsNames())
    }
  }, [])

  const isObjectFilled = (obj) => Object.values(obj).every(value => value !== '');

  const isDataValid = () => {
      return (
          consumables.every(isObjectFilled) &&
          prices.every(isObjectFilled)
      );
  };

  const selectProduct = (data) => {
    dispatch(getProductInfoById({ id: data}))
  }

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

        // const operationsTotal = operations.reduce((total, operation) => total + Number(operation.price), 0) || 0;
        const pricesTotal = prices.reduce((total, price) => total + Number(price.price), 0) || 0;
        const combinationsTotal = combinations.reduce((acc, combination) => {
          const childrenTotal = combination.children.reduce((sum, child) => {
              const price = Number(child.price) || 0; // Приводим к числу, если не число — берём 0
              return sum + price;
          }, 0);
          return acc + childrenTotal;
      }, 0);
        const cost = (Number(pricesTotal)) + Number(combinationsTotal) || 0;

        dispatch(editProductById({
            id,
            props: {
                ...productData,
                cost_price: cost,
                prices,
                combinations: combinations.map(item => ({
                  title: item.title,
                  status: item.status,
                  operations: item.children.map(({ equipment, nomenclature, ...op}) => op)
                })),
                consumables
            }
        })).then(res => {
          if(res.meta.requestStatus === 'fulfilled') {
            dispatch(createProductImages({ props: {
              images: images.map(item => item.blobFile),
              delete_ids: deleteImages,
              product_id: res.payload.id
            }}))
            dispatch(createProductFiles({ props: {
              files: files.map(item => item.blobFile),
              delete_ids: deleteFiles,
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
  };

  const handlePrint = useReactToPrint({
    documentTitle: `Операции товара: ${productData.title}   Артикул: ${productData.vendor_code}`,
    contentRef: printRef,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: Arial;
        }
      }
    `
  })

  return (
    <>
      <div className="w-full min-h-[100vh] flex flex-col gap-y-5 position-relative">
        <div className="flex justify-between items-center">
          <Title text="Редактирование товара" />
          <Button 
            onClick={handlePrint} 
            className='w-max px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            <Print className='mr-2'/>
            Распечатать операции
          </Button>
        </div>

        {
          product_status === 'loading' && <BackDrop/>
        }

        <ProductImages 
          id_product={id}
          images={images}
          setImages={setImages}
          deleteImages={deleteImages}
          setDeleteImages={setDeleteImages} 
          files={files}
          setFiles={setFiles}
          deleteFiles={deleteFiles}
          setDeleteFiles={setDeleteFiles} 
        />

        <div className="hidden">
          <CombinationsPrint ref={printRef}/>
        </div>

        <div className="w-full bg-white rounded-lg px-6 py-6 flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-4">
            <p className="font-inter text-lg font-semibold">Данные о товаре</p>
            <div className="flex gap-x-5 items-center">
              <InputWithSuggestion
                width={"300px"}
                label="Название товара"
                placeholder={"Введите название..."}
                value={productData.title}
                onChange={(e) => setProductData({ ...productData, title: e.target.value })}
                onSelect={(e) => selectProduct(e)}
                suggestions={products || []}
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

            <ProdTable/>
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
