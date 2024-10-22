import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Modal } from 'rsuite';
import Button from '../../ui/button';
import Input from '../../ui/inputs/input';
import Checkbox from './../../ui/inputs/checkbox';
import Select from '../../ui/inputs/select';
import OperationTabs from '../../shared/product/operationTabs';
import { toast } from 'react-toastify';
import { dischargeDatas } from '../../../utils/selectDatas/productDatas';

// Создание схемы валидации с помощью Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Название обязательно'),
  equipment: Yup.string().required('Оборудование обязательно'),
});

const NewOperation = ({ open, modals, setModals, newOperation, setNewOperation, newProduct, setNewProduct }) => {
  const [sizeOn, setSizeOn] = useState(false);

  
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: newOperation.name || '',
      equipment: newOperation.equipment || '',
    },
    resolver: yupResolver(validationSchema),
  });

  
  const createOperation = (data) => {
    setNewProduct({ 
      ...newProduct, 
      operations: [...newProduct.operations, { name: data.name, equipment: data.equipment, sizes: [...newOperation.sizes] }] });
    setModals({ ...modals, newOperation: false });
    reset();
  };

  return (
    <Modal size='lg' open={open} onClose={() => setModals({ ...modals, newOperation: false })}>
      <form className='flex flex-col gap-y-4 px-3' onSubmit={handleSubmit(createOperation)}>
        <Modal.Header>
          <Modal.Title>
            <p className='text-lg font-bold font-inter'>Создание операции</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='px-6'>
            <div className='flex items-center gap-x-6'>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Название"
                    type="text"
                    placeholder="Введите название"
                    error={!!errors.name}
                    // helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
              <Controller
                name="equipment"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    data={dischargeDatas}
                    label="Оборудование"
                    placeholder="Выберите оборудование"
                    error={!!errors.equipment}
                    // helperText={errors.equipment ? errors.equipment.message : ''}
                  />
                )}
              />
            </div>
            <div className='p-0 my-3'>
              <Checkbox label='Размеры' isChecked={sizeOn} handleCheckboxChange={() => setSizeOn(!sizeOn)} />
            </div>
            <OperationTabs newOperation={newOperation} setNewOperation={setNewOperation} />
        </Modal.Body>
        <Modal.Footer className='pt-3'>
          <div className='flex justify-center items-center gap-x-6'>
            <Button width='200px' variant='white' onClick={() => setModals({ ...modals, newOperation: false })}>Отмена</Button>
            <Button width='200px' type="submit">Готово</Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default NewOperation;
