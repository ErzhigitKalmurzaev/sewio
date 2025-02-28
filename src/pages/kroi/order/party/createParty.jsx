import React, { useEffect, useState } from 'react'
import Title from '../../../../components/ui/title'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { fillPartyAmounts, getOrdersList } from '../../../../store/kroi/order';
import NumInputForTable from '../../../../components/ui/inputs/numInputForTable';
import PartyAmountTable from '../components/tables/partyAmountTable';
import Button from '../../../../components/ui/button';

const CreateParty = () => {

  const { orderId, id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders_list, orders_list_status, party_amounts } = useSelector(state => state.kroi_order);

  const [party, setParty] = useState({
    number: '',
    product: null
  });

  useEffect(() => {
    if(!orders_list) {
        dispatch(getOrdersList());
    } else {
        const order = orders_list.find(item => item.id === Number(orderId));
        const product = order?.products.find(item => item.nomenclature.id === Number(id));
        setParty({...party, product: product.nomenclature});
        const groupedData = Object.values(
            product?.amounts.reduce((acc, item) => {
              const colorId = item.color.id;
          
              if (!acc[colorId]) {
                acc[colorId] = {
                  color: item.color,
                  sizes: [],
                  totalAmount: 0
                };
              }
          
              acc[colorId].sizes.push({
                size: item.size,
                plan_amount: item.amount,
                true_amount: ''
              });
          
              acc[colorId].totalAmount += item.amount;
          
              return acc;
            }, {})
          );
        dispatch(fillPartyAmounts(groupedData));
    }
  }, [])

  return (
    <div className='flex flex-col gap-y-4 mb-5'>
        <Title text={`Создание партии`}/>

        <div className='flex flex-col gap-y-10 bg-white rounded-lg p-4'>
            <div className='flex gap-x-16 items-center border-b border-borderGray py-2'>
                <div className='flex items-center gap-x-4'>
                    <span className='text-lg font-semibold font-inter'>Заказ-Наряд</span>
                    <span className='text-lg font-semibold font-inter text-fprimary'>№ {orderId}</span>
                    <span className='text-base font-semibold font-inter'> партия</span>
                    <span>
                        <NumInputForTable
                            placeholder={'№ партии'}
                            width={'100px'}
                            value={party.number}
                            onChange={(e) => setParty({...party, number: e})}
                        />
                    </span>
                </div>
                <div className='flex items-center gap-x-6'>
                    <span className='text-base font-semibold font-inter'>
                        Товар: 
                        <span className='text-fprimary ml-3'>{party.product?.title}</span>
                    </span>
                    <span className='text-base font-semibold font-inter'>
                        Артикул: 
                        <span className='text-fprimary ml-3'>{party.product?.vendor_code}</span>
                    </span>
                </div>
            </div>

            <PartyAmountTable data={party_amounts} />

            <div>
                <Button onClick={() => console.log(party_amounts)}>Save</Button>
            </div>
        </div>

    </div>
  )
}

export default CreateParty
