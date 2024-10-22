import React, { useState } from "react";
import { Accordion, Placeholder } from "rsuite";

import MyBreadcrums from "../../../components/ui/breadcrums";
import Title from "../../../components/ui/title";
import MultiImagePicker from "../../../components/ui/imagePickers/multiImagePicker";
import Input from "../../../components/ui/inputs/input";
import Button from "./../../../components/ui/button";
import NewOperation from "../../../components/modals/product/newOperation";

import styled from "@emotion/styled/macro";
import OperationBlock from "../../../components/shared/product/operationBlock";
import NewCombination from "../../../components/modals/product/newCombination";
import Checkbox from "../../../components/ui/inputs/checkbox";
import { Trash2 } from "lucide-react";

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

  const [modals, setModals] = useState({ newOperation: false, newCombination: false });
  const [newCombination, setNewCombination] = useState({
    name: '',
    operations: []
  })
  const [newOperation, setNewOperation] = useState({
    name: '',
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
  const [newProduct, setNewProduct] = useState({
    name: '',
    article: '',
    combinations: [],
    operations: []
  })

  return (
    <div className="flex flex-col gap-y-5 mb-5">
      <MyBreadcrums items={breadcrumbs} />
      <Title text="Создание товара" />

      <WhiteWrapper>
        <MultiImagePicker />
        <div className="w-3/6 flex flex-col justify-between gap-y-4">
          <Input type="text" label="Название" placeholder="Введите название" />
          <Input type="text" label="Артикул" placeholder="Введите артикул" />
        </div>
      </WhiteWrapper>

      <div className="flex flex-col gap-y-4 mt-5">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold font-inter">Комбинации</p>
          <Button onClick={() => setModals({ ...modals, newCombination: true })}>+ Создать комбинацию</Button>
        </div>

        {
          newProduct.combinations.length > 0 ?
            <div className="bg-white rounded-lg">
              {
                newProduct.combinations.map((combination, index) => (
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
            newProduct.operations.length > 0 ?
            newProduct.operations.map((operation, index) => (
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
