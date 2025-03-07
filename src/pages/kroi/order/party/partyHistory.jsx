import React, { useEffect } from 'react'
import Title from '../../../../components/ui/title'
import { useDispatch, useSelector } from 'react-redux'
import { getPartyList } from '../../../../store/kroi/order'
import { useSearchParams } from 'react-router-dom'
import PartyHistoryTable from '../components/tables/partyHistoryTable'

const PartyHistory = () => {

  const dispatch = useDispatch();
  const { party_list, party_list_status } = useSelector(state => state.kroi_order);
  const [params, setParams] = useSearchParams();

  const urls = {
    page: params.get("page") || 1,
    page_size: params.get("page_size") || 20
  }

  useEffect(() => {
    dispatch(getPartyList({ page: urls.page, page_size: urls.page_size }));
  }, [urls.page, urls.page_size])

  const handleChangeFilter = (name, value) => {
    params.set(name, value);
    setParams(params);
  }

  return (
    <div className='flex flex-col gap-y-4 mb-5'>
        <Title text="История партий" />

        <PartyHistoryTable
          data={party_list}
          status={party_list_status}
          urls={urls}
          handleChangeFilter={handleChangeFilter}
        />
    </div>
  )
}

export default PartyHistory
