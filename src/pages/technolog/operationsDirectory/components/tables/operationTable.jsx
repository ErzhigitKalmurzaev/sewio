import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'rsuite';
import { getOperationList } from '../../../../../store/technolog/operations';
import { ExternalLink } from 'lucide-react';
import CombinationOpenModal from '../modals/combinationOpenModal';
import TableDropdown from '../../../../../components/tables/tableDropdown';
import OperationOpenModal from '../modals/operationOpenModal';

const { Column, HeaderCell, Cell } = Table;

const OperationTable = ({ urls }) => {

  const dispatch = useDispatch();

  const { operaitions_list, operaitions_list_status } = useSelector(state => state.operation);

  const [modals, setModals] = useState({ combination: false, id: null });
  
  useEffect(() => {
    dispatch(getOperationList({ search: urls.search }))
  }, [])

  const openOperation = (id) => {
    setModals({ ...modals, operation: true, id: id });
  }

  const handleChangeFilter = (name, value) => {
    dispatch(getOperationList({ search: urls.search, [name]: value }))
  }
  
  return (
    <>
        <Table
            height={500}
            data={operaitions_list?.results || []}
            loading={operaitions_list_status === 'loading'}
            bordered
            cellBordered
            className='rounded-xl'
        >
            <Column width={80} align='center'>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={400}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="title" />
            </Column>

            <Column width={140}>
                <HeaderCell>
                    <TableDropdown
                      title="Cтатус" 
                      data={[{value: '', label: 'Все'}, { value: true, label: 'Активен' }, { value: false, label: 'Не активен' }]} 
                      handleChangeFilter={handleChangeFilter}
                      name='is_active'
                    /> 
                </HeaderCell>
                <Cell>
                    {rowData => (rowData.is_active ? 'Активен' : 'Не активен')}
                </Cell>
            </Column>

            <Column width={120}>
                <HeaderCell>Время (сек)</HeaderCell>
                <Cell dataKey="time" />
            </Column>
            
            <Column width={120}>
                <HeaderCell>Цена (сом)</HeaderCell>
                <Cell dataKey="price" />
            </Column>

            <Column width={300}>
                <HeaderCell>Действия</HeaderCell>
                <Cell>
                    {(rowData) => (
                        <div className="pl-1 flex items-center hover:text-cyan-700 cursor-pointer" onClick={() => openOperation(rowData?.id)}>
                            <p className='text-sx font-medium font-inter'>Открыть</p>
                            <ExternalLink size={18} className='ml-2' />
                        </div>
                    )}
                </Cell>
            </Column>
            
        </Table>
        <OperationOpenModal modals={modals} setModals={setModals} />
    </>
  )
}

export default OperationTable
