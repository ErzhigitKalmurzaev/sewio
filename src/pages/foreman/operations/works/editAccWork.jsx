import React, { useEffect, useState } from 'react'
import MyBreadcrums from '../../../../components/ui/breadcrums';
import { useDispatch, useSelector } from 'react-redux';
import { getPartyList, getProductCombinations, patchAcceptOperation, clearCombinationsList, getWorkById } from '../../../../store/foreman/order';
import { useNavigate, useParams } from 'react-router-dom';
import AccWorkTable from '../components/tables/AccWorkTable';
import Select from '../../../../components/ui/inputs/select';
import Button from '../../../../components/ui/button';
import { toast } from 'react-toastify';
import BackDrop from '../../../../components/ui/backdrop';

const EditAccWork = () => {

  const { orderId, id, workId } = useParams();   
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const breadcrumbs = [
    { label: 'Home', path: '/operations', active: false },
    { label: 'Crate work', path: `/operations/${orderId}/${id}`, active: false },
    { label: 'History of works', path: `/operations/${orderId}/${id}/history`, active: false },
    { label: 'Editing the work', path: `/operations/${orderId}/${id}/history/${workId}`, active: true },
  ];

  const { work, work_status, parties, combinations_list, combinations_list_status, staff_list } = useSelector(state => state.foreman_order);
  const  { me_info } = useSelector(state => state.auth);
  
  const [orderInfo, setOrderInfo] = useState({});
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    // Очищаем предыдущие данные
    dispatch(clearCombinationsList());
    dispatch(getWorkById({ work: workId, product: { product: id } }));

    if (id) {
      dispatch(getProductCombinations(id)).finally(() => {
        setIsLoading(false);
      });
    }
    
    // Загружаем партии
    dispatch(getPartyList({ order: orderId, product: id }));

    const storedOrder = JSON.parse(localStorage.getItem('order'));
    setOrderInfo(storedOrder || {});

    return () => {
      // Очистка при размонтировании
      dispatch(clearCombinationsList());
    };
  }, [dispatch, orderId, id])
  
  useEffect(() => {
    if (work) {
      setSelectedParty(work.party);
      setSelectedColor(work?.color?.id);
      setSelectedSize(work?.size?.id);
    }
  }, [work])

  const validateField = () => {
    if (!combinations_list || combinations_list.length === 0) {
      toast.error('Нет данных для сохранения');
      return false;
    }

    const staffIds = staff_list?.map(staff => Number(staff.number)) || [];
    const maxAmount = work?.party_amount || 0;
  
    let hasInvalidData = false;
    let hasValidData = false;
  
    combinations_list.forEach(combination => {
      combination.details?.forEach(detail => {
        const staff = detail.staff ? Number(detail.staff) : null;
        const amount = detail.count ? Number(detail.count) : 0;

        // Пропускаем пустые строки
        if (!staff && !amount) {
          return;
        }

        // Если есть хоть что-то заполненное
        if (staff || amount > 0) {
          hasValidData = true;
        }

        if (staff && !staffIds.includes(staff)) {
          hasInvalidData = true;
          toast.error(`Ошибка: Сотрудник ${staff} отсутствует в списке!`);
        }

        if (amount > maxAmount) {
          hasInvalidData = true;
          toast.error(`Ошибка: Количество ${amount} превышает допустимое ${maxAmount}`);
        }
      });
    });

    if (!hasValidData) {
      toast.error('Заполните хотя бы одну строку с сотрудником и количеством');
      return false;
    }
  
    if (hasInvalidData) {
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (!validateField()) {
      return;
    }

    // Формируем данные для отправки
    const details = combinations_list.flatMap(combination =>
      combination.details
        ?.filter(detail => {
          const staffNumber = detail.staff;
          const amount = Number(detail.count);

          // Пропустить если уже оплачен, или нет валидных данных
          return detail.status !== 1 && staffNumber && amount > 0;
        })
        .map(detail => {
          const staffNumber = detail.staff;
          const amount = Number(detail.count);
          const staffObj = staff_list?.find(staff => staff.number === staffNumber);

          if (!staffObj) return null;

          return {
            combination: combination.id,
            staff: staffObj.id,
            amount
          };
        })
        .filter(Boolean) // удаляет null если сотрудник не найден
    );

    if (details.length === 0) {
      toast.error('Нет данных для сохранения');
      return;
    }

    const payload = {
      party: selectedParty,
      details
    };

    if (selectedColor) {
      payload.color = selectedColor;
    }
    if (selectedSize) {
      payload.size = selectedSize;
    }

    setIsLoading(true);
    dispatch(patchAcceptOperation({
      id: workId,
      props: payload
    })).then(res => {
      setIsLoading(false);
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Работа успешно изменена!');
        navigate(`/crm/operations/${orderId}/${id}/history`);
      } else if (res.payload?.code === '100') {
        toast.error(res.payload?.detail);
      } else {
        toast.error('Произошла ошибка!');
      }
    }).catch(() => {
      setIsLoading(false);
      toast.error('Произошла ошибка при сохранении!');
    });
  }
  
  return (
    <div className='flex min-h-[100vh] flex-col gap-y-4 mb-5'>
        <MyBreadcrums items={(me_info?.role === 7 || me_info?.role === 6) ? breadcrumbs.filter((e, i) => i !== 1) : breadcrumbs} />
        <p className='text-lg font-inter font-semibold'>Editing work</p>

        <BackDrop open={isLoading} />

        <div className='bg-white rounded-lg p-4 flex flex-col gap-y-3'>
            <div className='flex items-center border-b border-borderGray py-2'>
              <div className="w-full overflow-x-auto">
                <table className="w-full">
                    <tbody>
                    <tr className="flex justify-between flex-wrap">
                        <td className="border border-borderGray p-2 font-semibold flex">Order: <span className="text-fprimary ml-2">№ {orderInfo?.id}</span></td>
                        <td className="flex-1 min-w-[220px] border border-borderGray p-2 font-semibold flex">Company: <span className="text-fprimary ml-2">{orderInfo?.company}</span></td>
                        <td className="flex-1 min-w-[220px] border border-borderGray p-2 font-semibold flex">Product: <span className="text-fprimary ml-2">{orderInfo?.productTitle}</span></td>
                        <td className="flex-1 border border-borderGray p-2 font-semibold flex">Article: <span className="text-fprimary ml-2">{orderInfo?.vendorCode}</span></td>
                    </tr>
                    </tbody>
                </table>
              </div>
            </div>

            <div className='flex items-center gap-x-4'>
                <Select
                    width='180px'
                    size='sm'
                    data={parties || []}
                    labelKey={'title'}
                    valueKey={'id'}
                    placeholder={'Select party'}
                    label='Party'
                    disabled={true}
                    value={selectedParty}
                    onChange={(value) => setSelectedParty(value)}
                />

                {work?.color && (
                  <Select
                      width='180px'
                      size='sm'
                      data={[{ ...work?.color }] || []}
                      labelKey={'title'}
                      valueKey={'id'}
                      placeholder={'Select color'}
                      label='Color'
                      disabled={true}
                      value={selectedColor}
                      onChange={(value) => setSelectedColor(value)}
                  />
                )}

                {work?.size && (
                  <Select
                      width='180px'
                      size='sm'
                      data={[{ ...work?.size }] || []}
                      labelKey={'title'}
                      valueKey={'id'}
                      placeholder={'Select size'}
                      label='Size'
                      disabled={true}
                      value={selectedSize}
                      onChange={(value) => setSelectedSize(value)}
                  />
                )}
            </div>
            
            <AccWorkTable 
              data={combinations_list || []} 
              status={combinations_list_status} 
              amount={work?.party_amount || 0} 
            />

            <div className='flex justify-center'>
              <Button width={'200px'} onClick={onSubmit} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
      </div>
    </div>
  )
}

export default EditAccWork