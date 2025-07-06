import React, { useState } from 'react'
import { Checkbox, Modal, Radio, Table, Toggle, Uploader } from 'rsuite'
import Input from '../../../../../components/ui/inputs/input';
import Button from '../../../../../components/ui/button';
import { CloudUpload, Upload } from 'lucide-react';
import Textarea from '../../../../../components/ui/inputs/textarea';
import NumInput from '../../../../../components/ui/inputs/numInput';
import { toast } from 'react-toastify';


const { Column, HeaderCell, Cell } = Table;

const SelectRejectMaterialModal = ({ 
  modals, 
  setModals, 
  materials_list, 
  status, 
  search, 
  setSearch, 
  handleSearch, 
  setMaterials, 
  materials 
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState({});
  const [inputValues, setInputValues] = useState({ amount: '', comment: '', files: [] });
  const [error, setError] = useState(false);

  const handleChange = (name, value) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const onSubmit = () => {
    if(inputValues.amount) {
      setMaterials([
        ...materials, 
        { ...selectedMaterial, ...inputValues }
      ]);
      setModals({ ...modals, select: false });
      setSelectedMaterial({});
      setInputValues({ amount: '', comment: '' });
    } else {
      setError(true);
      toast.error('Укажите количество!');
    }
  };

  return (
    <Modal open={modals.select} onClose={() => setModals({ ...modals, select: false })} size='lg' className='h-full'>
      <Modal.Header>
        <Modal.Title>Выбор сырья</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='min-h-[300px] bg-white rounded-lg flex flex-col gap-y-3'>
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
              height={270}
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
              <Column width={70}>
                <HeaderCell>Выбрать</HeaderCell>
                <Cell>
                  {(rowData, index) => (
                    <Radio
                      key={index}
                      checked={selectedMaterial?.id === rowData.id}
                      onClick={() => setSelectedMaterial(rowData)}
                    />
                  )}
                </Cell>
              </Column>
            </Table>
          </div>
          <div className='flex flex-col gap-y-2'>
            <NumInput
              label='Количество'
              placeholder="Количество"
              width='50%'
              error={error}
              value={inputValues.amount}
              onChange={(e) => handleChange('amount', e)}
            />
            <Textarea
              label='Комментарий'
              placeholder="Комментарий"
              rows={3}
              value={inputValues.comment}
              onChange={(e) => handleChange('comment', e)}
            />
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
  );
};

export default SelectRejectMaterialModal;
