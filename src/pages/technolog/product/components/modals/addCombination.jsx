import React, { useEffect, useState } from 'react'
import { List, Loader, Modal } from 'rsuite'
import { getCombinationById, getCombinationList } from '../../../../../store/technolog/operations';
import { useDispatch, useSelector } from 'react-redux';
import InputWithSuggestions from '../../../../../components/ui/inputs/inputWithSuggestions';
import Select from '../../../../../components/ui/inputs/select';
import { getOperationsTitlesList } from './../../../../../store/technolog/calculation';
import Button from '../../../../../components/ui/button';
import { addCombination, createCombination, editCombinationById, getCombinationsList } from './../../../../../store/technolog/product';

const AddCombination = ({ modals, setModals }) => {

  const dispatch = useDispatch();

  const { operations_list } = useSelector(state => state.calculation);
  const { combinations_list } = useSelector(state => state.product);

  const [newCombination, setNewCombination] = useState({
    title: '',
    is_sample: false,
    operations: []
  });
  const [errors, setErrors] = useState({
    title: false,
    operations: false,
  });
  const [loading, setLoading] = useState(false);

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
        setLoading(true);
        dispatch(getCombinationById({ id })).then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                setNewCombination(res.payload)
                setLoading(false);
            }
        })
    }
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
                        loading ?
                            <Loader  center/> :
                        newCombination?.operations?.length > 0 && (
                            <div className="w-full mt-4">
                                <h3 className="text-base font-medium mb-2">Операции в комбинации</h3>
                                <List bordered size='sm'>
                                    {newCombination?.operations?.map((operation, index) => (
                                            <List.Item>
                                                <div className="flex gap-x-3 font-inter font-medium w-full">
                                                    <span className="w-[35%] truncate">{operation?.title}</span>
                                                    <span className="w-[20%] truncate">{operation?.rank?.title}</span>
                                                    <span className="w-[20%] text-right">{operation?.price} сом</span>
                                                    <span className="w-[15%] text-right">{operation?.time} сек</span>
                                                </div>
                                            </List.Item>
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
                <Button onClick={onSubmit} disabled={loading}>
                    Добавить
                </Button>
            </div>
        </Modal.Footer>
    </Modal>
  )
}

export default AddCombination
