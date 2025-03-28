import React, { useEffect, useState } from "react";
import Title from "../../../components/ui/title";
import NumInput from "../../../components/ui/inputs/numInput";
import Input from "../../../components/ui/inputs/input";
import CalcTable from "./components/tables/calcTable";
import Button from "../../../components/ui/button";
import { MoveRight, Notebook, NotepadText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearAll, createCalculation, getClientsNames, getProductInfoById, getProductsNames } from "../../../store/technolog/calculation";
import StickyBox from "../../../components/ui/stickyBox";
import SelectUser from "../../../components/ui/inputs/selectUser";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import TextInputForTable from "../../../components/ui/inputs/inputWithSuggestions";
import InputWithSuggestion from "../../../components/ui/inputs/inputWithSuggestion";
import { createProduct } from "../../../store/technolog/product";
import CreateProductModal from "./components/modals/createProductModal";

const Calculator = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { clients, operations, consumables, prices, products } = useSelector(state => state.calculation);

  useEffect(() => {
    dispatch(getClientsNames());
    dispatch(clearAll());
    dispatch(getProductsNames())
  }, [])

  const [clientData, setClientData] = useState({
    title: "",
    count: "",
    price: "",
    client: "",
    vendor_code: "1221087"
  });
  const [productData, setProductData] = useState({
    title: "",
    is_active: true,
    vendor_code: ""
  });
  const [modals, setModals] = useState({ product: false });
  const [errors, setErrors] = useState({});

  const isObjectFilled = (obj) => Object.values(obj).every(value => value !== '');

  const isDataValid = () => {
      return (
          operations.every(isObjectFilled) &&
          consumables.every(isObjectFilled) &&
          prices.every(isObjectFilled)
      );
  };

  const selectProduct = (data) => {
    dispatch(getProductInfoById({ id: data}))
  }

  const validateFields = () => {
    const newErrors = {
      title: !clientData.title,
      count: !clientData.count,
      price: !clientData.price,
      client: !clientData.client
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };
  
  const onSubmit = () => {
    if(validateFields()) {
      if(isDataValid()) {
        const operationsTotal = operations.reduce((total, operation) => total + Number(operation.price), 0) || 0;
        const consumablesTotal = consumables.reduce((total, consumable) => total + Number(consumable.price), 0) || 0;
        const pricesTotal = prices.reduce((total, price) => total + Number(price.price), 0) || 0;
        const cost = (Number(operationsTotal) + Number(consumablesTotal) + Number(pricesTotal)) || 0;

        dispatch(createCalculation({
          ...clientData,
          cost_price: cost,
          cal_operations: [...operations],
          cal_consumables: [...consumables],
          cal_prices: [...prices]
        })).then(res => {
          if(res.meta.requestStatus === 'fulfilled') {
            navigate(`history`);
            toast.success('Товар успешно сохранен!');
          }
        })
      } else {
        toast.error('Заполните правильно данные о товаре!');
      }
    } else {
      toast.error('Заполните правильно данные о заказе!');
    }
  };

  const handleCreateProduct = (name) => {
      if(isDataValid()) {

        const operationsTotal = operations.reduce((total, operation) => total + Number(operation.price), 0) || 0;
        const pricesTotal = prices.reduce((total, price) => total + Number(price.price), 0) || 0;
        const cost = (Number(operationsTotal) + Number(pricesTotal)) || 0;

        dispatch(createProduct({
          ...productData,
          cost_price: cost,
          prices,
          operations,
          consumables
        })).then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
              toast.success("Товар создан успешно!")
              if(name === 'order') {
                if(res.payload?.id) {
                  navigate(`order/${res.payload?.id}`)
                } else {
                  toast.error('Произошла ошибка с перенаправлением! Попробуйте найти товар в разделе "Товары"!')
                }
              } else {
                navigate('/crm/product')
              }
            } else {
              toast.error('Произошла ошибка!')
            }
        })
      } else {
        toast.error('Заполните правильно данные о товаре!');
      }
  }

  const nextMove = (name) => {
    if(isDataValid()) {
        setModals({ product: true, name: name });
    } else {
      toast.error('Заполните правильно все данные!');
    }
  }

  return (
    <>
      <StickyBox count={clientData.count} price={clientData.price}/>
      <div className="w-full min-h-[100vh] flex flex-col gap-y-5 position-relative">
        <div className="flex justify-between items-center">
          <Title text="Калькулятор" />
          <Button width='120px' onClick={() => navigate('history')}>
              <NotepadText className="mr-2" size={22} />
              <p className="font-inter">История</p>
          </Button>
        </div>

        <div className="w-full bg-white rounded-lg px-6 py-6 flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-4">
            <p className="font-inter text-lg font-semibold">Данные о заказе</p>
            <div className="flex gap-x-5 items-center">
              <InputWithSuggestion
                width={"250px"}
                label="Название товара"
                placeholder="Название товара"
                onChange={(e) => setClientData({ ...clientData, title: e.target.value })}
                onSelect={(e) => selectProduct(e)}
                suggestions={products || []}
                error={errors.title}
              />
              <SelectUser
                width={"250px"}
                label="Клиент"
                placeholder="Клиент"
                data={clients || []}
                onChange={(e) => setClientData({ ...clientData, client: e })}
                error={errors.client}
                searchable={true}
                valueKey='id'
                labelKey='name'
              />
              <NumInput
                width={"250px"}
                label="Цена товара для клиента (сом)"
                value={`${clientData.price}`}
                onChange={(e) => setClientData({ ...clientData, price: e })}
                placeholder="0"
                error={errors.price}
              />
              <NumInput
                width={"250px"}
                label="Количество"
                value={`${clientData.count}`}
                onChange={(e) => setClientData({ ...clientData, count: e })}
                placeholder="0"
                error={errors.count}
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-4">
            <p className="font-inter text-lg font-semibold">Калькулятор расходов</p>

            <CalcTable type='new'/>
          </div>
          <div className="flex justify-start gap-x-8">
            <Button width='150px' variant="blue" onClick={() => nextMove('product')}>
                Создать товар
            </Button>
            <Button width='150px' variant="petrol" onClick={() => nextMove('order')}>
                Создать заказ
            </Button>
            <Button width='150px' onClick={onSubmit}>
                Сохранить
            </Button>
          </div>
        </div>
      </div>

      <CreateProductModal
        modals={modals}
        setModals={setModals}
        product={productData}
        setProduct={setProductData}
        onSubmit={handleCreateProduct}
        clientData={clientData}
      />
    </>
  );
};

export default Calculator;
