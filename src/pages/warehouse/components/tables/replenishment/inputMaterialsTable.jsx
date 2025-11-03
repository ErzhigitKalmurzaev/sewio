import React, { useState, useEffect } from 'react'
import { Table } from 'rsuite'
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import { fillWarehouseWithMaterial } from '../../../../../store/technolog/material';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../../components/ui/button';

const { Column, HeaderCell, Cell } = Table;

const InputMaterialsTable = ({ data, status }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { colors_list } = useSelector(state => state.material);

  const [dataForInput, setDataForInput] = useState([]);
  const [loading, setLoading] = useState(false);

  // Инициализируем данные при получении
  useEffect(() => {
    if (data) {
      setDataForInput(data.map(item => ({
        ...item,
        amount: '',
        price: '',
        kurs: ''
      })));
    }
  }, [data]);

  const getValue = (name, value, id) => {
    setDataForInput(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, [name]: value } : item
      )
    );
  }

  const validateField = () => {
    return dataForInput.every(material => material.amount && material.price && material.kurs)
  }

  const onSubmit = () => {
    const submitData = dataForInput.map(material => ({
      product_id: material.id,
      amount: Number(material.amount),
      price: Number(material.price) * Number(material.kurs) * Number(material.amount)
    }));
    setLoading(true)
    if(validateField()) {
        dispatch(fillWarehouseWithMaterial(submitData))
        .then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                navigate(-1)
                toast("Склад успешно заполнен!")
                setLoading(false)
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
                <Column width={120}>
                    <HeaderCell className='pl-2'>Артикул</HeaderCell>
                    <Cell>
                        {
                            rowData => (
                                <p>{rowData?.vendor_code ? rowData.vendor_code : '-/-'}</p>
                            )
                        }
                    </Cell>
                </Column>

                <Column width={200}>
                    <HeaderCell>Название</HeaderCell>
                    <Cell dataKey="title" />
                </Column>

                <Column width={60}>
                    <HeaderCell align="center">Цвет</HeaderCell>
                    <Cell style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {rowData => (
                            rowData?.color ? (
                                <div style={{ 
                                    background: colors_list?.find(color => color.id === rowData?.color)?.code,
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    border: '1px solid rgba(208, 213, 221, 1)'
                                }}></div> 
                            ) : (
                                <p>-</p>
                            )
                        )}
                    </Cell>
                </Column>

                <Column width={120}>
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

                <Column width={120}>
                    <HeaderCell>Курс к сому</HeaderCell>
                    <Cell style={{ padding: '8px 6px'}}>
                        {
                            rowData => (
                                <NumInputForTable
                                    placeholder='0'
                                    value={rowData.kurs}
                                    onChange={(value) => getValue('kurs', value, rowData.id)}
                                />
                            )
                        }
                    </Cell>
                </Column>

                <Column width={120}>
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

                <Column width={200}>
                    <HeaderCell>Цена в сомах за 1 ед.</HeaderCell>
                    <Cell style={{ padding: '14px 12px'}}>
                        {
                            rowData => {
                                const priceInSom = (Number(rowData.price) || 0) * (Number(rowData.kurs) || 0);
                                return (
                                    <p className='text-start font-medium'>
                                        {priceInSom > 0 ? priceInSom.toFixed(2) : '0.00'} сом
                                    </p>
                                )
                            }
                        }
                    </Cell>
                </Column>
            </Table>
        </div>
        <div className='flex justify-center'>
            <Button width='200px' loading={loading} onClick={onSubmit}>Сохранить</Button>
        </div>
    </div>
  )
}

export default InputMaterialsTable