import React, { useEffect, useState } from 'react'
import MyBreadcrums from '../../../components/ui/breadcrums'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Title from '../../../components/ui/title';
import Button from '../../../components/ui/button';
import { getWarehouseListWithoutMe, postIssueInWarehouse } from '../../../store/warehouse/warehouse';
import WarehousesTable from './components/tables/WarehousesTable';
import { Steps } from 'rsuite';
import { MoveLeft, MoveRight } from 'lucide-react';
import IssueMaterialsTable from './components/tables/IssueMaterialsTable';
import { getMyMateralsList } from '../../../store/warehouse/materails';
import SelectIssueMaterialModal from './components/modals/selectIssueMaterialModal';
import { toast } from 'react-toastify';
import { getColors } from '../../../store/technolog/material';

const IssueMaterials = () => {

  const breadcrumbs = [
    {
        label: 'Склады',
        path: '/main',
        active: false
    },
    {
        label: 'Выдача сырья',
        path: '/main/issue',
        active: true
    }
  ]
    
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { warehouse_list, warehouse_list_status } = useSelector(state => state.ware_warehouse);
  const { materials_list, materials_list_status } = useSelector(state => state.ware_materials);
  const [params, setParams] = useSearchParams();
  
  const [stage, setStage] = useState(0);
  const [modals, setModals] = useState({ select: false, create: false });
  const [output, setOutput] = useState({
    warehouse: null,
    products: []
  });

  const urls = {
    search: params?.get("search") || "",
    page: params.get("page") || 1,
    page_size: params.get("page_size") || 20,
    is_active: params.get("is_active") || ""
  }
  
  useEffect(() => {
    dispatch(getWarehouseListWithoutMe())
    dispatch(getMyMateralsList(urls));
    dispatch(getColors())
  }, [])

  const handleSearch = () => {
    dispatch(getMyMateralsList(urls))
  }

  const handleChangeFilter = (name, value) => {
    params.set(name, value);
    setParams(params);
  }

  const validateField = () => {
    return output.products.every(item => item.output_amount)
  }

  const checkValidate = (check) => {
    if(check === 'next') {
        if(output?.warehouse?.id) {
            setStage(1);
        } else {
            toast.error("Выберите склад перед тем как продолжить!");
        }
    } else if(check === 'submit') {
        if(validateField() && output?.products?.length > 0) {
            onSubmit()
        } else {
            toast.error("Выберите товары и заполните все поля!");
        }
    }
  }

  const onSubmit = () => {
    const data = {
        output_warehouse_id: output.warehouse.id,
        products: output.products.map(item => ({
            product_id: item.id,
            amount: Number(item.output_amount),
            price: Number(item.cost_price)
        }))
    }

    dispatch(postIssueInWarehouse(data))
        .then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                navigate(-1);
                toast("Выдача успешно оформлена!");
            }
        })
  }

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>
        
        <div className='flex items-center justify-between'>
            <Title text="Выдача сырья"/>
            <div>
                {
                    stage === 1 &&
                    <Button onClick={() => setModals({ ...modals, select: true })}>
                        + Выбрать сырьё
                    </Button>
                }
            </div>
        </div>

        <div>
            {
                stage === 0 ?
                    <WarehousesTable
                        data={warehouse_list}
                        status={warehouse_list_status}
                        setOutput={setOutput}
                        output={output}
                    /> :
                    <IssueMaterialsTable
                        data={output?.products}
                        setOutput={setOutput}
                        output={output}
                    />
            }
        </div>

        <div className='flex justify-between'>
            {
                stage === 1 ? 
                <Button width='130px' variant='white' onClick={() => setStage(0)}>
                    <MoveLeft className='mr-2'/>
                    Назад
                </Button> : <div className='w-[130px]'></div>
            }
            <div className='flex items-center w-2/6'>
                <Steps current={stage} className='w-full'>
                    <Steps.Item title='Выбор склада'/>
                    <Steps.Item title='Выбор материалов'/>
                </Steps>
            </div>
            {
                stage === 0 ?
                <Button width='130px' onClick={() => checkValidate('next')}>
                    Далее
                    <MoveRight className='ml-2'/>
                </Button> : 
                <Button width='130px' onClick={() => checkValidate('submit')}>
                    Выдать
                </Button>
            }
        </div>
        
        <SelectIssueMaterialModal
            modals={modals}
            setModals={setModals}
            materials_list={materials_list}
            status={materials_list_status}
            urls={urls}
            handleSearch={handleSearch}
            handleChangeFilter={handleChangeFilter}
            output={output}
            setOutput={setOutput}
        />
    </div>
  )
}

export default IssueMaterials
