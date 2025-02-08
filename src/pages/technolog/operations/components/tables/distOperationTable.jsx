import { Checkbox, Table } from 'rsuite';
import React from 'react';

const { Column, HeaderCell, Cell } = Table;

// Функция для переименования ключей и добавления type
function renameKeys(obj, parentType = null) {
    const newObj = {
        ...obj,
        type: parentType === 'combinations' ? 'combinations' :
              parentType === 'operations' ? 'operation' :
              'product'
    };

    for (const key in obj) {
        if (key === 'combinations') {
            newObj['children'] = obj[key].map(item => renameKeys(item, 'combinations'));
            delete newObj['combinations'];
        } else if (key === 'operations') {
            newObj['children'] = obj[key].map(item => renameKeys(item, 'operations'));
            delete newObj['operations'];
        }
    }

    return newObj;
}

const 
DistOperationTable = ({ data, status, operations, setOperations }) => {

    const dataWithChildren = data.map(item => renameKeys(item));

    const selectOperation = (rowData) => {
        if (rowData.type === 'combinations') {
            const operationObjects = rowData.children;

            setOperations((prevOperations) => {
                const allExist = operationObjects.every(op => prevOperations.some(o => o.id === op.id));
                if (allExist) {
                    // Удаляем все операции комбинации, если они уже есть
                    return prevOperations.filter(op => !operationObjects.some(o => o.id === op.id));
                } else {
                    // Добавляем отсутствующие операции комбинации
                    return [...prevOperations, ...operationObjects.filter(op => !prevOperations.some(o => o.id === op.id))];
                }
            });
        } else if (rowData.type === 'operation') {
            setOperations((prevOperations) => {
                if (prevOperations.some(op => op.id === rowData.id)) {
                    // Удаляем операцию, если она уже выбрана
                    return prevOperations.filter(op => op.id !== rowData.id);
                } else {
                    // Добавляем операцию, если она не выбрана
                    return [...prevOperations, rowData];
                }
            });
        }
    };

    const checkChecked = (rowData) => {
        if (rowData.type === 'combinations') {
            return rowData.children.every(child => operations.some(op => op.id === child.id));
        } else if (rowData.type === 'operation') {
            return operations.some(op => op.id === rowData.id);
        } else {
            return false;
        }
    };

    const getType = (type) => {
        if (type === 'combinations') {
            return 'Комбинация';
        } else if (type === 'operation') {
            return 'Операция';
        } else {
            return 'Товар';
        }
    };

    return (
        <div className='min-h-[400px] font-inter bg-white font-inter rounded-xl'>
            <Table
                isTree
                defaultExpandAllRows={false}
                bordered
                cellBordered
                virtualized
                height={400}
                loading={status === 'loading'}
                data={dataWithChildren || []}
                rowKey="id"
                shouldUpdateScroll={false}
                className='rounded-xl'
            >
                <Column width={500}>
                    <HeaderCell>Название</HeaderCell>
                    <Cell dataKey="title" />
                </Column>

                <Column width={200}>
                    <HeaderCell>Тип</HeaderCell>
                    <Cell>
                        {(rowData) => (
                            <p>{getType(rowData.type)}</p>
                        )}
                    </Cell>
                </Column>

                <Column width={150}>
                    <HeaderCell>Распределено</HeaderCell>
                    <Cell>
                        {(rowData) => (
                            rowData.type === 'operation' && <p>{rowData.assigned}/{rowData.required}</p>
                        )}
                    </Cell>
                </Column>

                <Column width={100} align="center">
                    <HeaderCell>Действия</HeaderCell>
                    <Cell style={{ padding: '6px' }}>
                        {(rowData, index) => (
                            rowData.type !== 'product' &&
                            <div 
                                className='flex items-center cursor-pointer' 
                                key={index + 'check'}
                                onClick={() => selectOperation(rowData)}
                            >
                                <Checkbox 
                                    checked={checkChecked(rowData)}
                                />
                            </div>
                        )}
                    </Cell>
                </Column>
            </Table>
        </div>
    );
};

export default DistOperationTable;
