import React, { useEffect, useState } from 'react'
import Title from '../../../../components/ui/title'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { fillPartyAmounts, getOrdersList, getProductInfo, postParty } from '../../../../store/kroi/order';
import PartyAmountTable from '../components/tables/partyAmountTable';
import Button from '../../../../components/ui/button';
import ConsumablesTable from '../components/tables/consumablesTable';
import { toast } from 'react-toastify';
import TextInputForTable from '../../../../components/ui/inputs/textInputForTable';

const CreateParty = () => {

  const { orderId, id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product_info, product_info_status, party_amounts, party_consumables } = useSelector(state => state.kroi_order);

  const [party, setParty] = useState({
    number: '',
    product: null
  });

  useEffect(() => {
    dispatch(getProductInfo({ product: id, order: orderId }));
  }, [])

  const validateField = () => {
    if(party.number === '' && id && orderId) {
      return false;
    }
    return true;
  }

  const onSubmit = () => {
    if(validateField()) {
      const new_party = {
        order: Number(orderId),
        nomenclature: Number(id),
        number: party.number,
        details: party_amounts.flatMap(item => (
          item.sizes
            .filter(sizeData => sizeData?.true_amount !== 0 && sizeData?.true_amount !== '')
            .map(sizeData => ({
              color: item.color.id,
              size: sizeData.size.id,
              plan_amount: sizeData.plan_amount,
              true_amount: Number(sizeData.true_amount) || 0
            }))
        )),
        consumptions: party_consumables
          .filter(item => item.nomenclature)  // Отфильтровываем элементы без nomenclature
          .map(item => ({
            ...item,
            layers_count: Number(item.layers_count) || 0,
            quantity: Number(item.layers_count * item.count_in_layer)
          }))
      
      }
      dispatch(postParty(new_party)).then(res => {
        if(res.meta.requestStatus === 'fulfilled') {
          toast.success('Партия успешно создана!');
          navigate(-1)
        }
      })
    } else {
      toast.error('Заполните поле № партии!')
    }
  }

  return (
    <div className='flex flex-col gap-y-4 mb-5'>
        <Title text={`Создание партии`}/>

        <div className='flex flex-col gap-y-10 bg-white rounded-lg p-4'>
            <div className='flex gap-x-16 items-center border-b border-borderGray py-2'>
                <div className='flex items-center gap-x-4'>
                    <span className='text-base font-semibold font-inter'>Заказ-Наряд</span>
                    <span className='text-base font-semibold font-inter text-fprimary'>№ {orderId}</span>
                    <span className='text-base font-semibold font-inter'> партия</span>
                    <span>
                        <TextInputForTable
                            placeholder={'№ партии'}
                            width={'100px'}
                            value={party.number}
                            onChange={(e) => setParty({...party, number: e.target.value})}
                        />
                    </span>
                </div>
                <div className='flex items-center gap-x-6'>
                    <span className='text-base font-semibold font-inter'>
                        Товар: 
                        <span className='text-fprimary ml-3'>{product_info?.nomenclature?.title}</span>
                    </span>
                    <span className='text-base font-semibold font-inter'>
                        Артикул: 
                        <span className='text-fprimary ml-3'>{product_info?.nomenclature?.vendor_code}</span>
                    </span>
                </div>
            </div>

            <PartyAmountTable data={party_amounts} status={product_info_status} />

            <ConsumablesTable status={product_info_status} />

            <div className='flex justify-center'>
                <Button width='180px' onClick={onSubmit}>Создать</Button>
            </div>
        </div>

    </div>
  )
}

export default CreateParty
