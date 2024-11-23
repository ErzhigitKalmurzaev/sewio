import React, { useEffect, useState } from 'react'
import MyBreadcrums from '../../../components/ui/breadcrums';
import Title from '../../../components/ui/title';
import Button from '../../../components/ui/button';
import ComingMaterialsTable from './components/tables/comingMaterialsTable';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getComingById, postAnswerComing } from '../../../store/warehouse/warehouse';
import RejectComingModal from './components/modals/rejectComingModal';
import { toast } from 'react-toastify';

const ComingDeteil = () => {

    const breadcrumbs = [
        {
            label: 'Склады',
            path: '/main',
            active: false
        },
        {
            label: 'Приход сырья',
            path: '/main/coming',
            active: false
        },
        {
            label: 'Подробнее',
            path: '/main/coming',
            active: true
        }
    ]

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();
    const { coming, coming_status } = useSelector(state => state.ware_warehouse);

    const [modals, setModals] = useState({ reject: false })

    useEffect(() => {
        dispatch(getComingById({ id }))
    }, [])

    const onSubmit = (answer) => {
        dispatch(postAnswerComing({ quantity_id: id, status: answer }))
            .then(res => {
                if(res.meta.requestStatus === 'fulfilled') {
                    if(answer === 2) {
                        toast("Приход сырья принят!");
                    }  else {
                        toast("Приход сырья отклонен!");
                    }
                    navigate(-1)
                }
            })
    }

    return (
      <div className='flex flex-col gap-y-5 mb-5'>
          <MyBreadcrums items={breadcrumbs}/>
  
          <div className='flex items-center justify-between'>
              <Title text={`Приход сырья ${coming?.id}`}/>
              <div className='flex items-center justify-end gap-x-3'>
                <Button variant='red' width='100px' onClick={() => setModals({ ...modals, reject: true })}>Отклонить</Button>
                <Button variant='green' width='100px' onClick={() => onSubmit(2)}>Принять</Button>
              </div>
          </div>
  
          <div>
              <ComingMaterialsTable
                  data={coming?.quantities}
                  status={coming_status}
              />
          </div>

          <RejectComingModal modals={modals} setModals={setModals} onReject={() => onSubmit(3)}/>
      </div>
    )
}

export default ComingDeteil
