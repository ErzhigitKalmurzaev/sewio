import React, { useEffect, useState } from 'react'
import { Table } from 'rsuite'
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../../components/ui/button';
import RejectMaterials from '../../../reject/rejectMaterials';
import Textarea from '../../../../../components/ui/inputs/textarea';
import { postRejectMaterials, postRejectMaterialsFiles } from '../../../../../store/warehouse/materails';

const { Column, HeaderCell, Cell } = Table;

const RejectMaterialsTable = ({ data, status }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dataForInput, setDataForInput] = useState([]);

  useEffect(() => {
    setDataForInput(data?.map(item => ({...item, amount: '', price: ''})) || [] );
  }, [data?.length])

  const [comment, setComment] = useState('');

  const getValue = (name, value, id) => {
    const index = dataForInput.findIndex(item => item.id === id);
    const data = dataForInput;
    data[index] = {...dataForInput[index], [name]: value};
    setDataForInput(data);
  }


  const validateField = () => {
    return dataForInput.every(material => material.amount)
  }

  const onSubmit = () => {
    const data = dataForInput.map(material => ({
      product_id: material.id,
      amount: Number(material.amount),
      price: 0
    }));

    const dataWithFiles = dataForInput.map(item => ({
      product_id: item.id,
      files: item.files.map(item => item.blobFile)
    }));

    if(validateField()) {
        dispatch(postRejectMaterials({comment, products: data}))
        .then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                dispatch(postRejectMaterialsFiles(dataWithFiles))
                    .then(res => {
                        if(res.meta.requestStatus === 'fulfilled') {
                            navigate(-1)
                            toast("Брак успешно оформлен!")
                        }
                    })
            }
        })
        console.log(dataForInput)
    } else {
        console.log(dataForInput)
        toast("Заполните все поля!")
    }
  }

  return (
    <div className='flex flex-col gap-y-6'>
        <div className='min-h-[400px] bg-white rounded-xl'>
            <Table
                loading={status === 'loading'}
                data={dataForInput}
                minHeight={300}
                cellBordered
                rowExpandedHeight={100}
                wordWrap='break-word'
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
                                    name='amount'
                                    placeholder='0'
                                    value={`${rowData.amount}`}
                                    onChange={(value) => getValue('amount', value, rowData.id)}
                                />
                            )
                        }
                    </Cell>
                </Column>

                <Column width={150}>
                    <HeaderCell>Файлы</HeaderCell>
                    <Cell>
                        {
                            rowData => (
                                rowData?.files?.map(item => (
                                    <p>{item.name}</p>
                                ))
                            )
                        }
                    </Cell>
                </Column>
            </Table>
        </div>
        <div className='p-4 bg-white rounded-xl'>
            <Textarea 
                label='Комментарий' 
                placeholder='Введите комментарий...'
                rows={5}
                value={comment}
                onChange={e => setComment(e)}
            />
        </div>
        <div className='flex justify-center'>
            <Button width='200px' onClick={onSubmit}>Сохранить</Button>
        </div>
    </div>
  )
}

export default RejectMaterialsTable
