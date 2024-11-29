import React from 'react'
import { employeeRole } from '../../../../../utils/selectDatas/employeeDatas'
import { Checkbox, Table } from 'rsuite'

const { Column, HeaderCell, Cell } = Table

const ModalStaffsModal = ({ staff_list, status, staffs, selectStaff }) => {
  return (
            <Table
                loading={status === 'loading'}
                data={staff_list}
                cellBordered
                height={400}
                className='rounded-xl'
            >
                <Column width={80} align='center'>
                    <HeaderCell>ID</HeaderCell>
                    <Cell dataKey="id" />
                </Column>
                <Column width={120}>
                    <HeaderCell className='pl-2'>Имя</HeaderCell>
                    <Cell dataKey="name" />
                </Column>
                <Column width={200}>
                    <HeaderCell>Фамилия</HeaderCell>
                    <Cell dataKey="surname" />
                </Column>
                <Column width={200}>
                    <HeaderCell>Роль</HeaderCell>
                    <Cell>
                        {(rowData) => (
                            <p>{employeeRole[rowData.role]?.label}</p>
                        )}
                    </Cell>
                </Column>

                <Column width={70}>
                    <HeaderCell>Выбрать</HeaderCell>
                    <Cell style={{ padding: '7px 15px'}}>
                        {(rowData, index) => (
                            <div 
                                className='flex cursor-pointer' 
                                key={index + 'check'}
                                onClick={() => selectStaff(rowData.id)}
                            >
                                <Checkbox checked={staffs.find(item => item === rowData.id)}/>
                            </div>
                        )}
                    </Cell>
                </Column>
            </Table>
  )
}

export default ModalStaffsModal
