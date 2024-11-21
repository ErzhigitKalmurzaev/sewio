import React, { useState } from 'react'
import { Checkbox, Modal, Radio, Table, Toggle, Uploader } from 'rsuite'
import Input from '../../../../components/ui/inputs/input';
import Button from '../../../../components/ui/button';
import { CloudUpload, Upload } from 'lucide-react';


const { Column, HeaderCell, Cell } = Table;

const SelectRejectMaterialModal = ({ modals, setModals, materials_list, status, search, setSearch, handleSearch, setMaterials, materials }) => {

  const [selectedMaterial, setSelectedMaterial] = useState({});
  const [files, setFiles] = useState([]);

  const selectMaterial = (material) => {
    setSelectedMaterial(material);
  }

  const onSubmit = () => {
    setMaterials([...materials, {...selectedMaterial, files: files}]);
    setModals({ ...modals, select: false });
    setSelectedMaterial({});
    setFiles([]);
  }

  return (
    <Modal open={modals.select} onClose={() => setModals({ ...modals, select: false })} size='lg'>
        <Modal.Header>
            <Modal.Title>Выбор сырья</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='min-h-[300px] bg-white rounded-lg flex flex-col gap-y-4'>
              <div className='flex justify-between items-center'>
                <Input
                  width='50%'
                  height='34px'
                  searchicon={true}
                  type='text'
                  placeholder='Поиск'
                  value={search}
                  searchHandle={handleSearch}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className='border border-borderGray rounded-lg'>
                <Table
                    loading={status === 'loading'}
                    data={materials_list}
                    cellBordered
                    height={300}
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
                    <Column width={70}>
                        <HeaderCell>Выбрать</HeaderCell>
                        <Cell style={{ padding: '7px 15px'}}>
                          {(rowData, index) => (
                              <div 
                                className='flex cursor-pointer' 
                                key={index + 'check'}
                                onClick={() => selectMaterial(rowData)}
                              >
                                <Radio checked={selectedMaterial?.id === rowData.id}/>
                              </div>
                          )}
                        </Cell>
                    </Column>
                </Table>
              </div>
              <div className='flex flex-col'>
                <Uploader fileList={files} onChange={setFiles} autoUpload={false}>
                    <Button variant='white'>
                        <CloudUpload className='mr-2' size={18}/>
                        Загрузите файл или изображение
                    </Button>
                </Uploader>
              </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='flex justify-end gap-x-4'>
              <Button width='100px' variant='white' onClick={() => setModals({ ...modals, select: false })}>
                Отмена
              </Button>
              <Button width='100px' onClick={onSubmit}>
                Готово
              </Button>
          </div>
        </Modal.Footer>
    </Modal>
  )
}

export default SelectRejectMaterialModal
