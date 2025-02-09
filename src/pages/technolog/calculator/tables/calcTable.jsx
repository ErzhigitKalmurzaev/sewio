import React, { useState } from 'react'
import { CircleMinus, Plus } from "lucide-react";
import NumInputForTable from "../../../../components/ui/inputs/numInputForTable";
import TextInputForTable from "../../../../components/ui/inputs/textInputForTable";
import { Panel, PanelGroup, Placeholder, Table } from 'rsuite';

import { formatNumber } from "../../../../utils/functions/numFuncs";
import OperationsTable from './operationsTable';
import ConsumablesTable from './consumablesTable';
import OtherExpensesTable from './otherExpensesTable';

const { Cell, Column, HeaderCell } = Table;

const initialData = [
  {
    title: "Операции",
    id: "operations",
    children: [
      { id: "cutting", title: "Крой", price: "", parentId: "operations" },
      { id: "ironing", title: "Утюг", price: "", parentId: "operations" },
      { id: "packing", title: "Чистка, упаковка", price: "", parentId: "operations" },
    ],
  },
  {
    title: "Комбинации",
    id: "combinations",
    children: [
      { id: "sewing", title: "Пошив", price: "", parentId: "combinations" },
    ],
  },
  {
    title: "Материалы",
    id: "materials",
    children: [
      { id: "fabric", title: "Материал", price: "", parentId: "materials" },
      { id: "accessories", title: "Фурнитура", price: "", parentId: "materials" },
      { id: "cuff", title: "Манжет", price: "", parentId: "materials" },
      { id: "buttonhole", title: "Петля пуговица", price: "", parentId: "materials" },
    ],
  },
  {
    title: "Прочие",
    id: "misc",
    children: [
      { id: "technologist", title: "Технолог, ОТК", price: "", parentId: "misc" },
      { id: "other", title: "Прочие", price: "", parentId: "misc" },
      { id: "buyer", title: "Услуги байера", price: "", parentId: "misc" },
      { id: "service", title: "Услуги М", price: "", parentId: "misc" },
    ],
  },
];

const CalcTable = ({ clientData}) => {

 return (
  <div>
    <PanelGroup accordion bordered>
      <Panel header="Операции" defaultExpanded>
        <OperationsTable/>
      </Panel>
      <Panel header="Материалы" defaultExpanded>
        <ConsumablesTable/>
      </Panel>
      <Panel header="Прочие" defaultExpanded>
        <OtherExpensesTable/>
      </Panel>
    </PanelGroup>
  </div>
 )
}

export default CalcTable
