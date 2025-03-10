import { ChartColumnIncreasing, Users, UsersRound, Cable, Package, ShoppingBasket, Warehouse, BookOpenCheck, ClipboardList, Ribbon, GraduationCap, PencilRuler, CircleDollarSign, Calculator } from 'lucide-react';

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
                title: 'Клиенты',
                path: 'clients',
                icon: <UsersRound />,
                elements: false
            },
            {
                title: 'Товары',
                path: 'product',
                icon: <ShoppingBasket />,
                elements: false
            },
            {
                title: 'Операции',
                path: 'operations',
                icon: <ClipboardList />,
                elements: false
            },
            {
                title: 'Разряды',
                path: 'discharge',
                icon: <Ribbon />,
                elements: false,
            },
            {
                title: 'Атрибуты',
                path: 'sizes',
                icon: <PencilRuler/>,
                elements: false,
            },
            {
                title: 'Оборудование',
                path: 'equipments',
                icon: <Cable />,
                elements: false
            },
            {
                title: 'База знаний',
                path: 'knowledge',
                icon: <GraduationCap />,
                elements: false,
            },
            {
                title: 'Калькулятор',
                path: 'calculator',
                icon: <Calculator />,
                elements: false,
            },
        ]
    }
]

export const warehouseNav = [
    {
        title: 'Мой склад',
        path: 'main',
        icon: <Warehouse/>,
        elements: false
    },
]

export const shveyaNav = [
    {
        title: 'Заработная плата',
        path: 'salary',
        icon: <CircleDollarSign/>,
        elements: false
    },
    {
        title: 'Операции',
        path: 'operations',
        icon: <ClipboardList/>,
        elements: false
    }
]

export const kroiNav = [
    {
        title: 'Заработная плата',
        path: 'salary',
        icon: <CircleDollarSign/>,
        elements: false
    },
    {
        title: 'Заказы',
        path: 'orders',
        icon: <ClipboardList/>,
        elements: false
    }
]

export const foremanNav = [
    {
        title: 'Операции',
        path: 'operations',
        icon: <ClipboardList/>,
        elements: false
    }
]
