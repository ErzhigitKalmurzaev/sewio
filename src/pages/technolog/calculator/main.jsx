import React, { useEffect, useState } from "react";
import Title from "../../../components/ui/title";
import NumInput from "../../../components/ui/inputs/numInput";
import Input from "../../../components/ui/inputs/input";
import { Table } from "rsuite";
import CalcTable from "./tables/calcTable";
import Button from "../../../components/ui/button";
import { MoveRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { getCalculateList } from "../../../store/technolog/calculation";

const { Cell, Column, HeaderCell } = Table;

const Calculator = () => {

  const dispatch = useDispatch();

  const [costs, setCosts] = useState([]);
  const [clientData, setClientData] = useState({
    title: "",
    cost_price: "",
    price: "",
  });
  
  const onSubmit = () => {
    
  };

  return (
    <div className="w-full min-h-[100vh] flex flex-col gap-y-5">
      <Title text="Калькулятор" />

      <div className="w-full bg-white rounded-lg px-6 py-6 flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-4">
          <p className="font-inter text-lg font-semibold">Данные о заказе</p>
          <div className="flex gap-x-5">
            <Input
              width={"350px"}
              type='text'
              label="Название товара"
              placeholder={"Название товара"}
              value={`${clientData.title}`}
              onChange={(e) => setClientData({ ...clientData, title: e.target.value })}
            />
            <NumInput
              width={"350px"}
              label="Себестоимость товара (сом)"
              value={`${clientData.cost_price}`}
              onChange={(e) => setClientData({ ...clientData, cost_price: e })}
              placeholder="0"
            />
            <NumInput
              width={"350px"}
              label="Цена товара для клиента (сом)"
              value={`${clientData.price}`}
              onChange={(e) => setClientData({ ...clientData, price: e })}
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <p className="font-inter text-lg font-semibold">Калькулятор расходов</p>

          <CalcTable clientData={clientData}/>
        </div>
        <div className="flex justify-end">
          <Button width='180px' onClick={onSubmit}>
              Далее <MoveRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
