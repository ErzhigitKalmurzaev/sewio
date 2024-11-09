import React, { useState } from "react";
import { Accordion, Placeholder, Toggle } from "rsuite";

import MyBreadcrums from "../../../components/ui/breadcrums";
import Title from "../../../components/ui/title";
import Input from "../../../components/ui/inputs/input";
import Button from "./../../../components/ui/button";

import styled from "@emotion/styled/macro";
import { MoveRight, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createProduct } from "../../../store/technolog/product";
import BackDrop from "../../../components/ui/backdrop";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const breadcrumbs = [
    {
      label: "Товары",
      path: "/product",
      active: false,
    },
    {
      label: "Создание товара",
      path: "/product/create",
      active: false,
    },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    vendor_code: '',
    is_active: true
  })
  const [errors, setErrors] = useState({
    title: false,
    vendor_code: false,
    is_active: false
  })

  const getValue = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    })
  }

  const validateFields = () => {
    const newErrors = {
      title: !newProduct.title,
      vendor_code: !newProduct.vendor_code
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error === true);
  }

  const onSubmit = () => {
    if(validateFields()) {
      setLoading(true)
      dispatch(createProduct(newProduct))
        .then(res => {
          if(res.meta.requestStatus === 'fulfilled') {
            setLoading(false);
            navigate(`${res.payload.data.id}`)
          }
        })
    } else {
      toast("Заполните все поля!")
    }
  }

  return (
    <div className="flex flex-col gap-y-5 mb-5">
      <MyBreadcrums items={breadcrumbs} />
      <Title text="Создание товара" />
      {loading && <BackDrop open={loading}/>}

      <WhiteWrapper>
        <div className="flex gap-x-5">
          <div className="w-3/6 flex flex-col justify-between gap-y-4">
            <Input 
              type="text" 
              name="title"
              label="Название" 
              placeholder="Введите название" 
              value={newProduct.title}
              onChange={getValue}
              error={errors.title}
            />
            <Input 
              type="text" 
              name="vendor_code"
              label="Артикул" 
              placeholder="Введите артикул"
              value={newProduct.vendor_code}
              onChange={getValue} 
              error={errors.vendor_code}
            />
            <Toggle 
              checked={newProduct?.is_active}
              onChange={(e) => getValue({ target: { value: e, name: 'is_active' }})}
            >
              Активный
            </Toggle>
          </div>
          <div className="w-3/6 flex justify-between items-end">
            <p className="font-inter text-semibold">
              Для создания товара сначала заполните основную информацию, и нажмите кнопку "Далее"
            </p>
            <Button width='180px' onClick={onSubmit}>
                Далее <MoveRight className="ml-2" />
            </Button>
          </div>
        </div>
      </WhiteWrapper>

    </div>
  );
};

export default CreateProduct;

const WhiteWrapper = styled("div")`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 15px 20px 30px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
