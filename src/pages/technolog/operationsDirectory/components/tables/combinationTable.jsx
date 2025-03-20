import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'rsuite';
import { getCombinationList } from '../../../../../store/technolog/operations';
import { ExternalLink } from 'lucide-react';
import CombinationOpenModal from '../modals/combinationOpenModal';

const { Column, HeaderCell, Cell } = Table;

const CombinationTable = ({ urls }) => {

  const dispatch = useDispatch();

  const { combinations_list, combinations_list_status } = useSelector(state => state.operation);

  const [modals, setModals] = useState({ combination: false, id: null });
  
  useEffect(() => {
    dispatch(getCombinationList({ search: urls.search }))
  }, [])

  const openCombination = (id) => {
    setModals({ ...modals, combination: true, id: id });
  }
  
  return (
    <>
        <Table
            minHeight={500}
            data={combinations_list?.results || []}
            loading={combinations_list_status === 'loading'}
            bordered
            cellBordered
        >
            <Column width={80} align='center'>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={300}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="title" />
            </Column>

            <Column width={300}>
                <HeaderCell>В папке</HeaderCell>
                <Cell>
                    {(rowData) => (
                        <p>{rowData?.file?.title}</p>
                    )}
                </Cell>
            </Column>

            <Column width={300}>
                <HeaderCell>Действия</HeaderCell>
                <Cell>
                    {(rowData) => (
                        <div className="pl-1 flex items-center hover:text-cyan-700 cursor-pointer" onClick={() => openCombination(rowData?.id)}>
                            <p className='text-sx font-medium font-inter'>Открыть</p>
                            <ExternalLink size={18} className='ml-2' />
                        </div>
                    )}
                </Cell>
            </Column>
            
        </Table>
        <CombinationOpenModal modals={modals} setModals={setModals} />
    </>
  )
}

export default CombinationTable
