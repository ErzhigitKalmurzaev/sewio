import React, { useEffect, useState } from 'react'
import Input from '../../../../../components/ui/inputs/input'
import { Modal } from 'rsuite'
import Button from '../../../../../components/ui/button';
import { useDispatch } from 'react-redux';
import { deleteCombination, editCombination } from '../../../../../store/technolog/product';
import Select from '../../../../../components/ui/inputs/select';
import { combinationStatuses } from '../../../../../utils/selectDatas/productDatas';

const EditCombinations = ({ modals, setModals, data, setData }) => {

  const dispatch = useDispatch();

  const [combination, setCombination] = useState(data?.data);

  useEffect(() => {
    setCombination(data?.data);
  }, [data?.data])

  const onSubmit = () => {
    dispatch(editCombination({ index: data.index, value: combination }))
    setModals({ ...modals, edit: false })
    setData({})
  }

  const getValue = (e, name) => {
    setCombination({ ...combination, [name]: e });
  }

  const onDelete = () => {
    dispatch(deleteCombination(data.index))
    setModals({ ...modals, edit: false })
    setData({})
  }
    
  return (
    <Modal open={modals?.edit} onClose={() => setModals({ ...modals, edit: false })}>
        <Modal.Header>
            <Modal.Title>Редактирование комбинации</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='flex flex-col gap-y-3'>
                <div className='flex gap-x-3'>
                    <Input
                        label='Название'
                        type='text'
                        placeholder={'Введите название комбинации'}
                        value={combination?.title}
                        onChange={(e) => getValue(e.target.value, 'title')}
                    />
                    <Select
                        size='md'
                        label='Статус'
                        data={combinationStatuses}
                        value={combination?.status || ''}
                        onChange={(e) => getValue(e, 'status')}
                        placeholder='Установите статус'
                        valueKey={'id'}
                    />
                </div>

            </div>
        </Modal.Body>
        <Modal.Footer>
            <div className='flex justify-center gap-x-8'>
                <Button width={'120px'} variant='red' onClick={onDelete}>
                    Удалить
                </Button>
                <Button width={'120px'} onClick={onSubmit}>
                    Добавить
                </Button>
            </div>
        </Modal.Footer>
    </Modal>
  )
}

export default EditCombinations
