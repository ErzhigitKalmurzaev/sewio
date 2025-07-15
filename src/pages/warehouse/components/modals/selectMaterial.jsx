import React, { useState } from 'react'
import { Checkbox, Modal, Table } from 'rsuite'
import Input from '../../../../components/ui/inputs/input';
import Button from '../../../../components/ui/button';
import { useSelector } from 'react-redux';


const { Column, HeaderCell, Cell } = Table;

const SelectMaterial = ({ modals, setModals, materials_list, status, search, setSearch, handleSearch, setMaterials }) => {

  const [selectedMaterial, setSelectedMaterial] = useState([]);

  const { colors_list } = useSelector(state => state.material);

  const selectMaterial = (material) => {
    if(selectedMaterial.find(item => item.id === material.id)){
      setSelectedMaterial(selectedMaterial.filter(item => item.id !== material.id));
    } else {
      setSelectedMaterial([...selectedMaterial, material]);
    }
  }

  const onSubmit = () => {
    setMaterials(selectedMaterial);
    setModals({ ...modals, select: false });
    setSelectedMaterial([]);
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
                <Button onClick={() => setModals({ ...modals, select: false, create: true })}>
                  + Создать сырье
                </Button>
              </div>
              <div className='border border-borderGray rounded-lg'>
                <Table
                    loading={status === 'loading'}
                    data={materials_list}
                    cellBordered
                    height={450}
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

                    <Column width={60}>
                        <HeaderCell align="center">Цвет</HeaderCell>
                        <Cell style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {rowData => (
                                rowData?.color ? (
                                    <div style={{ 
                                        background: colors_list?.find(color => color.id === rowData?.color)?.code,
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        border: '1px solid rgba(208, 213, 221, 1)'
                                    }}></div> 
                                ) : (
                                    <p>-</p>
                                )
                            )}
                        </Cell>
                    </Column>
                    <Column width={70}>
                      <HeaderCell>Выбрать</HeaderCell>
                      <Cell style={{ padding: '7px 15px' }}>
                        {rowData => (
                          <div 
                            className="flex cursor-pointer" 
                            onClick={() => selectMaterial(rowData)}
                          >
                            <Checkbox 
                              checked={Boolean(selectedMaterial.find(item => item.id === rowData.id))} 
                              onChange={() => selectMaterial(rowData)}
                            />
                          </div>
                        )}
                      </Cell>
                    </Column>
                </Table>
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

export default SelectMaterial
