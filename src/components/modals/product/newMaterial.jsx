import React, { useState } from 'react';
import { Modal } from 'rsuite';
import Button from '../../ui/button';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../ui/inputs/input';
import Select from '../../ui/inputs/select';
import { yupResolver } from '@hookform/resolvers/yup';
import { dischargeDatas, materialsList } from '../../../utils/selectDatas/productDatas';
import MaterialButton from '../../shared/product/materialButton';

const validationSchema = Yup.object().shape({
    unit: Yup.string(),
    consumption: Yup.string(),
    waste: Yup.string()
});

const NewMaterial = ({ open, setModals, modals, newOperation, setNewOperation, active_key }) => {
  const { control, formState: { errors }, setValue, getValues } = useForm({
    defaultValues: {
        unit: '',
        consumption: '',
        waste: ''
    },
    resolver: yupResolver(validationSchema), 
  });

  const [material, setMaterial] = useState({});

  const updateMaterial = () => {
    const formData = getValues();  // Get the values from the form dynamically
    const sizes = [...newOperation.sizes];
    const this_size = sizes.findIndex(item => item.size === active_key);
    sizes[this_size].materials = [...sizes[this_size].materials, { material, ...formData }];
    setNewOperation({ ...newOperation, sizes });
    setModals({ ...modals, newMaterial: false });
  };

  return (
    <Modal size={'md'} open={open} onClose={() => setModals({ ...modals, newMaterial: false })}>
        <div>
            <Modal.Header>
                <Modal.Title>
                    <p className='text-lg font-bold font-inter'>Выберите сырье</p>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className='flex flex-col gap-y-4 px-3'>
                    <div className='flex flex-col gap-y-3'>
                        <div className='w-full h-[250px] grid grid-cols-3 gap-3 content-start border border-borderGray rounded-md p-3 overflow-y-scroll'>
                            {
                                materialsList.map(item => (
                                    <MaterialButton key={item.id} setValue={setMaterial} material={item} selected={material} />
                                ))
                            }
                        </div>
                        <div className='flex justify-between items-center gap-x-6'>
                            <Controller
                                name="consumption"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        width='35%'
                                        {...field}
                                        label="Расход"
                                        type="text"
                                        placeholder="Введите расход"
                                        error={!!errors.consumption}
                                    />
                                )}
                            />
                            <Controller
                                name="waste"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        width='35%'
                                        {...field}
                                        label="Отход"
                                        type="text"
                                        placeholder="Введите отход"
                                        error={!!errors.waste}
                                    />
                                )}
                            />
                            <Controller
                                name="unit"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        width='1/4'
                                        {...field}
                                        data={dischargeDatas}
                                        label="Единица измерения"
                                        placeholder="m2"
                                        error={!!errors.unit}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer className='pt-3'>
                <div className='flex justify-center items-center gap-x-6'>
                    <Button width='200px' variant='white' onClick={() => setModals({ ...modals, newMaterial: false })}>Отмена</Button>
                    <Button width='200px' onClick={updateMaterial}>Готово</Button>
                </div>
            </Modal.Footer>
        </div>
    </Modal>
  )
}

export default NewMaterial;
