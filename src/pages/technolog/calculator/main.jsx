import React, { useEffect, useState } from "react";
import Title from "../../../components/ui/title";
import NumInput from "../../../components/ui/inputs/numInput";
import Input from "../../../components/ui/inputs/input";
import CalcTable from "./tables/calcTable";
import Button from "../../../components/ui/button";
import { MoveRight, Notebook, NotepadText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createCalculation, getClientsNames } from "../../../store/technolog/calculation";
import StickyBox from "../../../components/ui/stickyBox";
import SelectUser from "../../../components/ui/inputs/selectUser";
import { useNavigate } from "react-router-dom";

const Calculator = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { clients, operations, consumables, prices } = useSelector(state => state.calculation);

  useEffect(() => {
    dispatch(getClientsNames())
  }, [])

  const [clientData, setClientData] = useState({
    title: "",
    count: "",
    price: "",
    client: "",
    vendor_code: "1221087"
  });
  const [errors, setErrors] = useState({});

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
      }))
    }
  };

  return (
    <>
      <StickyBox count={clientData.count} price={clientData.price}/>
      <div className="w-full min-h-[100vh] flex flex-col gap-y-5 position-relative">
        <div className="flex justify-between items-center">
          <Title text="Калькулятор" />
          <Button onClick={() => navigate('history')}>
            <NotepadText className="mr-1" /> История
          </Button>
        </div>

        <div className="w-full bg-white rounded-lg px-6 py-6 flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-4">
            <p className="font-inter text-lg font-semibold">Данные о заказе</p>
            <div className="flex gap-x-5 items-center">
              <Input
                width={"250px"}
                type='text'
                label="Название товара"
                placeholder={"Название товара"}
                value={`${clientData.title}`}
                onChange={(e) => setClientData({ ...clientData, title: e.target.value })}
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

            <CalcTable clientData={clientData}/>
          </div>
          <div className="flex justify-end">
            <Button width='180px' onClick={onSubmit}>
                Сохранить
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calculator;
