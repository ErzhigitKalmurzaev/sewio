import React, { useState } from 'react'
import { Table } from 'rsuite'
import { formatedToDDMMYYYY } from '../../../../../utils/functions/dateFuncs';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as Pencil } from '../../../../../assets/icons/pencil.svg';
import { Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { deleteWorkById, getWorksHistory } from '../../../../../store/foreman/order';
import { toast } from 'react-toastify';

const { Cell, HeaderCell, Column } = Table;

const WorksHistoryTable = ({ data, status }) => {

  const { orderId, id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteStatus, setDeleteStatus] = useState(false);

  const onDelete = (workId) => {
    setDeleteStatus(true);
    dispatch(deleteWorkById({ id: workId })).then(res => {
      if(res.meta.requestStatus === 'fulfilled') {
        toast.success('Работа удалена!');
        dispatch(getWorksHistory({ product: id, order: orderId }));
        setDeleteStatus(false);
      }
    })
  }

  return (
    <div className='min-h-[500px] bg-white rounded-lg'>
        <Table
            data={data || []}
            loading={status === 'loading' || deleteStatus}
            height={500}
            bordered
            cellBordered
            className='rounded-lg text-xs'
        >
            <Column width={60} align="center" verticalAlign="center">
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>
            <Column width={70}>
                <HeaderCell>Партия</HeaderCell>
                <Cell dataKey='party.number' />
            </Column>
            <Column width={120} fullText>
                <HeaderCell>Цвет</HeaderCell>
                <Cell>
                    {
                        rowData => (
                            <span className='font-inter flex items-center'>
                                <span style={{ backgroundColor: rowData.color.code, width: '15px', height: '15px', display: 'inline-block', borderRadius: '50%', marginRight: '5px' }}></span>
                                {rowData.color?.title}
                            </span>
                        )
                    }
                </Cell>
            </Column>
            <Column width={70} align="center" verticalAlign="center">
                <HeaderCell>Размер</HeaderCell>
                <Cell dataKey="size.title" />
            </Column>
            <Column width={100}>
                <HeaderCell>Дата создания</HeaderCell>
                <Cell>
                    {
                        rowData => (
                            <p>{formatedToDDMMYYYY(rowData?.created_at)}</p>
                        )
                    }
                </Cell>
            </Column>
            <Column width={100}>
                <HeaderCell>Дата редактирования</HeaderCell>
                <Cell>
                    {
                        rowData => (
                            <p>{formatedToDDMMYYYY(rowData?.updated_at)}</p>
                        )
                    }
                </Cell>
            </Column>
            <Column flexGrow={1} fixed="right">
                <HeaderCell>Действие</HeaderCell>
                <Cell style={{ padding: '6px' }}>
                    {
                        rowData => (
                            <div className='flex items-center px-3 gap-x-3 py-1 cursor-pointer'>
                                <Pencil onClick={() => navigate(`${rowData.id}`)}/>
                                <Trash2 size={19} color='#d0021b' onClick={() => onDelete(rowData?.id)}/>
                            </div>
                        )
                    }
                </Cell>
            </Column>
        </Table>
    </div>
  )
}

export default WorksHistoryTable
