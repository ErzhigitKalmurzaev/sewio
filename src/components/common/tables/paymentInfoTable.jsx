import React from 'react'
import { formatedToDDMMYYYY, formatedToDDMMYYYYHHMM } from '../../../utils/functions/dateFuncs';
import { formatNumber } from '../../../utils/functions/numFuncs';

const PaymentInfoTable = ({ data, status }) => {
    
    const calculateTotal = (items) => items.reduce((total, item) => total + item.total_amount, 0);
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ru-RU');
    
    return (
    <div className="bg-[#EDEDED] rounded-xl border border-borderGray">
        {
            status === 1 ?
            <>
                <h3 className="text-lg font-bold mb-2 px-4 pt-2 flex justify-between items-center">
                    <span>Операции</span>
                    <span className='text-base mt-1'>{`${formatedToDDMMYYYY(data?.date_from) + ' - ' + formatedToDDMMYYYY(data?.date_until)}`}</span>
                </h3>
                <table className="min-w-full table-auto bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-borderGray px-4 py-2">ID заказа</th>
                            <th className="border border-borderGray px-4 py-2">Партия</th>
                            <th className="border border-borderGray px-4 py-2">Название</th>
                            <th className="border border-borderGray px-4 py-2">Количество</th>
                            <th className="border border-borderGray px-4 py-2">Цена (сом)</th>
                            <th className="border border-borderGray px-4 py-2">Сумма (сом)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.operations.map((op, index) => (
                        <tr key={`${index} ` + op?.operation_title} className={'odd:bg-green-50'}>
                            <td className="border border-borderGray px-2 py-2 text-center">{op?.order_id}</td>
                            <td className="border border-borderGray px-4 py-2">{op?.party_number}</td>
                            <td className="border border-borderGray px-4 py-2">{op?.operation_title}</td>
                            <td className="border border-borderGray px-4 py-2">{op?.total_amount}</td>
                            <td className="border border-borderGray px-4 py-2">{op?.operation_price}</td>
                            <td className="border border-borderGray px-4 py-2">{op?.total_price?.toFixed(2)}</td>
                        </tr>
                        ))}
                        <tr>
                        <td colSpan="5" className="border border-borderGray px-4 py-2 font-bold">Итого:</td>
                        <td className="border border-borderGray px-4 py-2 font-bold text-green-600">
                            +{data?.amount?.toFixed(2)}
                        </td>
                        <td></td>
                        </tr>
                    </tbody>
                </table>
            </> : 
            <></>
        }

        {
            (status === 2 || status === 4) ?
            <>
                <h2 className="text-lg font-bold mb-2 px-4 pt-2">Штрафы</h2>
                <table className="min-w-full table-auto bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                        <th className="border border-borderGray px-4 py-2">ID</th>
                        <th className="border border-borderGray px-4 py-2">Дата</th>
                        <th className="border border-borderGray px-4 py-2">Сумма</th>
                        <th className="max-w-[250px] border border-borderGray px-4 py-2">Комментарий</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={data.id} className={'bg-[#FFE4E6]'}>
                            <td className="border border-borderGray px-4 py-2">{data?.id}</td>
                            <td className="border border-borderGray px-4 py-2">{formatedToDDMMYYYYHHMM(data?.created_at)}</td>
                            <td className="border border-borderGray px-4 py-2">{formatNumber(data?.amount)}</td>
                            <td className="max-w-[250px] border border-borderGray px-4 py-2">{data?.comment}</td>
                        </tr>
                        <tr>
                            <td colSpan="3" className="border border-borderGray px-4 py-2 font-bold">Итого:</td>
                            <td className="border border-borderGray px-4 py-2 font-bold text-redd">
                            -{formatNumber(data?.amount)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </> : 
            <></>
        }

        {
            (status === 5 || status === 3) ?
            <>
                <h2 className="text-lg font-bold mb-2 px-4 pt-2">Авансы</h2>
                <table className="min-w-full table-auto bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                        <th className="border border-borderGray px-4 py-2">ID</th>
                        <th className="border border-borderGray px-4 py-2">Дата</th>
                        <th className="border border-borderGray px-4 py-2">Сумма</th>
                        <th className="border border-borderGray px-4 py-2">Комментарий</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={data.id} className={'bg-blue-50'}>
                            <td className="border border-borderGray px-4 py-2">{data?.id}</td>
                            <td className="border border-borderGray px-4 py-2">{formatedToDDMMYYYYHHMM(data?.created_at)}</td>
                            <td className="border border-borderGray px-4 py-2">{formatNumber(data?.amount)}</td>
                            <td className="border border-borderGray px-4 py-2">{data?.comment}</td>
                        </tr>
                        <tr>
                            <td colSpan="3" className="border border-borderGray px-4 py-2 font-bold">Итого:</td>
                            <td className="border border-borderGray px-4 py-2 font-bold text-blue-600">
                            {formatNumber(data.amount)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </> :
            <></>
        }
        {
            (status === 6) ?
            <>
                <h2 className="text-lg font-bold mb-2 px-4 pt-2">Бонус</h2>
                <table className="min-w-full table-auto bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                        <th className="border border-borderGray px-4 py-2 text-start">ID</th>
                        <th className="border border-borderGray px-4 py-2 text-start">Дата</th>
                        <th className="border border-borderGray px-4 py-2 text-start">Сумма</th>
                        <th className="border border-borderGray px-4 py-2 text-start">Комментарий</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={data.id} className={'bg-blue-50'}>
                            <td className="border border-borderGray px-4 py-2">{data?.id}</td>
                            <td className="border border-borderGray px-4 py-2">{formatedToDDMMYYYYHHMM(data?.created_at)}</td>
                            <td className="border border-borderGray px-4 py-2">{formatNumber(data?.amount)}</td>
                            <td className="border border-borderGray px-4 py-2">{data?.comment}</td>
                        </tr>
                        <tr>
                            <td colSpan="3" className="border border-borderGray px-4 py-2 font-bold">Итого:</td>
                            <td className="border border-borderGray px-4 py-2 font-bold text-blue-600">
                            {formatNumber(data.amount)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </> :
            <></>
        }
        {
            !data?.operations && !data?.id ? 
            <h3 className="text-lg font-bold mb-2 p-10 text-center">Нет данных</h3> :
            <></>
        }
    </div>
    );
}

export default PaymentInfoTable
