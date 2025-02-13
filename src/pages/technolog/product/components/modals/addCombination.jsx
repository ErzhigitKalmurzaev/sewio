import React, { useEffect, useState } from 'react'
import { List, Modal } from 'rsuite'
import { getCombinationById, getCombinationList } from '../../../../../store/technolog/operations';
import { useDispatch, useSelector } from 'react-redux';
import InputWithSuggestions from '../../../../../components/ui/inputs/inputWithSuggestions';
import Select from '../../../../../components/ui/inputs/select';
import { getOperationsTitlesList } from './../../../../../store/technolog/calculation';
import Button from '../../../../../components/ui/button';
import { addCombination, createCombination, editCombinationById, getCombinationsList } from './../../../../../store/technolog/product';
import { toast } from 'react-toastify';

const AddCombination = ({ modals, setModals }) => {

  const dispatch = useDispatch();

  const { operations_list } = useSelector(state => state.calculation);
  const { combinations_list, combination, combination_status } = useSelector(state => state.product);

  const [newCombination, setNewCombination] = useState({
    title: '',
    is_sample: false,
    operations: []
  });
  const [errors, setErrors] = useState({
    title: false,
    operations: false,
  });

  useEffect(() => {
    if(!operations_list) {
        dispatch(getOperationsTitlesList())
    }
    if(!combinations_list) {
        dispatch(getCombinationsList())
    }
  }, [modals])

  const getValue = (e, name) => {
    setNewCombination({ ...newCombination, [name]: e });
  }

  const handleSelect = (id) => {
    if(id === 0 || id) {
        dispatch(getCombinationById({ id })).then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                setNewCombination(res.payload)
                console.log(res.payload)
            }
        })
    }
  }

  const validateField = () => {
    const newErrors = {
      title: !combination?.title,
      file: !combination?.file,
      operations: combination?.operations?.length === 0,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }

  const onSubmit = () => {
    if(newCombination.title) {
        dispatch(addCombination({
            title: newCombination?.title,
            children: newCombination?.operations?.map(item => ({
                ...item,
                equipment: item?.equipment?.id,
                rank: item?.rank?.id
            })) || [{
                title: '',
                time: '',
                rank: '',
                price: '',
                id: crypto.randomUUID()
            }],
            id: newCombination?.id || crypto.randomUUID()
        }))
        setModals({ ...modals, combination: false })
        setNewCombination({})
    }
  }


  return (
    <Modal open={modals?.combination} onClose={() => setModals({ ...modals, combination: false })}>
        <Modal.Header>
            <Modal.Title>Добавление комбинации</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='flex flex-col gap-y-3'>
                <div className='flex gap-x-3'>
                    <InputWithSuggestions
                        label='Название'
                        type='text'
                        placeholder={'Введите название комбинации'}
                        value={newCombination?.title}
                        onChange={(e) => getValue(e.target.value, 'title')}
                        onSelect={(id) => handleSelect(id)}
                        suggestions={combinations_list?.results || []}
                    />
                </div>

                <div>
                    {
                        newCombination?.operations?.length > 0 && (
                            <div className="w-full mt-4">
                                <h3 className="text-base font-medium mb-2">Операции в комбинации</h3>
                                <List bordered size='sm'>
                                    {newCombination?.operations?.map((operation, index) => (
                                            <List.Item>{operation?.title}</List.Item>
                                    ))}
                                        
                                </List>
                            </div>
                        )
                    }
                </div>

            </div>
        </Modal.Body>
        <Modal.Footer>
            <div className='flex justify-end'>
                <Button onClick={onSubmit}>
                    Добавить
                </Button>
            </div>
        </Modal.Footer>
    </Modal>
  )
}

export default AddCombination
