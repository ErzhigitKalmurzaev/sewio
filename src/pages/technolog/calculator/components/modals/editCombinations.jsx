import React, { useState } from 'react'
import Input from '../../../../../components/ui/inputs/input'
import { Modal } from 'rsuite'
import Button from '../../../../../components/ui/button';
import { useDispatch } from 'react-redux';
import { deleteCombination, editCombination } from '../../../../../store/technolog/calculation';

const EditCombinations = ({ modals, setModals, data, setData }) => {

  const dispatch = useDispatch();

  const [combination, setCombination] = useState(data.title);

  const onSubmit = () => {
    dispatch(editCombination({ index: data.index, value: combination }))
    setModals({ ...modals, edit: false })
    setData({})
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
                        value={combination || data.title}
                        onChange={(e) => setCombination(e.target.value)}
                    />
                </div>

            </div>
        </Modal.Body>
        <Modal.Footer>
            <div className='flex justify-center gap-x-10'>
                <Button variant='red' onClick={onDelete}>
                    Удалить
                </Button>
                <Button onClick={onSubmit}>
                    Добавить
                </Button>
            </div>
        </Modal.Footer>
    </Modal>
  )
}

export default EditCombinations
