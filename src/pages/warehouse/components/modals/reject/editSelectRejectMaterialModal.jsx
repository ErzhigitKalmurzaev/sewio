import React, { useEffect, useState } from 'react'
import { Modal, Radio, Table } from 'rsuite'
import Button from '../../../../../components/ui/button';
import Textarea from '../../../../../components/ui/inputs/textarea';
import NumInput from '../../../../../components/ui/inputs/numInput';


const { Column, HeaderCell, Cell } = Table;

const EditSelectRejectMaterialModal = ({ 
  modals, 
  setModals, 
  materials_list,
  materials,
  setMaterials,
  values
}) => {
  const [inputValues, setInputValues] = useState({ amount: values?.amount, comment: values?.comment, ...materials_list });

  useEffect(() => {
    setInputValues({
        amount: values?.amount,
        comment: values?.comment,
        ...materials_list
    })
  }, [values])


  const handleChange = (name, value) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const onSubmit = () => {
    setModals(false);
    const editedMaterials = materials.map((item) => (item.id === values.id ? { ...inputValues } : item));
    setMaterials(editedMaterials);
    setInputValues({ amount: '', comment: '' });
  };
  
  return (
    <Modal open={modals} onClose={() => setModals(false)} size='lg' className='h-full'>
      <Modal.Header>
        <Modal.Title>Редактирование</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='min-h-[300px] bg-white rounded-lg flex flex-col gap-y-4'>
          <div className='border border-borderGray rounded-lg'>
            <Table
              data={[materials_list]}
              cellBordered
              height={300}
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
                      checked={true}
                    />
                  )}
                </Cell>
              </Column>
            </Table>
          </div>
          <div className='flex flex-col gap-y-2'>
            <NumInput
              label="Количество"
              placeholder="Количество"
              width='50%'
              value={inputValues.amount}
              onChange={(e) => handleChange('amount', e)}
            />
            <Textarea
              label="Комментарий"
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
          <Button width='100px' variant='white' onClick={() => setModals(false)}>
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

export default EditSelectRejectMaterialModal;
