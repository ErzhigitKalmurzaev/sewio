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
      <Panel header="Материалы" defaultExpanded>
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
