import { ChartColumnIncreasing, Users, Cable, Package, ShoppingBasket, Warehouse, BookOpenCheck, ClipboardList, Ribbon, GraduationCap } from 'lucide-react';

export const technologNav = [
    {
        title: 'Статистика',
        path: 'statistic',
        icon: <ChartColumnIncreasing/>,
        elements: false
    },
    {
        title: 'Заказы',
        path: 'orders',
        icon: <Package />,
        elements: false
    },
    {
        title: 'Операции',
        path: 'operations',
        icon: <ClipboardList />,
        elements: false
    },
    {
        title: 'Склады',
        path: 'sklad',
        icon: <Warehouse />,
        elements: false
    },
    {
        title: 'Справочник',
        icon: <BookOpenCheck />,
        elements: true, 
        buttons: [
            {
                title: 'Сотрудники',
                path: 'employee',
                icon: <Users />,
                elements: false
            },
            {
                title: 'Товары',
                path: 'product',
                icon: <ShoppingBasket />,
                elements: false
            },
            {
                title: 'Разряд',
                path: 'discharge',
                icon: <Ribbon />,
                elements: false,
            },
            {
                title: 'База знаний',
                path: 'knowledge',
                icon: <GraduationCap />,
                elements: false,
            },
            {
                title: 'Оборудование',
                path: 'equipments',
                icon: <Cable />,
                elements: false
            },
        ]
    }
]
