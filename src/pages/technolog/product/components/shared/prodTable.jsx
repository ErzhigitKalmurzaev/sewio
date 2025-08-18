import React from 'react'
import { Panel, PanelGroup } from 'rsuite';
import OtherExpensesTable from '../tables/otherExpensesTable';
import CombinationsTable from '../tables/combinationTable';
import ConsumablesTable from '../tables/consumablesTable';


const ProdTable = ({ type }) => {

 return (
  <div>
    <PanelGroup accordion bordered>
      <Panel header='Комбинации' defaultExpanded>
        <CombinationsTable/>
      </Panel>
      <Panel header={
        <div className='flex items-center gap-x-5'>
          <b>Материалы</b>
          <p className='text-sm font-inter font-medium text-amber-500'>«Если на складе сырьё указано без цвета, оно будет списываться универсально — для всех цветов заказа.<br/> Если на складе у сырья указан конкретный цвет, списание будет происходить именно по цвету, выбранному в заказе.»</p>
        </div>
      } defaultExpanded>
        <ConsumablesTable type={type}/>
      </Panel>
      <Panel header="Прочие" defaultExpanded>
        <OtherExpensesTable type={type}/>
      </Panel>
    </PanelGroup>
  </div>
 )
}

export default ProdTable
