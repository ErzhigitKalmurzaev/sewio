import React, { useEffect, useState } from 'react'
import Title from '../../../../components/ui/title'
import { useDispatch, useSelector } from 'react-redux';
import { getModerationList } from '../../../../store/technolog/order';
import ModerationOperationTable from '../components/tables/moderationOperationTable';
import { useParams } from 'react-router-dom';

const ModerationOperation = () => {

  const dispatch = useDispatch();
  const { id } = useParams();

  const { moderation_list, moderation_list_status } = useSelector(state => state.order);

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if(!moderation_list) {
        dispatch(getModerationList())
    } else if(update) {
        setUpdate(false);
        dispatch(getModerationList());
    }
  }, [update])

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-3'>
        <div className='flex justify-between items-center'>
            <Title text="Список операций для модерации" />
        </div>

        <ModerationOperationTable
            data={moderation_list?.filter(moderation => moderation.order === Number(id))}
            status={moderation_list_status}
            setUpdate={setUpdate}
        />
    </div>
  )
}

export default ModerationOperation
