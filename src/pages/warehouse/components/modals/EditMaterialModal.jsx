import React, { useEffect, useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import Button from '../../../../components/ui/button'
import Input from '../../../../components/ui/inputs/input'
import { useDispatch, useSelector } from 'react-redux'
import Select from '../../../../components/ui/inputs/select'
import { materialUnits } from '../../../../utils/selectDatas/productDatas'
import { patchMaterial, postMaterial } from '../../../../store/technolog/material'
import { toast } from 'react-toastify'
import { color } from 'framer-motion'

const EditMaterialModal = ({ modals, setModals, data, setUpdate }) => {
  
    const dispatch = useDispatch();

    const { colors_list } = useSelector(state => state.material);

    const [material, setMaterial] = useState({
      title: data?.title || '',
      vendor_code: data?.vendor_code || '',
      unit: data?.unit || 0,
      is_active: data?.is_active || false,
      color: data?.color || null,
      coefficient: data?.coefficient || 0,
      status: data?.status || 1
    })
    const [errors, setErrors] = useState({
      title: false,
      vendor_code: false,
      unit: false,
      is_active: false,
      color: false,
      coefficient: false,
      status: false
    })

    useEffect(() => {
      if(data?.title) {
          setMaterial({
              title: data.title,
              vendor_code: data.vendor_code,
              unit: data.unit,
              is_active: data.is_active,
              color: data.color,
              coefficient: data.coefficient,
              status: data.status
          })
      }
    }, [data.title, data])
  
    const getValue = (e) => {
      const { name, value } = e.target;
      setMaterial({
        ...material,
        [name]: value
      })
    }
  
    const validateField = () => {
      const newErrors = {
        title: !material.title,
        vendor_code: !material.vendor_code,
        unit: !material.unit,
        color: !material.color
      };
      setErrors(newErrors);
      return !Object.values(newErrors).some((error) => error === true);
    }
  
    const onSubmit = () => {
      if(validateField()) {
          dispatch(patchMaterial({props: material, id: data.id}))
          .then(res => {
              if(res.meta.requestStatus === 'fulfilled') {
                  toast("Сырье изменено успешно!");
                  setModals({ ...modals, edit: false })
                  setUpdate(prev => !prev)
                  setMaterial({
                      title: '',
                      vendor_code: '',
                      unit: 0,
                      is_active: false,
                      color: null,
                      coefficient: 0,
                      status: 1
                  })
              }
          })
      } else {
          toast("Заполните все поля!")
      }
    }

    return (
        <Modal open={modals.edit} onClose={() => setModals({ ...modals, edit: false })} size='md'>
            <Modal.Header>
                <Modal.Title>Редактирование сырья</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='flex flex-col gap-y-5'>
                    <div className='flex justify-between gap-x-5'>
                        <Input
                            type='text'
                            name='title'
                            label='Название'
                            placeholder='Введите название сырья'
                            value={material.title}
                            onChange={getValue}
                            error={errors.title}
                        />
                        <Input
                            type='text'
                            name='vendor_code'
                            label='Артикул'
                            placeholder='Введите артикул сырья'
                            value={material.vendor_code}
                            onChange={getValue}
                            error={errors.vendor_code}
                        />
                        <Select
                            // width='1/2'
                            label='Единица измерения'
                            placeholder='Выберите'
                            data={materialUnits}
                            value={material.unit}
                            error={errors.unit}
                            onChange={(e) => getValue({ target: { name: 'unit', value: e } })}
                        />
                    </div>
                    <div className="flex justify-between gap-x-5">
                        <div className="w-1/3">
                            <Input
                                type="number"
                                name="coefficient"
                                label="Коэффициент"
                                placeholder="Введите коэффициент"
                                value={material.coefficient}
                                onChange={getValue}
                                error={errors.coefficient}
                            />
                        </div>
                        <div className="w-1/3">
                            <Select
                                label="Цвет"
                                placeholder="Выберите"
                                data={colors_list}
                                value={material.color}
                                error={errors.color}
                                labelKey='title'
                                valueKey='id'
                                onChange={(e) =>
                                getValue({ target: { name: "color", value: e } })
                                }
                                colors={true}
                            />
                        </div>
                        <div className="w-1/3">
                            <Select
                                label="Статус"
                                placeholder="Выберите"
                                data={[{ value: 1, label: "В крой" }, { value: 2, label: "В цех" }]}
                                value={material.status}
                                error={errors.status}
                                onChange={(e) =>
                                            getValue({ target: { name: "status", value: e } })
                                        }
                            />
                        </div>
                    </div>
                    <div className="w-1/3 flex items-end pb-[10px]">
                        <Toggle
                            checked={material.is_active}
                            onChange={(e) =>
                            getValue({ target: { name: "is_active", value: e } })
                            }
                        >
                            Активный
                        </Toggle>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button width='100px' onClick={onSubmit}>Сохранить</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditMaterialModal
