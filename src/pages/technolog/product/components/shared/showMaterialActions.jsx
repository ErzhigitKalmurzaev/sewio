import React, { useEffect, useState } from 'react'
import Select from '../../../../../components/ui/inputs/select'
import MaterialBlock from '../../../../../components/shared/product/materialBlock';
import { Tabs } from 'rsuite';


const ShowMaterialActions = ({ operation }) => {

  const [sizes, setSizes] = useState([]);
  const [activeKey, setActiveKey] = useState();

  useEffect(() => {
    if(operation?.op_noms?.length > 0) {
        const sizes_arr = operation?.op_noms[0]?.consumables?.map(item => item.size);
        setSizes(sizes_arr);
        setActiveKey(sizes_arr[0].id);
    }
  }, [])

  return (
    <div className='flex flex-col gap-y-5'>
      <div className='flex flex-col gap-y-3'>
          <div className='flex justify-between'>
              <div className='w-2/3'>
                      {
                        sizes.length > 0 &&
                        <Tabs style={{ width: '100%' }} defaultActiveKey={sizes[0].id} onSelect={key => setActiveKey(key)}>
                            {
                                sizes?.map((item, index) => (
                                    <Tabs.Tab eventKey={item.id} title={item.title} key={index}/>
                                ))
                            }
                        </Tabs>
                      }
              </div>
          </div>
          <div className='flex flex-col gap-y-5'>
            {
              operation?.op_noms?.length > 0 ? 
              operation?.op_noms?.map((item, index) => (
                <MaterialBlock material={item} key={index} activeKey={activeKey} variant='edit'/>
              )) :
              <p className="text-base font-semibold font-inter text-center my-5">Сырье отсутствуют</p>
            }
          </div>
        </div>
    </div>
  )
}

export default ShowMaterialActions
