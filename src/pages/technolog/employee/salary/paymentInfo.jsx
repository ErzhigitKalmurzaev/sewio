import React, { useEffect, useRef } from 'react'
import MyBreadcrums from '../../../../components/ui/breadcrums'
import Title from '../../../../components/ui/title'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clear_payment_info, getStaffPaymentDetail } from '../../../../store/technolog/staff'
import PaymentInfoTable from '../../../../components/common/tables/paymentInfoTable'
import BackDrop from '../../../../components/ui/backdrop'
import { useReactToPrint } from 'react-to-print'
import Button from '../../../../components/ui/button'
import { Print } from '@mui/icons-material'

const PrintableReport = React.forwardRef((props, ref) => {
  const { payment_detail, payment_detail_status } = props;

  return (
    <div ref={ref} className='flex flex-col gap-y-5 mb-5'>
      <Title text={`Информация о выплате сотруднику: ${payment_detail?.staff?.name} ${payment_detail?.staff?.surname}`} />

      {payment_detail_status === 'loading' && <BackDrop open={true} />}

      <div className='w-2/3'>
        <PaymentInfoTable
          data={payment_detail}
          status={payment_detail?.status}
        />
      </div>

      {payment_detail?.files?.length > 0 && (
        <div className='flex flex-col gap-y-4'>
          <p className='text-lg font-semibold font-inter'>Картинки</p>
          <div className='flex gap-x-4 flex-wrap'>
            {payment_detail?.files?.map((item, index) => (
              <div key={index} className='w-[200px] h-[200px] rounded-lg border border-borderGray'>
                <img
                  src={item.file}
                  alt={`file-${index}`}
                  className='w-full h-full object-contain'
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

const PaymentInfo = () => {
  const { id, salary_id } = useParams();
  const dispatch = useDispatch();
  const printRef = useRef();

  const { payment_detail, payment_detail_status } = useSelector(state => state.staff);

  useEffect(() => {
    dispatch(clear_payment_info())
    dispatch(getStaffPaymentDetail({ id: salary_id }))
  }, [salary_id, dispatch])

  const handlePrint = useReactToPrint({
    documentTitle: `Отчёт о выплате`,
    contentRef: printRef,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: Arial;
        }
      }
    `
  });

  const breadcrumbs = [
    {
        label: 'Сотрудники',
        path: '/employee',
        active: false
    },
    {
        label: 'Редактирование сотрудника',
        path: `/employee/${id}`,
        active: false
    },
    {
        label: 'Информация о выплате',
        path: '/employee/info/salary_payment',
        active: true
    }
  ];

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
      <div className='flex items-center justify-between'>
        <MyBreadcrums items={breadcrumbs} />
        {payment_detail && (
          <Button 
            onClick={handlePrint} 
            className='w-max px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            <Print className='mr-2'/>
            Распечатать
          </Button>
        )}
      </div>

      {/* Печатная часть */}
      <PrintableReport
        ref={printRef}
        payment_detail={payment_detail}
        payment_detail_status={payment_detail_status}
      />
    </div>
  )
}


export default PaymentInfo
