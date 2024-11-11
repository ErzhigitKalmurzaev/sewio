import React, { useEffect } from 'react'
import { Modal } from 'rsuite'
import Select from '../../../../../components/ui/inputs/select'
import { useDispatch, useSelector } from 'react-redux'
import { getMateralList } from '../../../../../store/technolog/material'
import Input from '../../../../../components/ui/inputs/input'
import NumInput from '../../../../../components/ui/inputs/numInput'
import Button from '../../../../../components/ui/button'
import { toast } from 'react-toastify'

const SelectMaterial = ({ modals, setModals, setNewOperation, newOperation, sizes, op_nom, setOp_nom, hanleClearOp_nom }) => {

  const { materials_list } = useSelector(state => state.material)  
  const dispatch = useDispatch();

  useEffect(() => {
    if(!materials_list) dispatch(getMateralList());
  }, [])

  const handleSelectMaterial = (e) => {
    setOp_nom({
      ...op_nom,
      nomenclature: e
    })
  }

  const getSizeValue = (e, size_id) => {
    const { name, value } = e.target;

    let index = op_nom.consumables.findIndex(item => item.size.id === size_id || item.size === size_id);
    let new_op_nom = [...op_nom.consumables];
    new_op_nom[index][name] = Number(value);
    setOp_nom({
      ...op_nom,
      consumables: new_op_nom
    })
  }

  const validateFields = () => {
    return op_nom.nomenclature && op_nom.consumables.every(item => item.consumption && item.waste)
  }

  const onSubmit = () => {
    if(validateFields()) {
      setNewOperation({ ...newOperation, op_noms: [...newOperation.op_noms, op_nom] });
      hanleClearOp_nom();

      setModals({ ...modals, newMaterial: false }) 
    } else {
      toast("Заполните все поля!")
    }
  }

  return (
    <Modal open={modals.newMaterial} onClose={() => setModals({ ...modals, newMaterial: false })} size='lg'>
        <Modal.Header>
            <Modal.Title>Добавление сырья</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='flex flex-col gap-y-2'>
                <div className='flex'>
                    <Select 
                        width='2/3'
                        data={materials_list}
                        labelKey='title'
                        valueKey='id'
                        placeholder='Выберите сырье'
                        label='Сырье'
                        onChange={(e) => handleSelectMaterial(e)}
                    />
                </div>

                <p className='text-base font-semibold font-inter mt-5'>Расчет расхода</p>
                <div className='grid grid-cols-3 gap-4'>
                  {
                    sizes &&
                    sizes.map((item, index) => (
                      <NumInput
                        key={index+'input'}
                        type='text'
                        placeholder={`Введите расход для размера ${item.title}`}
                        label={`Расход для размера ${item.title}`}
                        onChange={(e) => getSizeValue({ target: { value: e, name: 'consumption' } }, item.id)}
                      />
                    ))
                  }
                </div>

                <p className='text-base font-semibold font-inter mt-5'>Расчет отхода</p>
                <div className='grid grid-cols-3 gap-4'>
                  {
                    sizes &&
                    sizes.map((item, index) => (
                      <NumInput
                        key={index+'input'}
                        type='text'
                        placeholder={`Введите отход для размера ${item.title}`}
                        label={`Отход для размера ${item.title}`}
                        onChange={(e) => getSizeValue({ target: { value: e, name: 'waste' } }, item.id)}
                      />
                    ))
                  }
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='flex justify-center gap-x-10'>
            <Button width='150px' variant='white' onClick={() => setModals({ ...modals, newMaterial: false })}>Отмена</Button>
            <Button width='150px' onClick={onSubmit}>Сохранить</Button>
          </div>
        </Modal.Footer>
    </Modal>
  )
}

export default SelectMaterial
