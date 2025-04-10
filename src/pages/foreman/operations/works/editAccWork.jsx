import React, { useEffect, useState } from 'react'
import MyBreadcrums from '../../../../components/ui/breadcrums';
import { useDispatch, useSelector } from 'react-redux';
import { getPartyList, getProductOperations, getWorkById, patchAcceptOperation } from '../../../../store/foreman/order';
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
    { label: 'Главная', path: '/operations', active: false },
    { label: 'Прием работы', path: `/operations/${orderId}/${id}`, active: false },
    { label: 'Исторя приемов работы', path: `/operations/${orderId}/${id}/history`, active: false },
    { label: 'Редактирование приема работы', path: `/operations/${orderId}/${id}/history/${workId}`, active: true },
  ];

  const { work, work_status, parties, operations_list, operations_list_status, staff_list } = useSelector(state => state.foreman_order);

  const [orderInfo, setOrderInfo] = useState({});

  useEffect(() => {
    dispatch(getWorkById({ work: workId, product: { product: id } }));
    dispatch(getPartyList({ order: orderId, product: id }));

    setOrderInfo(JSON.parse(localStorage.getItem('order')))
  }, [])

  const validateField = () => {
    const staffIds = staff_list.map(staff => Number(staff.number)); // Получаем список ID сотрудников
    const maxAmount = work?.party_amount || 0;
  
    let hasInvalidData = false;
  
    const validatedDetails = operations_list?.flatMap(item =>
      item?.details?.map(detail => {
        const staff = Number(detail.staff);
        const amount = Number(detail.count);
  
        if (staff && !staffIds.includes(staff)) {
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
    return true
  
  };

  const onSubmit = () => {
    if(validateField()) {
      dispatch(patchAcceptOperation({
        id: workId,
        props: {
            party: work.party,
            color: work?.color?.id,
            size: work?.size?.id,
            details: operations_list?.flatMap(item =>
              item?.details?.map(detail => {
                const staffNumber = Number(detail.staff);
                const amount = Number(detail.count);
      
                if (!staffNumber || amount <= 0) {
                  return null;
                }
      
                // Находим сотрудника по номеру
                const staffObj = staff_list.find(staff => staff.number === staffNumber);
      
                // Если не найден, возвращаем null
                if (!staffObj) {
                  return null;
                }
      
                return {
                  combination: item.id,
                  staff: staffObj.id, // используем id найденного сотрудника
                  amount
                };
              }).filter(item => item !== null)  // Убираем null-элементы
            )
          }
      })).then(res => {
        if(res.meta.requestStatus === 'fulfilled') {
          toast.success('Работа успешно изменена!');
          navigate(`/crm/operations/${orderId}/${id}/history`);
        } else if(res.payload?.code === '100') {
          toast.error(res.payload?.detail);
        } else {
          toast.error('Произошла ошибка!');
        }
      })
    }
  }

  return (
    <div className='flex min-h-[100vh] flex-col gap-y-4 mb-5'>
        <MyBreadcrums items={breadcrumbs} />
        <p className='text-lg font-inter font-semibold'>История работ</p>

        {
          work_status === 'loading' && <BackDrop open={true} />
        }

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
                    data={parties || []}
                    labelKey={'title'}
                    valueKey={'id'}
                    placeholder={'Выберите партию'}
                    label='Партия'
                    disabled={true}
                    value={work?.party}
                />

                <Select
                    width='180px'
                    size='sm'
                    data={[{ ...work?.color }] || []}
                    labelKey={'title'}
                    valueKey={'id'}
                    placeholder={'Выберите цвет'}
                    label='Цвет'
                    disabled={true}
                    value={Number(work?.color?.id)}
                />

                <Select
                    width='180px'
                    size='sm'
                    data={[{ ...work?.size }] || []}
                    labelKey={'title'}
                    valueKey={'id'}
                    placeholder={'Выберите размер'}
                    label='Размер'
                    disabled={true}
                    value={Number(work?.size?.id)}
                />
            </div>
            
            <AccWorkTable data={operations_list} status={work_status} amount={work?.party_amount || 0} />

            <div className='flex justify-center'>
            <Button width={'200px'} onClick={onSubmit}>
                Сохранить
            </Button>
            </div>
      </div>
    </div>
  )
}

export default EditAccWork
