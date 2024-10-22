import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

const TechnologEmployeeTable = () => {

    const navigate = useNavigate();

    const data = [
        {
          id: 1,
          full_name: "Иван Иванов",
          status: "Активен",
          phone: "+996 555 123 456",
          salary_type: "Фиксированная",
          role: "Технолог"
        },
        {
          id: 2,
          full_name: "Мария Петрова",
          status: "В отпуске",
          phone: "+996 555 654 321",
          salary_type: "Почасовая",
          role: "Технолог"
        },
        {
            id: 1,
            full_name: "Иван Иванов",
            status: "Активен",
            phone: "+996 555 123 456",
            salary_type: "Фиксированная",
            role: "Технолог"
          },
          {
            id: 2,
            full_name: "Мария Петрова",
            status: "В отпуске",
            phone: "+996 555 654 321",
            salary_type: "Почасовая",
            role: "Технолог"
          },
          {
            id: 1,
            full_name: "Иван Иванов",
            status: "Активен",
            phone: "+996 555 123 456",
            salary_type: "Фиксированная",
            role: "Технолог"
          },
          {
            id: 2,
            full_name: "Мария Петрова",
            status: "В отпуске",
            phone: "+996 555 654 321",
            salary_type: "Почасовая",
            role: "Технолог"
          },
          {
            id: 1,
            full_name: "Иван Иванов",
            status: "Активен",
            phone: "+996 555 123 456",
            salary_type: "Фиксированная",
            role: "Технолог"
          },
          {
            id: 2,
            full_name: "Мария Петрова",
            status: "В отпуске",
            phone: "+996 555 654 321",
            salary_type: "Почасовая",
            role: "Технолог"
          },
        {
          id: 3,
          full_name: "Алексей Сидоров",
          status: "Активен",
          phone: "+996 555 789 012",
          salary_type: "Фиксированная",
          role: "Менеджер"
        },
        {
          id: 4,
          full_name: "Елена Павлова",
          status: "Уволен",
          phone: "+996 555 567 890",
          salary_type: "Почасовая",
          role: "Оператор"
        }
      ];

  return (
    <div>
        <Table
            height={600}
            data={data}
            onRowClick={() => navigate('info')}
            >
            <Column width={60} align="center" fixed>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={250}>
                <HeaderCell>Ф.И.О.</HeaderCell>
                <Cell dataKey="full_name" />
            </Column>

            <Column width={150}>
                <HeaderCell>Статус</HeaderCell>
                <Cell dataKey="status" />
            </Column>

            <Column width={200}>
                <HeaderCell>Телефон</HeaderCell>
                <Cell dataKey="phone" />
            </Column>

            <Column width={200}>
                <HeaderCell>Тип зарплаты</HeaderCell>
                <Cell dataKey="salary_type" />
            </Column>

            <Column width={150}>
                <HeaderCell>Роль</HeaderCell>
                <Cell dataKey="role" />
            </Column>
            <Column width={200} fixed="right">
                <HeaderCell>Действия</HeaderCell>

                <Cell style={{ padding: '6px' }}>
                  {rowData => (
                      <Button appearance="link" onClick={() => alert(`id:${rowData.id}`)}>
                        Edit
                      </Button>
                  )}
                </Cell>
            </Column>
            </Table>
    </div>
  )
}

export default TechnologEmployeeTable
