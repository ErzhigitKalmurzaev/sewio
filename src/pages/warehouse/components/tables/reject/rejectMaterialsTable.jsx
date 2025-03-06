import React, { useState } from 'react'
import { Table } from 'rsuite'
import { ReactComponent as Pencil } from '../../../../../assets/icons/pencil.svg';
import EditSelectRejectMaterialModal from '../../modals/reject/editSelectRejectMaterialModal';

const { Column, HeaderCell, Cell } = Table;

const RejectMaterialsTable = ({ data, setMaterials }) => {
    const [editModal, setEditModal] = useState(false);
    const [editableMaterial, setEditableMaterial] = useState(null);
  
    const openEditModal = (material) => {
      setEditableMaterial(material);
      setEditModal(true);
    };
  
    return (
      <div className='flex flex-col gap-y-6'>
        <div className='min-h-[400px] bg-white rounded-xl'>
          <Table
            data={data}
            minHeight={300}
            cellBordered
            className='rounded-xl'
          >
            <Column width={80} align='center'>
              <HeaderCell>ID</HeaderCell>
              <Cell dataKey="id" />
            </Column>
            <Column width={200}>
              <HeaderCell>Название</HeaderCell>
              <Cell dataKey="title" />
            </Column>
            <Column width={150}>
              <HeaderCell>Артикул</HeaderCell>
              <Cell dataKey="vendor_code" />
            </Column>
            <Column width={150}>
              <HeaderCell>Количество</HeaderCell>
              <Cell dataKey="amount" />
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Комментарий</HeaderCell>
              <Cell dataKey="comment" />
            </Column>
            <Column width={120} align='center'>
              <HeaderCell>Редактировать</HeaderCell>
              <Cell>
                {(rowData) => (
                  <button onClick={() => openEditModal(rowData)}>
                    <Pencil/>
                  </button>
                )}
              </Cell>
            </Column>
          </Table>
        </div>

        <EditSelectRejectMaterialModal
          modals={editModal}
          setModals={setEditModal}
          materials_list={editableMaterial}
          values={editableMaterial}
          setMaterials={setMaterials}
          materials={data}
        />
      </div>
    );
  };
  
  export default RejectMaterialsTable;
  