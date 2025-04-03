import React, { useEffect, useState } from 'react'
import { List, Loader, Modal } from 'rsuite'
import { getCombinationById } from '../../../../../store/technolog/operations';
import { useDispatch, useSelector } from 'react-redux';
import { getOperationsTitlesList } from './../../../../../store/technolog/calculation';
import Button from '../../../../../components/ui/button';
import { getCombinationsList } from './../../../../../store/technolog/product';
import { addCombination } from './../../../../../store/technolog/calculation';
import { toast } from 'react-toastify';
import InputWithSuggestion from '../../../../../components/ui/inputs/inputWithSuggestion';
import { combinationStatuses } from '../../../../../utils/selectDatas/productDatas';
import Select from '../../../../../components/ui/inputs/select';
import { nanoid } from 'nanoid';

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
            status: newCombination?.status,
            children: newCombination?.operations?.map(item => ({
                ...item,
                equipment: item?.equipment?.id,
                rank: item?.rank?.id
            })) || [{
                title: '',
                time: '',
                rank: '',
                price: '',
                id: nanoid()
            }],
            id: newCombination?.id || nanoid()
        }))
        setModals({ ...modals, combination: false })
        setNewCombination({})
    } else {
        toast.error('Введите название комбинации!')
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
                    <InputWithSuggestion
                        label='Название'
                        type='text'
                        placeholder={'Введите название комбинации'}
                        value={newCombination?.title}
                        onChange={(e) => getValue(e.target.value, 'title')}
                        onSelect={(id) => handleSelect(id)}
                        suggestions={combinations_list?.results || []}
                    />
                    <Select
                        size='md'
                        label='Статус'
                        data={combinationStatuses}
                        value={newCombination?.status}
                        onChange={(e) => getValue(e, 'status')}
                        placeholder='Установите статус'
                        valueKey={'id'}
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
                                            <List.Item key={'op-' + index}>
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
