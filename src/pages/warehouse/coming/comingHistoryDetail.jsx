import React, { useEffect, useState } from 'react';
import MyBreadcrums from '../../../components/ui/breadcrums';
import Title from '../../../components/ui/title';
import Button from '../../../components/ui/button';
import ComingMaterialsTable from './components/tables/comingMaterialsTable';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getComingHistoryById, getComingById, postAnswerComing } from '../../../store/warehouse/warehouse';
import RejectComingModal from './components/modals/rejectComingModal';
import { toast } from 'react-toastify';

const ComingHistoryDetail = () => {
    const breadcrumbs = [
        {
            label: 'Главная',
            path: '/main',
            active: false
        },
        {
            label: 'Приход сырья',
            path: '/main/coming',
            active: false
        },
        {
            label: 'История прихода сырья',
            path: '/main/coming/history',
            active: false
        },
        {
            label: 'Подробнее',
            path: '/main/coming/history',
            active: true
        }
    ];

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();
    const { coming, coming_status } = useSelector(state => state.ware_warehouse);

    const [modals, setModals] = useState({ reject: false });

    useEffect(() => {
        dispatch(getComingHistoryById({ id }));
    }, []);

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className='flex flex-col gap-y-5 mb-5'>
            <MyBreadcrums items={breadcrumbs} />

            <div className='flex items-center justify-between'>
                <Title text={`Приход сырья №${coming?.id || ''}`} />
            </div>

            {/* Creative Warehouse Transfer Information Card */}
            {coming && coming.quantity && (
                <div className="bg-gradient-to-r from-slate-50 to-stone-50 rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 bg-white">
                        <div className="flex justify-between items-center">
                            <h3 className="text-primary font-bold text-lg">Информация о перемещении</h3>
                            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                                <span className="text-white text-sm">ID: {coming.id}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left side - Transfer details */}
                            <div className="md:w-1/3 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Дата перемещения</p>
                                        <p className="font-medium">{formatDate(coming.quantity.created_at)}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Сотрудник</p>
                                        <p className="font-medium">{coming.staff_surname} {coming.staff_name}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Статус</p>
                                        {coming.status === 2 ? (
                                            <p className="text-red-600 font-medium">Отказан</p>
                                        ) : coming.status === 3 ? (
                                            <p className="text-green-600 font-medium">Принят</p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right side - Warehouse route visualization */}
                            <div className="md:w-2/3 border-l border-blue-100 pl-8">
                                <h4 className="text-primary font-medium mb-6">Маршрут перемещения</h4>
                                
                                <div className="relative">
                                    {/* Source warehouse */}
                                    <div className="flex items-start mb-8">
                                        <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 z-10">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 shadow-sm flex-1">
                                            <p className="text-xs text-gray-500">Склад отправления</p>
                                            <p className="font-bold text-gray-800">{coming.quantity.out_warehouse.title}</p>
                                            <p className="text-sm text-gray-600">{coming.quantity.out_warehouse.address}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Connecting line */}
                                    <div className="absolute left-4 top-8 w-0.5 h-16 bg-indigo-600 z-0"></div>
                                    
                                    {/* Arrow in the middle */}
                                    <div className="absolute left-0 top-16 w-8 h-8 flex items-center justify-center z-10">
                                        <div className="bg-white rounded-full p-1 shadow">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    {/* Destination warehouse */}
                                    <div className="flex items-start">
                                        <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 z-10">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 shadow-sm flex-1">
                                            <p className="text-xs text-gray-500">Склад назначения</p>
                                            <p className="font-bold text-gray-800">{coming.quantity.in_warehouse.title}</p>
                                            <p className="text-sm text-gray-600">{coming.quantity.in_warehouse.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h3 className="text-xl font-semibold text-primary font-inter mt-2">Перемещенные материалы</h3>
            <div className="bg-white rounded-lg shadow-md">
                <ComingMaterialsTable
                    data={coming?.quantity?.quantities}
                    status={coming_status}
                />
            </div>

            {/* <RejectComingModal modals={modals} setModals={setModals} onReject={() => onSubmit(3)}/> */}
        </div>
    );
};

export default ComingHistoryDetail;