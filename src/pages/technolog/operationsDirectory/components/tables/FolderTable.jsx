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

  const { folders_list, folders_list_status, folder, folder_status, combination, combination_status } = useSelector(state => state.operation);

  const [modals, setModals] = useState({ operation: false, id: null });

  useEffect(() => {
    if(urls.stage == 1) {
      dispatch(getFolderList({ search: urls.search }))
    } else if(urls.stage == 2) {
      dispatch(getFolderById({ id: urls.folder }))
    } else if(urls.stage == 3) {
      dispatch(getCombinationById({ id: urls.folder }))
    }
  }, [])

  const openFolder = (id) => {
    params.set('stage', 2);
    params.set('folder', id);
    setParams(params)
    dispatch(getFolderById({ id }))
  }

  const openCombinationFolder = (id) => {
    params.set('stage', 3);
    params.set('folder', id);
    setParams(params)
    dispatch(getCombinationById({ id }))
  }

  const openOperation = (id) => {
    setModals({ ...modals, operation: true, id: id})
  }

  const getLoader = (stage) => {
    switch(stage) {
      case 1:
        return folders_list_status === 'loading';
      case 2: 
        return folder_status === 'loading';
      case 3: 
        return combination_status === 'loading';
      default: 
        return false
    }
  }

  return (
    <div className='w-full'>
        <div className='flex flex-col gap-y-3'>
          {
            urls.stage == 1 && 
            (
              folders_list_status === 'success' &&
              folders_list?.length > 0 ? 
                folders_list?.map((folder, index) => (
                  <button 
                    className='flex items-center gap-x-1 hover:bg-zinc-200 pl-2' 
                    onDoubleClick={() => openFolder(folder.id)} 
                    key={index + " folder"}>
                      <span className='text-2xl'>📁</span>
                      <span className='font-medium font-inter m-0'>{folder.title}</span>
                  </button>
                )) :
                <p className='font-inter text-center'>(Пусто)</p>
            )
          }
          {
            urls.stage == 2 &&
            (
              folder_status === 'success' && 
              folder?.combinations?.length > 0 ?
                folder?.combinations?.map((combination, index) => (
                  <button 
                    className='flex items-center gap-x-1 hover:bg-zinc-200 pl-2' 
                    onDoubleClick={() => openCombinationFolder(combination.id)} 
                    key={index + " folder"}>
                      <span className='text-2xl'>📁</span>
                      <span className='font-medium font-inter m-0'>{combination.title}</span>
                  </button>
                )) :
                <p className='font-inter text-center'>(Пусто)</p>
            )
          }
          {
            urls.stage == 3 &&
            (
              combination_status === 'success' && 
              combination?.operations?.length > 0 ?
                combination?.operations?.map((operation, index) => (
                  <button 
                    className='flex items-center gap-x-1 hover:bg-zinc-200 pl-2' 
                    onDoubleClick={() => openOperation(operation.id)} 
                    key={index + " folder"}>
                      <span className='text-2xl'>📁</span>
                      <span className='font-medium font-inter m-0'>{operation.title}</span>
                  </button>
                )) : 
                <p className='font-inter text-center'>(Пусто)</p>
            )
          }
          {
            getLoader(urls.stage) &&
            <Loader center vertical content="Loading..." />
          }
        </div>

        <OperationOpenModal modals={modals} setModals={setModals}/>
    </div>
  )
}

export default FolderTable
