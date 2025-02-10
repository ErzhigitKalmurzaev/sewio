import React, { useEffect } from 'react'
import Title from '../../../../components/ui/title'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { getCalculateList } from '../../../../store/technolog/calculation';
import { Table } from 'rsuite';
import { formatedToDDMMYYYY } from '../../../../utils/functions/dateFuncs';
import { ReactComponent as Pencil } from '../../../../assets/icons/pencil.svg';

const { Column, HeaderCell, Cell } = Table;

const CalcHistory = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { calc_history, calc_history_status } = useSelector(state => state.calculation)

  useEffect(() => {
    dispatch(getCalculateList())
  }, [])

  return (
    <div className="w-full min-h-[100vh] flex flex-col gap-y-5">
        <div className="flex justify-between items-center">
          <Title text="История" />
        </div>

        <div className='min-h-[480px] font-inter bg-white rounded-xl'>
        <Table
            height={480}
            loading={calc_history_status === 'loading'}
            data={calc_history?.results || []}
            className='rounded-xl'
        >
            <Column width={90} align="center" fixed>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={300}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="title" />
            </Column>

            <Column width={150}>
                <HeaderCell>Артикул</HeaderCell>
                <Cell dataKey="vendor_code" />
            </Column>

            <Column width={200}>
                <HeaderCell>Статус</HeaderCell>
                <Cell dataKey="is_active">
                    {
                        rowData => (
                            <p>{formatedToDDMMYYYY(rowData?.created_at)}</p>
                        )
                    }
                </Cell>
            </Column>
            <Column width={470} fixed="right">
                <HeaderCell>Действия</HeaderCell>

                <Cell style={{ padding: '6px' }}>
                  {rowData => (
                      <div className='flex items-center px-3 py-1 cursor-pointer'>
                        <Pencil onClick={() => navigate(`/crm/calculator/${rowData.id}`)} size={18} />
                      </div>
                  )}
                </Cell>
            </Column>
        </Table>
    </div>
    </div>
  )
}

export default CalcHistory
