import React, { useEffect } from 'react'
import Title from '../../../../components/ui/title'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getPartyList } from '../../../../store/foreman/order';

const CreateAccWork = () => {

  const { orderId, id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { party_list, party_list_status } = useSelector(state => state.foreman_order);

  useEffect(() => {
    dispatch(getPartyList({ order: orderId, product: id }));
  }, [])

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-5'>
        <div className='flex justify-between items-center'>
            <Title text="Прием работы" />
        </div>

    </div>
  )
}

export default CreateAccWork
