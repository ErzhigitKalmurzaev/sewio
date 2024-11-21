import React from 'react'
import { Table } from 'rsuite'
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import { fillWarehouseWithMaterial } from '../../../../../store/technolog/material';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../../components/ui/button';

const { Column, HeaderCell, Cell } = Table;

const InputMaterialsTable = ({ data, status }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dataForInput =  data?.map(item => ({...item, amount: '', price: ''} )) || [];

  const getValue = (name, value, id) => {
    const index = dataForInput.findIndex(item => item.id === id);
    dataForInput[index] = {...dataForInput[index], [name]: value};
  }


  const validateField = () => {
    return dataForInput.every(material => material.amount && material.price)
  }

  const onSubmit = () => {
    const data = dataForInput.map(material => ({
      product_id: material.id,
      amount: Number(material.amount),
      price: Number(material.price)
    }));

    if(validateField()) {
        dispatch(fillWarehouseWithMaterial(data))
        .then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                navigate(-1)
                toast("Склад успешно заполнен!")
            }
        })
    } else {
        toast("Заполните все поля!")
    }
  }

  return (
    <div className='flex flex-col gap-y-6'>
        <div className='min-h-[400px] bg-white rounded-xl'>
            <Table
                loading={status === 'loading'}
                data={dataForInput}
                height={450}
                cellBordered
                className='rounded-xl'
            >
                <Column width={80} align='center'>
                    <HeaderCell>ID</HeaderCell>
                    <Cell dataKey="id" />
                </Column>
                <Column width={120} sty>
                    <HeaderCell className='pl-2'>Артикул</HeaderCell>
                    <Cell dataKey="vendor_code" />
                </Column>

                <Column width={200}>
                    <HeaderCell>Название</HeaderCell>
                    <Cell dataKey="title" />
                </Column>

                <Column width={150}>
                    <HeaderCell>Количество</HeaderCell>
                    <Cell style={{ padding: '8px 6px'}}>
                        {
                            rowData => (
                                <NumInputForTable
                                    placeholder='0'
                                    value={rowData.amount}
                                    onChange={(value) => getValue('amount', value, rowData.id)}
                                />
                            )
                        }
                    </Cell>
                </Column>

                <Column width={150}>
                    <HeaderCell>Цена</HeaderCell>
                    <Cell style={{ padding: '8px 6px'}}>
                        {
                            rowData => (
                                <NumInputForTable
                                    placeholder='0'
                                    value={rowData.price}
                                    onChange={(value) => getValue('price', value, rowData.id)}
                                />
                            )
                        }
                    </Cell>
                </Column>
            </Table>
        </div>
        <div className='flex justify-center'>
            <Button width='200px' onClick={onSubmit}>Сохранить</Button>
        </div>
    </div>
  )
}

export default InputMaterialsTable
