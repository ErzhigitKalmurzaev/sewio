import Button from '../../../components/ui/button'
import Title from '../../../components/ui/title'
import Input from '../../../components/ui/inputs/input'
import { Modal, Toggle } from 'rsuite'
import { useEffect, useState } from 'react'
import NumInput from '../../../components/ui/inputs/numInput'
import { useDispatch, useSelector } from 'react-redux'
import { createRank, editingRank, getRankList } from '../../../store/technolog/rank'
import { toast } from 'react-toastify'
import RankTable from '../../../components/tables/rankTables/rankTable'

const Discharge = () => {

    const dispatch = useDispatch();
    const { rank_list, rank_list_status } = useSelector(state => state.rank);

    const [modals, setModals] = useState({ create: false, edit: false, delete: false });
    const [newRank, setNewRank] = useState({ title: '', percent: '', is_active: true });
    const [errors, setErrors] = useState({ title: false, percent: false, is_active: false });

    const [editRank, setEditRank] = useState({});
    const [switcher, setSwitcher] = useState(false);

    useEffect(() => {
        dispatch(getRankList())
    }, [switcher])

    const getValue = (e) => {
        const { name, value } = e.target;
        setNewRank({
            ...newRank,
            [name]: value
        })
    };

    const getEditValue = (e) => {
        const { name, value } = e.target;
        setEditRank({
            ...editRank,
            [name]: value
        })
    };

    const validateFields = (data) => {
        const newErrors = {
          title: !data.title,
          percent: data.percent === '',
        };
    
        setErrors(newErrors);
    
        // Return true if no errors
        return !Object.values(newErrors).some((error) => error === true);
      };

    const onSubmit = () => {
        if(validateFields(newRank)) {
            dispatch(createRank(newRank))
                .then(res => {
                    if(res.meta.requestStatus === 'fulfilled') {
                        setModals({ ...modals, create: false })
                        setNewRank({ title: '', percent: '', is_active: true })
                        toast("Разряд создан успешно!")
                        setSwitcher(!switcher)
                    }
                })
        }
    }

    const onEditSubmit = () => {
        if(validateFields(editRank)) {
            dispatch(editingRank({id: editRank.id, props: editRank}))
                .then(res => {
                    if(res.meta.requestStatus === 'fulfilled') {
                        setModals({ ...modals, edit: false })
                        setEditRank({ title: '', percent: '', is_active: true })
                        setSwitcher(!switcher)
                        toast("Разряд изменен успешно!")
                    }
                })
        }
    }

    // console.log(rank_list)
  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-3'>
        <div className='flex justify-between items-center'>
            <Title text="Разряды" />
            <div className='flex gap-x-5'>
                <Button onClick={() => setModals({...modals, create: true})}>+ Создать разряд</Button>
            </div>
        </div>

        <div className='mt-3'>
            <RankTable data={rank_list} setModals={setModals} modals={modals} setEditRank={setEditRank} rank_list_status={rank_list_status} />
        </div>

        <Modal open={modals.create} onClose={() => setModals({ ...modals, create: false })} className='my-auto'>
            <Modal.Header>
                <Modal.Title>
                    <p className='text-lg font-bold font-inter'>Создание разряда</p>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='flex flex-col gap-y-5'>
                <div className='flex flex-col gap-y-4'>
                    <Input
                        label='Название'
                        name='title'
                        placeholder='Введите название'
                        type='text'
                        error={errors.username}
                        onChange={getValue}
                    />
                    <NumInput 
                        label='Процент' 
                        placeholder='0%' 
                        type='text'
                        value={newRank.percent}
                        onChange={e => getValue({ target: { value: e, name: 'percent' } })}
                    />
                    <Toggle value={newRank.is_active} onChange={(e) => getValue({ target: { value: e, name: 'is_active' } })}>
                        Активный
                    </Toggle>
                </div>
            </Modal.Body>
            <Modal.Footer className='flex justify-center'>
                <Button width='385px' onClick={onSubmit}>Создать</Button>
            </Modal.Footer>
        </Modal>


        <Modal open={modals.edit} onClose={() => setModals({ ...modals, edit: false })} className='my-auto'>
            <Modal.Header>
                <Modal.Title>
                    <p className='text-lg font-bold font-inter'>Редактирование разряда</p>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='flex flex-col gap-y-5'>
                <div className='flex flex-col gap-y-4'>
                    <Input
                        label='Название'
                        name='title'
                        value={editRank.title}
                        placeholder='Введите название'
                        type='text'
                        error={errors.username}
                        onChange={getEditValue}
                    />
                    <NumInput 
                        label='Процент' 
                        placeholder='0%' 
                        type='text'
                        value={editRank.percent}
                        onChange={e => getEditValue({ target: { value: e, name: 'percent' } })}
                    />
                    <Toggle checked={editRank.is_active} onChange={(e) => getEditValue({ target: { value: e, name: 'is_active' } })}>
                        Активный
                    </Toggle>
                </div>
            </Modal.Body>
            <Modal.Footer className='flex justify-center'>
                <Button width='385px' onClick={onEditSubmit}>Применить</Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default Discharge
