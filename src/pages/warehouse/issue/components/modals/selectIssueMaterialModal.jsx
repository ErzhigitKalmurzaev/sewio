import React, { useState } from 'react'
import { Checkbox, Modal, Pagination, Table } from 'rsuite'
import Input from '../../../../../components/ui/inputs/input';
import Button from '../../../../../components/ui/button';
import { toast } from 'react-toastify';


const { Column, HeaderCell, Cell } = Table;

const SelectIssueMaterialModal = ({ modals, setModals, materials_list, status, urls, handleChangeFilter, handleSearch, setOutput, output }) => {

  const [selectedMaterial, setSelectedMaterial] = useState([]);

  const selectMaterial = (material) => {
    console.log(selectedMaterial, material)
    if(selectedMaterial.find(item => item.id === material.id)){
      setSelectedMaterial(selectedMaterial.filter(item => item.id !== material.id));
    } else {
      setSelectedMaterial([...selectedMaterial, material]);
    }
  }

  const onSubmit = () => {
    const data = selectedMaterial.map(item => ({...item, output_amount: ''}));
    setOutput({
      ...output,
      products: [...output.products, ...data]
    });
    setModals({ ...modals, select: false });
    setSelectedMaterial([]);
  }

  return (
    <Modal open={modals.select} onClose={() => setModals({ ...modals, select: false })} size='lg'>
        <Modal.Header>
            <Modal.Title>Выбор сырья</Modal.Title>
            <div className='flex justify-between items-center mt-4'>
                <Input
                  width='50%'
                  height='34px'
                  searchicon={true}
                  type='text'
                  placeholder='Поиск'
                  value={urls.search}
                  searchHandle={handleSearch}
                  onChange={(e) => handleChangeFilter('search', e.target.value)}
                />
            </div>
        </Modal.Header>
        <Modal.Body>
            <div className='min-h-[300px] bg-white rounded-lg flex flex-col gap-y-4'>
              <div className='border border-borderGray rounded-lg'>
                <Table
                    loading={status === 'loading'}
                    data={materials_list?.results}
                    cellBordered
                    height={390}
                    className='rounded-xl'
                >
                    <Column width={80} align='center'>
                        <HeaderCell>ID</HeaderCell>
                        <Cell dataKey="id" />
                    </Column>
                    
                    <Column width={120}>
                        <HeaderCell className='pl-2'>Артикул</HeaderCell>
                        <Cell dataKey="vendor_code" />
                    </Column>

                    <Column width={200}>
                        <HeaderCell>Название</HeaderCell>
                        <Cell dataKey="title" />
                    </Column>

                    <Column width={120}>
                        <HeaderCell className='pl-2'>В складе</HeaderCell>
                        <Cell dataKey="amount" />
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
                                <Checkbox 
                                  // disabled={rowData.amount < 1}
                                  checked={selectedMaterial.find(item => item.id === rowData.id)}
                                />
                              </div>
                          )}
                        </Cell>
                    </Column>

                </Table>
                <div style={{ padding: 20 }}>
                  <Pagination
                      prev
                      next
                      first
                      last
                      ellipsis
                      boundaryLinks
                      maxButtons={5}
                      size="xs"
                      layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                      total={materials_list?.count}
                      limitOptions={[10, 30, 50]}
                      limit={urls.page_size}
                      activePage={Number(urls.page || 1)}
                      onChangePage={(e) => handleChangeFilter('page', e)}
                  />
                </div>
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

export default SelectIssueMaterialModal
