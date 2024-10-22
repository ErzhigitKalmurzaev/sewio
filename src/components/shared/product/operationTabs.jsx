import React, { useState } from 'react'
import Input from '../../ui/inputs/input'
import Select from '../../ui/inputs/select'
import { Tabs } from 'rsuite'
import MaterialBlock from './materialBlock'
import { dischargeDatas } from '../../../utils/selectDatas/productDatas'
import NewMaterial from '../../modals/product/newMaterial'
import Button from '../../ui/button'

const OperationTabs = ({ newOperation, setNewOperation }) => {

  const [modals, setModals] = useState({ newMaterial: false });
  const [active_key, setActiveKey] = useState('s');

  const getValue = (e, index) => {
    const { name, value } = e.target;
    const newSizes = [...newOperation.sizes];
    newSizes[index][name] = value;
    setNewOperation({ ...newOperation, sizes: newSizes });
  }

  return (
    <div className='flex w-full'>
        <Tabs style={{ width: '100%' }} defaultActiveKey={'s'} onSelect={key => setActiveKey(key)}>
            {
                newOperation.sizes.map((item, index) => (
                    <Tabs.Tab eventKey={item.size} title={item.size}>
                        <div className='flex flex-col gap-y-4'>
                            <div className='flex gap-x-6'>
                                <Input type="text" name='time' label="Время (сек)" placeholder="Введите время" onChange={(e) => getValue(e, index)} value={item.time} />
                                <Select label="Разряд" placeholder="Выберите разряд" data={dischargeDatas} value={item.rank} onChange={(e) => getValue({ target: { name: 'rank', value: e }}, index)}/>
                            </div>
                            <div className='flex flex-col gap-y-2'>
                                <p className='font-inter text-base font-semibold'>Сырье</p>
                                <div className='flex flex-col gap-y-4'>
                                    {
                                        item.materials.length > 0 && 
                                        item.materials.map((item, index) => (
                                            <MaterialBlock material={item} key={index}/>
                                        ))
                                    }
                                </div>
                                <div>
                                    <Button onClick={() => setModals({ ...modals, newMaterial: true })}>+ Добавить сырье</Button>
                                </div>
                            </div>
                        </div>
                    </Tabs.Tab>
                ))
            }
        </Tabs>

        <NewMaterial 
            open={modals.newMaterial}
            modals={modals}
            setModals={setModals}
            setNewOperation={setNewOperation}
            newOperation={newOperation}
            active_key={active_key}
        />
    </div>
  )
}

export default OperationTabs
