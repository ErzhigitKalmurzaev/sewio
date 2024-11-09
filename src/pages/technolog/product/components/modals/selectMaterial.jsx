import React, { useEffect } from 'react'
import { Modal } from 'rsuite'
import Select from '../../../../../components/ui/inputs/select'
import { useDispatch, useSelector } from 'react-redux'
import { getMateralList } from '../../../../../store/technolog/material'

const SelectMaterial = ({ modals, setModals }) => {

  const { materials_list } = useSelector(state => state.material)  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMateralList())
  }, [])

  return (
    <Modal open={modals.newMaterial} onClose={() => setModals({ ...modals, newMaterial: false })} size='lg'>
        <Modal.Header>
            <Modal.Title>Добавление сырья</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='flex flex-col gap-y-8'>
                <div className='flex'>
                    <Select 
                        data={materials_list}
                        labelKey='title'
                        valueKey='id'
                        placeholder='Выберите сырье'
                        label='Сырье'
                    />
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
    </Modal>
  )
}

export default SelectMaterial
