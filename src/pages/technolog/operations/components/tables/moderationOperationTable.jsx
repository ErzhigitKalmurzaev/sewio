import React from 'react'
import { Table } from 'rsuite'
import Button from '../../../../../components/ui/button'
import { formatedToDDMMYYYY } from '../../../../../utils/functions/dateFuncs'
import { formatNumber } from '../../../../../utils/functions/numFuncs'
import { useDispatch } from 'react-redux'
import { acceptOperation } from '../../../../../store/technolog/order'
import { toast } from 'react-toastify'

const { Column, HeaderCell, Cell } = Table

const ModerationOperationTable = ({ data, status, setUpdate }) => {
   
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(acceptOperation({ work_id: data?.id }))
        .then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                toast("Операция успешно принята!")
                setUpdate(true)
            }
        })
  }

  return (
    <div className='min-h-[400px] font-inter bg-white rounded-xl'>
      <Table
            loading={status === 'loading'}
            data={data}
            cellBordered
            height={400}
            className='rounded-xl'
        >
            <Column width={80} align='center'>
                <HeaderCell>ID заказа</HeaderCell>
                <Cell dataKey="order" />
            </Column>

            <Column width={200}>
                <HeaderCell>Сотрудник</HeaderCell>
                <Cell>
                    {(rowData) => (
                        <p>{rowData.staff?.surname} {rowData.staff?.name}</p>
                    )}
                </Cell>
            </Column>

            <Column width={200}>
                <HeaderCell>Название операции</HeaderCell>
                <Cell>
                    {(rowData) => (
                        <p>{rowData.details[0]?.operation_title}</p>
                    )}
                </Cell>
            </Column>

            <Column width={200}>
                <HeaderCell>Количество</HeaderCell>
                <Cell>
                    {(rowData) => (
                        <p>{formatNumber(rowData.details[0]?.amount)}</p>
                    )}
                </Cell>
            </Column>

            <Column width={200}>
                <HeaderCell>Дата</HeaderCell>
                <Cell>
                    {(rowData) => (
                        <p>{formatedToDDMMYYYY(rowData.created_at)}</p>
                    )}
                </Cell>
            </Column>

            <Column width={100}>
                <HeaderCell>Действия</HeaderCell>
                <Cell style={{ padding: '7px 10px'}}>
                    {(rowData, index) => (
                        <div>
                            <Button onClick={() => onSubmit(rowData)}>Принять</Button>
                        </div>
                    )}
                </Cell>
            </Column>
      </Table>
    </div>
  )
}

export default ModerationOperationTable
