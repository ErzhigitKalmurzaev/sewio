import React, { useState } from 'react';
import { Table } from 'rsuite';
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import Input from '../../../../../components/ui/inputs/input';
import Button from '../../../../../components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SelectForTable from '../../../../../components/ui/inputs/selectForTable';
import { materialUnits } from '../../../../../utils/selectDatas/productDatas';
import { createRolls } from '../../../../../store/technolog/material';
import { useNavigate } from 'react-router-dom';

const { Column, HeaderCell, Cell } = Table;

const InputRollMaterialsTable = ({ materials = [] }) => {
  
  const dispatch = useDispatch();  
  const navigate = useNavigate();

  const [rollCount, setRollCount] = useState('');
  const [rolls, setRolls] = useState([]);
  const { colors_list } = useSelector(state => state.material);

  const template = materials[0];

  const handleGenerateRolls = () => {
    const count = parseInt(rollCount, 10);
    if (isNaN(count) || count <= 0) {
      toast.warn('Введите корректное количество рулонов');
      return;
    }

    const defaultColor = template?.color;

    const newRolls = Array.from({ length: count }).map((_, index) => ({
      id: index + 1,
      coefficient: '',
      color: defaultColor,
      title: template.title,
      unit: template.unit,
      cost_price: ''
    }));

    setRolls(newRolls);
  };

  const updateRollField = (id, key, value) => {
    setRolls(prev =>
      prev.map(item => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const onSubmit = () => {
    const isValid = rolls.every(
      roll => roll.cost_price && roll.coefficient
    );
    if (!isValid) {
      toast.error('Заполните все поля у всех рулонов');
      return;
    }
    const payload = {
        title: template.title,
        unit: template.unit,
        details: rolls.map(roll => ({
          color: roll.color,
          cost_price: Number(roll.cost_price),
          coefficient: Number(roll.coefficient)
        }))
    };
    dispatch(createRolls(payload))
        .then(res => {
            if (res.meta.requestStatus === 'fulfilled') {
                toast.success('Рулоны успешно созданы');
                navigate(-1);
            } else {
                toast.error('Произошла ошибка');
            }
        })
  };

  return (
    <div className='flex flex-col gap-y-6'>
      <div className='flex gap-x-4 items-center'>
        <Input
          type='number'
          label='Укажите количество рулонов'
          placeholder='Кол-во рулонов'
          value={rollCount}
          onChange={e => setRollCount(e.target.value)}
          width='200px'
        />
        <Button width='160px' style={{ marginTop: '15px' }} onClick={handleGenerateRolls}>
          Развернуть рулоны
        </Button>
      </div>

      {rolls.length > 0 && (
        <div className='min-h-[400px] bg-white rounded-xl'>
          <Table
            data={rolls}
            height={450}
            cellBordered
            className='rounded-xl'
          >
            <Column width={200}>
              <HeaderCell>Название</HeaderCell>
              <Cell dataKey="title" style={{ paddingLeft: '15px' }} />
            </Column>

            <Column width={180}>
              <HeaderCell>Цвет</HeaderCell>
              <Cell style={{ padding: '8px 6px' }}>
                {rowData => (
                  <SelectForTable
                    data={colors_list}
                    value={rowData.color}
                    color={true}
                    placeholder='Выберите цвет'
                    labelKey={'title'}
                    valueKey={'id'}
                    onChange={value =>
                      updateRollField(rowData.id, 'color', value)
                    }
                  />
                )}
              </Cell>
            </Column>

            <Column width={150}>
              <HeaderCell>Коэффициент</HeaderCell>
              <Cell style={{ padding: '6px 6px' }}>
                {rowData => (
                  <NumInputForTable
                    placeholder='0'
                    value={rowData.coefficient}
                    onChange={value =>
                      updateRollField(rowData.id, 'coefficient', value)
                    }
                  />
                )}
              </Cell>
            </Column>

            <Column width={150}>
              <HeaderCell>Цена</HeaderCell>
              <Cell style={{ padding: '6px 6px' }}>
                {rowData => (
                  <NumInputForTable
                    placeholder='0'
                    value={rowData.cost_price}
                    onChange={value =>
                      updateRollField(rowData.id, 'cost_price', value)
                    }
                  />
                )}
              </Cell>
            </Column>

            <Column width={100}>
              <HeaderCell>Ед. изм.</HeaderCell>
              <Cell>
                {
                  rowData => materialUnits.find(unit => unit.value === rowData.unit)?.label
                }
              </Cell>
            </Column>
          </Table>
        </div>
      )}

      {rolls.length > 0 && (
        <div className='flex justify-center'>
          <Button width='200px' onClick={onSubmit}>
            Отправить
          </Button>
        </div>
      )}
    </div>
  );
};

export default InputRollMaterialsTable;
