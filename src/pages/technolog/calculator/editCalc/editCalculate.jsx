import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editCalculationById, getCalculateById, getClientsNames } from '../../../../store/technolog/calculation';
import { useNavigate, useParams } from 'react-router-dom';
import Title from '../../../../components/ui/title';
import Input from '../../../../components/ui/inputs/input';
import SelectUser from '../../../../components/ui/inputs/selectUser';
import NumInput from '../../../../components/ui/inputs/numInput';
import CalcTable from '../components/tables/calcTable';
import Button from '../../../../components/ui/button';
import { toast } from 'react-toastify';

const EditCalculate = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getClientsNames())
    dispatch(getCalculateById({ id })).then(res => {
      if(res.meta.requestStatus === 'fulfilled') {
        setClientData({
          title: res.payload.title,
          count: res.payload.count,
          price: res.payload.price,
          client: res.payload.client,
          vendor_code: res.payload.vendor_code
        })
      }
    })
  }, [id])

  const { clients, operations, consumables, prices,  } = useSelector(state => state.calculation);

  const [clientData, setClientData] = useState({
    title: "",
    count: "",
    price: "",
    client: "",
    vendor_code: ""
  });
  const [errors, setErrors] = useState({});

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

        dispatch(editCalculationById({ id, props: {
          ...clientData,
          cost_price: cost,
          cal_operations: [...operations],
          cal_consumables: [...consumables],
          cal_prices: [...prices]
        }})).then(res => {
          if(res.meta.requestStatus === 'fulfilled') {
            navigate(-1);
            toast.success('Изменения сохранены!');
          }
        })
      } else {
        toast.error('Заполните правильно данные о товаре!');
      }
    } else {
      toast.error('Заполните правильно данные о заказе!');
    }
  };

  return (
    <div className="w-full min-h-[100vh] flex flex-col gap-y-5">
        <div className="flex justify-between items-center">
          <Title text="История" />
        </div>

        <div className="w-full bg-white rounded-lg px-6 py-6 flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-4">
            <p className="font-inter text-lg font-semibold">Данные о заказе</p>
            <div className="flex gap-x-5 items-center">
              <Input
                width={"250px"}
                type='text'
                label="Название товара"
                placeholder={"Введите название..."}
                value={`${clientData.title}`}
                onChange={(e) => setClientData({ ...clientData, title: e.target.value })}
                error={errors.title}
              />
              <SelectUser
                width={"250px"}
                label="Клиент"
                placeholder="Клиент"
                data={clients || []}
                value={clientData.client}
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

            <CalcTable type='edit'/>
          </div>
          <div className="flex justify-end">
            <Button width='180px' onClick={onSubmit}>
                Сохранить
            </Button>
          </div>
        </div>
    </div>
  )
}

export default EditCalculate
