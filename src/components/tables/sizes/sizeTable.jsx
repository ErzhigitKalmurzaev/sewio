import React, { useState, useMemo } from 'react';
import { Table, Input, InputGroup } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';

import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';

const { Column, HeaderCell, Cell } = Table;

const SizeTable = ({ data, setModals, modals, status }) => {
    const [searchValue, setSearchValue] = useState('');

    const editSize = (data) => {
        setModals({ ...modals, edit: true, edit_data: data });
    };

    // Функция для извлечения базового размера из строки
    const extractBaseSize = (title) => {
        // Проверяем, является ли размер числовым (например, "40(164)")
        const numericMatch = title.match(/^(\d+)/);
        if (numericMatch) {
            return { type: 'numeric', value: parseInt(numericMatch[1]) };
        }
        
        // Проверяем буквенные размеры (XXL, XL, L, M, S и т.д.)
        const letterMatch = title.match(/^([A-Z]+)/i);
        if (letterMatch) {
            const sizeOrder = { 'XXS': 1, 'XS': 2, 'S': 3, 'M': 4, 'L': 5, 'XL': 6, 'XXL': 7, 'XXXL': 8 };
            return { type: 'letter', value: sizeOrder[letterMatch[1].toUpperCase()] || 99, text: letterMatch[1].toUpperCase() };
        }
        
        return { type: 'other', value: title };
    };

    // Получаем отсортированные данные
    const sortedData = useMemo(() => {
        if (!data) return [];

        return [...data].sort((a, b) => {
            const sizeA = extractBaseSize(a.title);
            const sizeB = extractBaseSize(b.title);

            // Сначала сортируем по типу (числовые, буквенные, другие)
            if (sizeA.type !== sizeB.type) {
                const typeOrder = { 'numeric': 1, 'letter': 2, 'other': 3 };
                return typeOrder[sizeA.type] - typeOrder[sizeB.type];
            }

            // Внутри одного типа сортируем по значению
            if (sizeA.type === 'numeric' || sizeA.type === 'letter') {
                if (sizeA.value !== sizeB.value) {
                    return sizeA.value - sizeB.value;
                }
                // Если базовый размер одинаковый, сортируем по полному названию
                return a.title.localeCompare(b.title);
            }

            // Для остальных - по алфавиту
            return a.title.localeCompare(b.title);
        });
    }, [data]);

    // Фильтрация данных по поисковому запросу
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) return sortedData;

        return sortedData.filter((item) =>
            item.title.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [sortedData, searchValue]);

    return (
        <div className='min-h-[600px] font-inter bg-white rounded-xl'>
            <div className='p-4'>
                <InputGroup inside style={{ width: 300 }}>
                    <Input
                        placeholder="Поиск по размеру..."
                        value={searchValue}
                        onChange={setSearchValue}
                    />
                    <InputGroup.Addon>
                        <SearchIcon />
                    </InputGroup.Addon>
                </InputGroup>
            </div>

            <Table
                height={600}
                loading={status === 'loading'}
                data={filteredData || []}
                className='rounded-lg'
                bordered
                cellBordered
            >
                <Column width={90} align="center" fixed>
                    <HeaderCell>ID</HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <Column width={200}>
                    <HeaderCell>Название</HeaderCell>
                    <Cell dataKey="title" />
                </Column>

                <Column width={200}>
                    <HeaderCell>Статус</HeaderCell>
                    <Cell dataKey="is_active">
                        {rowData => (
                            <p
                                className='font-inter text-sm'
                                style={
                                    rowData.is_active
                                        ? { color: '#2F4F4F' }
                                        : { color: 'rgba(188, 193, 201, 1)' }
                                }
                            >
                                {rowData.is_active ? 'Активный' : 'Деактивный'}
                            </p>
                        )}
                    </Cell>
                </Column>

                <Column flexGrow={1} fixed="right">
                    <HeaderCell>Действия</HeaderCell>

                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <div className='flex items-center gap-x-3 px-3 py-1 cursor-pointer'>
                                <Pencil onClick={() => editSize(rowData)} />
                            </div>
                        )}
                    </Cell>
                </Column>
            </Table>
        </div>
    );
};

export default SizeTable;