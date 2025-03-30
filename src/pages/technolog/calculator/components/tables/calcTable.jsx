import React from 'react'
import { Panel, PanelGroup, Placeholder, Table } from 'rsuite';

import OperationsTable from './operationsTable';
import ConsumablesTable from './consumablesTable';
import OtherExpensesTable from './otherExpensesTable';
import CombinationsTable from './combinationsTable';

const CalcTable = ({ type }) => {

 return (
  <div>
    <PanelGroup accordion bordered>
      <Panel header="Комбинации" defaultExpanded>
        <CombinationsTable type={type}/>
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

export default CalcTable
