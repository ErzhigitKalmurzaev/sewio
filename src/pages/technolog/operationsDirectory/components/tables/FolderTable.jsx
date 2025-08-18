import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Loader, Table } from 'rsuite'
import { getCombinationById, getFolderById, getFolderList } from '../../../../../store/technolog/operations';
import { ExternalLink, FolderClosed } from 'lucide-react';
import FolderOpenModal from '../modals/folderOpenModal';
import { useSearchParams } from 'react-router-dom';
import OperationOpenModal from '../modals/operationOpenModal';

const { Column, HeaderCell, Cell } = Table;

const FolderTable = ({ urls, params, setParams }) => {

  const dispatch = useDispatch();

  const { folders_list, folders_list_status } = useSelector(state => state.operation);

  const [modals, setModals] = useState({ operation: false, id: null });

  useEffect(() => {
    dispatch(getFolderList({ search: urls.search }))
  }, [])

  return (
    <div className='w-full'>
        <Table
            height={500}
            data={folders_list || []}
            loading={folders_list_status === 'loading'}
            bordered
            cellBordered
            className='rounded-xl'
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
                <HeaderCell>Действия</HeaderCell>
                <Cell>
                    {(rowData) => (
                        <div className="pl-1 flex items-center hover:text-cyan-700 cursor-pointer" onClick={() => setModals({ ...modals, folder: true, id: rowData.id })}>
                            <p className='text-sx font-medium font-inter'>Открыть</p>
                            <ExternalLink size={18} className='ml-2' />
                        </div>
                    )}
                </Cell>
            </Column>
            
        </Table>

        <FolderOpenModal modals={modals} setModals={setModals} />
    </div>
  )
}

export default FolderTable
