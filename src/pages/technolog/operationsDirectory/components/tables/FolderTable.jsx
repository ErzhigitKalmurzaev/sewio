import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'rsuite'
import { getFolderList } from '../../../../../store/technolog/operations';

const { Column, HeaderCell, Cell } = Table;

const FolderTable = () => {

  const dispatch = useDispatch();

  const { folders_list, folders_list_status } = useSelector(state => state.operation);

  useEffect(() => {
    dispatch(getFolderList())
  }, [])

  return (
    <Table
        minHeight={480}
        data={folders_list || []}
        loading={folders_list_status === 'loading'}
        bordered
    >
      <Column width={80} align='center'>
        <HeaderCell>ID</HeaderCell>
        <Cell dataKey="id" />
      </Column>

      <Column width={300}>
        <HeaderCell>Название</HeaderCell>
        <Cell dataKey="title" />
      </Column>
    </Table>
  )
}

export default FolderTable
