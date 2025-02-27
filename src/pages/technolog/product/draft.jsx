import React from 'react'
import NewOperation from '../../../components/modals/product/newOperation';

const FillProduct = () => {

    const [modals, setModals] = useState({ newOperation: false, newCombination: false });
    const [newCombination, setNewCombination] = useState({
        name: '',
        operations: []
    })
    const [newOperation, setNewOperation] = useState({
        title: '',
        equipment: '',

        sizes: [
        {
            size: 's',
            time: 0,
            rank: '',
            materials: []
        },
        {
            size: 'm',
            time: 0,
            rank: '',
            materials: []
        },
        {
            size: 'l',
            time: 0,
            rank: '',
            materials: []
        },
        {
            size: 'xl',
            time: 0,
            rank: '',
            materials: []
        },
        {
            size: 'xxl',
            time: 0,
            rank: '',
            materials: []
        }
        ]
    })
    const [createdProduct, setCreatedProduct] = useState({
        title: '',
        vendor_code: '',
        is_active: true,
        combinations: [],
        operations: []
    })

  return (
    <div>
        <div className="flex flex-col gap-y-4 mt-5">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold font-inter">Комбинации</p>
          <Button onClick={() => setModals({ ...modals, newCombination: true })}>+ Создать комбинацию</Button>
        </div>

        {
          createdProduct.combinations.length > 0 ?
            <div className="bg-white rounded-lg">
              {
                createdProduct.combinations.map((combination, index) => (
                  <Accordion className="border-b border-borderGray rounded-0">
                    <Accordion.Panel header={combination.name}>
                      <p className="text-base font-semibold font-inter my-2">Операции</p>
                      <div className='w-full flex flex-wrap justify-between gap-4 rounded-md p-1' key={index}>
                            {
                                combination?.operations?.map((item, index) => (
                                    <div 
                                        className='w-[49%] gap-x-3 flex justify-between items-center justify-between p-2 rounded-sm py-3 bg-[#FAFAFA] cursor-pointer' 
                                        key={index} 
                                    >
                                        <p className="text-sm font-medium font-inter">{item.name}</p>
                                        <div className="pl-1">
                                          <Trash2 color="red" size={20} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </Accordion.Panel>
                  </Accordion>
                ))
              }
            </div>
            :
            <p className="text-base font-semibold font-inter text-center my-5">Комбинации отсутствуют</p>
        }
      </div>

      <div className="flex flex-col gap-y-4 mt-5">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold font-inter">Операции</p>
          <Button onClick={() => setModals({ ...modals, newOperation: true })}>+ Создать операцию</Button>
        </div>

        <div className="flex flex-col gap-y-6">
          {
            createdProduct.operations.length > 0 ?
            createdProduct.operations.map((operation, index) => (
              <OperationBlock
                key={index}
                operation={operation}
                setNewProduct={setNewProduct}
                index={index}
              />
            ))
            :
            <p className="text-base font-semibold font-inter text-center my-5">Операции отсутствуют</p>
          }
        </div>
      </div>

      {/* Модалки */}

      <NewOperation
        open={modals.newOperation} 
        modals={modals} 
        setModals={setModals} 
        newOperation={newOperation} 
        setNewOperation={setNewOperation}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
      />
      <NewCombination
        open={modals.newCombination}
        modals={modals}
        setModals={setModals}
        newCombination={newCombination}
        setNewCombination={setNewCombination}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
      />
    </div>
  )
}

export default FillProduct

import React, { useEffect, useState } from "react";
import { Accordion, Placeholder, Toggle } from "rsuite";

import MyBreadcrums from "../../../components/ui/breadcrums";
import Title from "../../../components/ui/title";
import Input from "../../../components/ui/inputs/input";
import Button from "./../../../components/ui/button";

import styled from "@emotion/styled/macro";
import { MoveRight, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createProduct } from "../../../store/technolog/product";
import BackDrop from "../../../components/ui/backdrop";
import { useNavigate } from "react-router-dom";
import Select from "../../../components/ui/inputs/select";
import { getSizesList } from "../../../store/technolog/size";

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

  const { size_category_list, size_category_list_status } = useSelector(state => state.size);

  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    vendor_code: '',
    category: '',
    is_active: true
  })
  const [errors, setErrors] = useState({
    title: false,
    vendor_code: false,
    category: false,
    is_active: false
  })

  useEffect(() => {
    dispatch(getSizesList());
  }, [])

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
      vendor_code: !newProduct.vendor_code,
      category: !newProduct.category,
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
            navigate(`/crm/product/${res.payload?.id}`)
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
            <Select
              label="Категория размера"
              placeholder="Выберите категорию размера"
              data={size_category_list || []}
              labelKey='title'
              valueKey='id'
              onChange={(e) => getValue({ target: { value: e, name: 'category' }})}
              error={errors.category}
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
