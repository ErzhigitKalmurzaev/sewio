import React, { useEffect, useState } from 'react'
import Select from '../../../../../components/ui/inputs/select'
import { useDispatch, useSelector } from 'react-redux'
import { getSizeCategoryList } from '../../../../../store/technolog/size';
import { Tabs } from 'rsuite';
import Button from '../../../../../components/ui/button';
import MaterialBlock from '../../../../../components/shared/product/materialBlock';
import SelectMaterial from '../modals/selectMaterial';

const MaterialActions = ({ newOperation, setNewOperation, mainModals, setMainModals }) => {

  const { size_category_list } = useSelector(state => state.size);

  const dispatch = useDispatch();

  const [selectSize, setSelectSize] = useState(null);
  const [activeKey, setActiveKey] = useState('');
  const [op_nom, setOp_nom] = useState([]);
  const [modals, setModals] = useState({ newMaterial: false, editMaterial: false })

  useEffect(() => {
    if(!size_category_list.length) dispatch(getSizeCategoryList());
  }, [])

  const handleSelectCategorySize = (e) => {
      const index = size_category_list.findIndex(item => item.id === e);
      setSelectSize(size_category_list[index]);
      setActiveKey(size_category_list[index].sizes[0].id);
      const op_noms_arr = size_category_list[index].sizes.map(item => (
        {
          size: item.id,
          consumption: '',
          waste: ''
        }
      ))
      setOp_nom({
        nomenclature: '',
        consumables: op_noms_arr
      })
  }

  const hanleClearOp_nom = () => {
    const op_noms_arr = selectSize.sizes.map(item => (
      {
        size: item.id,
        consumption: '',
        waste: ''
      }
    ))
    setOp_nom({
      nomenclature: '',
      consumables: op_noms_arr
    })
  }

  return (
    <div className='flex flex-col gap-y-8'>
      <div className='w-1/2'>
        <Select
            label='Вариант размера'
            placeholder='Выберите вариант размера' 
            data={size_category_list}
            labelKey='title'
            valueKey='id' 
            onChange={e => handleSelectCategorySize(e)}
        />
      </div>
      {
        selectSize && 
        <div className='flex flex-col gap-y-3'>
          <div className='flex justify-between'>
              <div className='w-2/3'>
                      <Tabs style={{ width: '100%' }} defaultActiveKey={selectSize.sizes[0].id} onSelect={key => setActiveKey(key)}>
                          {
                              selectSize?.sizes?.map((item, index) => (
                                  <Tabs.Tab eventKey={item.id} title={item.title} key={index}/>
                              ))
                          }
                      </Tabs>
              </div>
              <div className='1/3 flex justify-end'>
                  <Button onClick={() => setModals({ ...modals, newMaterial: true })}>+ Добавить сырье</Button>
              </div>
          </div>
          <div className='flex flex-col gap-y-5'>
            {
              newOperation.op_noms.length > 0 ? 
              newOperation.op_noms.map((item, index) => (
                <MaterialBlock 
                  key={index} 
                  material={item} 
                  activeKey={activeKey} 
                  newOperation={newOperation} 
                  setNewOperation={setNewOperation}
                />
              )) :
              <p className="text-base font-semibold font-inter text-center my-5">Сырье отсутствуют</p>
            }
          </div>
        </div>
      }

      {/* Modals */}

      <SelectMaterial 
        modals={modals} 
        setModals={setModals}
        setNewOperation={setNewOperation}
        newOperation={newOperation}
        sizes={selectSize?.sizes}
        mainModals={mainModals}
        setMainModals={setMainModals}
        op_nom={op_nom}
        setOp_nom={setOp_nom}
        hanleClearOp_nom={hanleClearOp_nom
      }
      />
    </div>
  )
}

export default MaterialActions
