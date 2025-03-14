import React, { useEffect, useState } from 'react'
import Title from '../../../../components/ui/title'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { clearOperationsList, getPartyList, getProductOperations, postAcceptOperation } from '../../../../store/foreman/order';
import AccWorkTable from '../components/tables/AccWorkTable';
import Select from '../../../../components/ui/inputs/select';
import Button from '../../../../components/ui/button';
import { toast } from 'react-toastify';
import MyBreadcrums from '../../../../components/ui/breadcrums';

const CreateAccWork = () => {
  
  const { orderId, id } = useParams();
  const [params, setParams] = useSearchParams();
  
  const breadcrumbs = [
    { label: 'Назад', path: '/operations', active: false },
    { label: 'Прием работы', path: `/oprations/${orderId}/${id}`, active: true },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { party_list, party_list_status, parties, operations_list, operations_list_status, staff_list} = useSelector(state => state.foreman_order);

  const [orderInfo, setOrderInfo] = useState({});
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [errors, setErrors] = useState({
    party: false,
    color: false,
    size: false
  });
  
  const urls = {
    party: params.get('party') || '',
    color: params.get('color') || '',
    size: params.get('size') || ''
  }

  useEffect(() => {
    dispatch(getPartyList({ order: orderId, product: id }));
    dispatch(getProductOperations({ product: id }));
    dispatch(clearOperationsList())

    setOrderInfo(JSON.parse(localStorage.getItem('order')))
  }, [])

  useEffect(() => {
    if(urls.party && party_list?.length > 0) {
      const color_list = party_list[Number(urls.party)]?.details?.map(color => (color?.color)) || [];
      setColors(Array.from(new Map(color_list?.map(obj => [obj.id, obj])).values()))
    }
    if(urls.color && party_list?.length > 0 && urls.party) {
      const size_list = party_list[Number(urls.party)]?.details?.filter(item => item?.color.id === Number(urls.color)).map(size => (size.size)) || [];
      setSizes(Array.from(new Map(size_list?.map(obj => [obj.id, obj])).values()))
    }
    if(urls.size && party_list?.length > 0 && urls.party && urls.color) {
      const amount = party_list[Number(urls.party)]?.details?.find(item => item?.color.id === Number(urls.color) && item?.size.id === Number(urls.size)).true_amount;
      setOrderInfo({ ...orderInfo, amount });
    }
  }, [party_list_status])

  const getValue = (e) => {
    const { name, value } = e.target;
    if(value === null) {
      params.set(name, '');
    } else {
      params.set(name, value);
    }
    setParams(params);
    
    if(name === 'party' && value !== null && value !== '') {
      const color_list = party_list[value].details.map(color => (color.color)) || [];
      setColors(Array.from(new Map(color_list.map(obj => [obj.id, obj])).values()))
    } else if(name === 'color') {
      const size_list = party_list[urls.party].details.filter(item => item.color.id === Number(value)).map(size => (size.size)) || [];
      setSizes(Array.from(new Map(size_list.map(obj => [obj?.id, obj])).values()))
    } else if(name === 'size') {
      const amount = party_list[urls.party].details.find(item => item.color.id === Number(urls.color) && item.size.id === Number(value))?.true_amount;
      setOrderInfo({ ...orderInfo, amount });
    }
  }

  const validateField = () => {
    const newErrors = {
      party: !urls.party || urls.party === 'null',
      color: !urls.color || urls.color === 'null',
      size: !urls.size || urls.size === 'null',
    };
  
    const staffIds = staff_list.map(staff => Number(staff.id)); // Получаем список ID сотрудников
    const maxAmount = orderInfo?.amount || 0;
  
    let hasInvalidData = false;
  
    const validatedDetails = operations_list?.flatMap(item =>
      item?.details?.map(detail => {
        const staff = Number(detail.staff);
        const amount = Number(detail.count);
  
        if (!staffIds.includes(staff)) {
          hasInvalidData = true;
          toast.error(`Ошибка: Сотрудник ${staff} отсутствует в сотрудниках!`);
        }
  
        if (amount > maxAmount) {
          hasInvalidData = true;
          toast.error(`Ошибка: Количество ${amount} превышает допустимое ${maxAmount}`);
        }
  
        return { operation: item.id, staff, amount };
      })
    );
  
    if (hasInvalidData) {
      // toast.error('Некорректные данные! Проверьте сотрудников и количество.');
      return false;
    }
  
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };
  

  const onSubmit = () => {
    if(validateField()) {
      dispatch(postAcceptOperation({
        party: party_list[Number(urls.party)].id,
        color: Number(urls.color),
        size: Number(urls.size),
        details: operations_list?.flatMap(item => 
          item?.details?.map(detail => ({
            operation: item.id,
            staff: Number(detail.staff),
            amount: Number(detail.count)
          }))
        )
      })).then(res => {
        if(res.meta.requestStatus === 'fulfilled') {
          toast.success('Работа успешно принята!');
        } else {
          toast.error('Произошла ошибка!');
        }
      })
    }
  }

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-5'>
      <MyBreadcrums items={breadcrumbs} />
      <div className='flex justify-between items-center'>
        <p className='text-lg font-inter font-semibold'>Прием работы</p>
        <Button onClick={() => navigate('history')}>История работ</Button>
      </div>

      <div className='bg-white rounded-lg p-4 flex flex-col gap-y-3'>
        <div className='flex items-center border-b border-borderGray py-2'>
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <tbody>
              <tr className="flex justify-between flex-wrap">
                <td className="border border-borderGray p-2 font-semibold flex">Заказ: <span className="text-fprimary ml-2">№ {orderInfo?.id}</span></td>
                <td className="flex-1 min-w-[220px] border border-borderGray p-2 font-semibold flex">Компания: <span className="text-fprimary ml-2">{orderInfo?.company}</span></td>
                <td className="flex-1 min-w-[220px] border border-borderGray p-2 font-semibold flex">Товар: <span className="text-fprimary ml-2">{orderInfo?.productTitle}</span></td>
                <td className="flex-1 border border-borderGray p-2 font-semibold flex">Артикул: <span className="text-fprimary ml-2">{orderInfo?.vendorCode}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>

        <div className='flex items-center gap-x-4'>
          <Select
            width='180px'
            size='sm'
            data={parties}
            labelKey={'title'}
            valueKey={'value'}
            placeholder={'Выберите партию'}
            label='Партия'
            error={errors.party}
            value={urls?.party === '' ? '' : Number(urls?.party)}
            onChange={(e) => getValue({ target: { name: 'party', value: e } })}
          />

          <Select
            width='180px'
            size='sm'
            data={colors}
            labelKey={'title'}
            valueKey={'id'}
            placeholder={'Выберите цвет'}
            label='Цвет'
            colors={true}
            error={errors.color}
            disabled={urls?.party ? false : true}
            value={Number(urls?.color)}
            onChange={(e) => getValue({ target: { name: 'color', value: e } })}
          />

          <Select
            width='180px'
            size='sm'
            data={sizes}
            labelKey={'title'}
            valueKey={'id'}
            placeholder={'Выберите размер'}
            label='Размер'
            disabled={urls?.color ? false : true}
            value={Number(urls?.size)}
            error={errors.size}
            onChange={(e) => getValue({ target: { name: 'size', value: e } })}
          />
        </div>
        
        <AccWorkTable data={operations_list} status={operations_list_status} amount={orderInfo?.amount || 0} />

        <div className='flex justify-center'>
          <Button width={'200px'} onClick={onSubmit}>
            Создать
          </Button>
        </div>
      </div>

    </div>
  )
}

export default CreateAccWork
