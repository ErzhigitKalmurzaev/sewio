import React, { useState } from 'react'
import Title from '../../../components/ui/title'
import NumInput from '../../../components/ui/inputs/numInput';
import Input from '../../../components/ui/inputs/input';
import Button from '../../../components/ui/button';
import { Table } from 'rsuite';
import NumInputForTable from '../../../components/ui/inputs/numInputForTable';
import TextInputForTable from '../../../components/ui/inputs/textInputForTable';
import { formatNumber } from '../../../utils/functions/numFuncs';
import { CircleMinus, Plus } from 'lucide-react';

const { Cell, Column, HeaderCell } = Table;

const Calculator = () => {

  const [clientData, setClientData] = useState({
    amount: '',
    price: ''
  })
  const [costs, setCosts] = useState([
    {
        title: '',
        price: ''
    }
  ]);

  const getValue = (value, name, index) => {
    const new_costs = [...costs];
    new_costs[index][name] = value;
    setCosts(new_costs)
  }

  const addOne = () => {
    setCosts([...costs, {
        title: '',
        price: ''
    }])
  }

  const deleteRow = (i) => {
    setCosts(costs.filter((item, index) => index !== i));
  }

  const getTotal = (type) => {
    switch (type) {
      case 'payment':
        return formatNumber(clientData?.amount * clientData?.price);
      case 'expenditure':
        return formatNumber(costs.reduce((sum, cost) => { return sum + (clientData.amount * cost.price); }, 0));
      case 'expenditure_one':
        return formatNumber(costs.reduce((sum, cost) => { return Number(sum) + Number(cost.price); }, 0));
      case 'income':
        return formatNumber((clientData?.amount * clientData?.price) - costs.reduce((sum, cost) => { return Number(sum) + (Number(clientData.amount) * Number(cost.price)); }, 0))
      default:
        return 0;
    }
  }


  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-5'>
        <Title text="Калькулятор" />

        <div className='w-full bg-white rounded-lg px-6 py-8 flex flex-col gap-y-5'>
            <div className='flex gap-x-5'>
                <NumInput
                    width={'300px'}
                    label="Количество клиента (шт)"
                    value={clientData.amount}
                    onChange={e => setClientData({...clientData, amount: e})}  
                    placeholder='0'
                />
                <NumInput
                    width={'300px'}
                    label="Цена клиента (сом)"
                    value={clientData.price}
                    onChange={e => setClientData({...clientData, price: e})}  
                    placeholder='0'
                />
            </div>
            <div className='flex flex-col gap-y-4'>
                <p className='font-inter text-lg font-semibold'>Калькулятор расходов</p>
                <div className='flex gap-x-5'>
                    <div className='flex flex-col gap-y-4 w-3/4 h-[400px] overflow-y-auto'>
                        <Table
                            data={costs}
                            height={400}
                            bordered
                            cellBordered
                        >
                            <Column width={250}>
                                <HeaderCell>Название</HeaderCell>
                                <Cell style={{ padding: '7px 6px'}}>
                                    {
                                        (rowData, index) => (
                                            <TextInputForTable
                                                type='text'
                                                value={rowData.title}
                                                placeholder='Название'
                                                onChange={(e) => getValue(e.target.value, 'title', index)}
                                            />
                                        )
                                    }
                                </Cell>
                            </Column>
                            <Column width={200}>
                                <HeaderCell>Цена</HeaderCell>
                                <Cell style={{ padding: '7px 6px'}}>
                                    {
                                        (rowData, index) => (
                                            <NumInputForTable
                                                value={rowData.price}
                                                placeholder='0'
                                                onChange={(e) => getValue(e, 'price', index)}
                                            />
                                        )
                                    }
                                </Cell>
                            </Column>
                            <Column width={200}>
                                <HeaderCell>Итог расход</HeaderCell>
                                <Cell>
                                    {
                                        (rowData, index) => (
                                            <p>{formatNumber(Number(rowData.price) * Number(clientData.amount))}</p>
                                        )
                                    }
                                </Cell>
                            </Column>
                            <Column width={100} align='center'>
                                <HeaderCell>Действия</HeaderCell>
                                <Cell>
                                    {
                                        (rowData, index) => (
                                            <div onClick={() => deleteRow(index)} className='cursor-pointer'>
                                                <CircleMinus color='red' />
                                            </div>
                                        )
                                    }
                                </Cell>
                            </Column>
                            <Column width={100} align='center'>
                                    <HeaderCell style={{ padding: '7px 6px'}}>
                                        <div onClick={addOne} className='w-[40px] flex justify-center items-center border border-primary rounded-md bg-primary cursor-pointer'>
                                            <Plus color='white'/>
                                        </div>
                                    </HeaderCell>
                                    <Cell></Cell>
                            </Column>
                        </Table>
                    </div>
                    <div className='w-1/4 flex flex-col gap-y-10'>
                        <div className='flex flex-col gap-y-4'>
                            <p className='font-inter text-base font-semibold'>
                                Оплата клиента: 
                                <span className='ml-2 text-sprimary'>
                                    {getTotal('payment')}
                                </span>
                            </p>
                            <p className='font-inter text-base font-semibold'>
                                Расход на один товар: 
                                <span className='ml-2 text-sprimary'>
                                    {getTotal('expenditure_one')}
                                </span>
                            </p>
                            <p className='font-inter text-base font-semibold'>
                                Общий расход: 
                                <span className='ml-2 text-redd'>
                                    {getTotal('expenditure')}
                                </span>
                            </p>
                            <p className='font-inter text-base font-semibold'>
                                Прибыль: 
                                <span className='ml-2 text-emerald-600'>
                                    {getTotal('income')}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Calculator


// {
//     costs.map((item, index) => (
//         <div className='flex gap-x-4 items-center' key={index + 'sap'}>
//             <Input
//                 width={'300px'}
//                 type='text'
//                 label='Название'
//                 value={item.title}
//                 placeholder='Название'
//                 onChange={(e) => getValue(e.target.value, 'title', index)}
//             />
//             <NumInput
//                 width={'300px'}
//                 label="Цена (сом)"
//                 value={item.price}
//                 onChange={e => getValue(e, 'price', index)}  
//                 placeholder='0'
//             />
//             <p className='font-inter text-lg font-semibold mt-3'> x {clientData?.amount || 0 } = {clientData?.amount * item.price} </p>
//         </div>
//     ))
// }
