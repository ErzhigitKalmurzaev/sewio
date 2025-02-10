// import React, { useState } from 'react'
// import { CircleMinus, Plus } from "lucide-react";
// import NumInputForTable from "../../../../components/ui/inputs/numInputForTable";
// import TextInputForTable from "../../../../components/ui/inputs/textInputForTable";
// import { Table } from 'rsuite';

// import { formatNumber } from "../../../../utils/functions/numFuncs";

// const { Cell, Column, HeaderCell } = Table;

// const initialData = [
//   {
//     title: "Операции",
//     id: "operations",
//     children: [
//       { id: "cutting", title: "Крой", price: "", parentId: "operations" },
//       { id: "ironing", title: "Утюг", price: "", parentId: "operations" },
//       { id: "packing", title: "Чистка, упаковка", price: "", parentId: "operations" },
//     ],
//   },
//   {
//     title: "Комбинации",
//     id: "combinations",
//     children: [
//       { id: "sewing", title: "Пошив", price: "", parentId: "combinations" },
//     ],
//   },
//   {
//     title: "Материалы",
//     id: "materials",
//     children: [
//       { id: "fabric", title: "Материал", price: "", parentId: "materials" },
//       { id: "accessories", title: "Фурнитура", price: "", parentId: "materials" },
//       { id: "cuff", title: "Манжет", price: "", parentId: "materials" },
//       { id: "buttonhole", title: "Петля пуговица", price: "", parentId: "materials" },
//     ],
//   },
//   {
//     title: "Прочие",
//     id: "misc",
//     children: [
//       { id: "technologist", title: "Технолог, ОТК", price: "", parentId: "misc" },
//       { id: "other", title: "Прочие", price: "", parentId: "misc" },
//       { id: "buyer", title: "Услуги байера", price: "", parentId: "misc" },
//       { id: "service", title: "Услуги М", price: "", parentId: "misc" },
//     ],
//   },
// ];

// const CalcTable = ({ clientData}) => {

//   const [costs, setCosts] = useState([...initialData]);
  
//   const getValue = (value, name, rowData, parentId) => {
    
//     const new_costs = costs.map((category) => {
//       if (category.id === parentId) {
//         return {
//           ...category,
//           children: category.children.map((child) =>
//             child.id === rowData.id ? { ...child, [name]: value } : child
//           ),
//         };
//       }
//       return category;
//     });
//     setCosts(new_costs);
//   };

//   const addRow = (parentId) => {
//     const new_costs = costs.map((category) => {
//       if (category.id === parentId) {
//         return {
//           ...category,
//           children: [
//             ...category.children,
//             { id: Date.now().toString(), title: "", price: "", parentId: parentId }
//           ],
//         };
//       }
//       return category;
//     });
//     setCosts(new_costs);
//   };

//   const deleteRow = (parentId, rowId) => {
//     const new_costs = costs.map((category) => {
//       if (category.id === parentId) {
//         return {
//           ...category,
//           children: category.children.filter((child) => child.id !== rowId),
//         };
//       }
//       return category;
//     });
//     setCosts(new_costs);
//   };

//   const getTotal = (type) => {
//     switch (type) {
//       case "payment":
//         return formatNumber(clientData?.amount * clientData?.price);
//       case "expenditure":
//         return formatNumber(
//           costs.reduce(
//             (sum, category) =>
//               sum +
//               category.children.reduce(
//                 (subSum, cost) => subSum + Number(clientData.amount) * Number(cost.price || 0),
//                 0
//               ),
//             0
//           )
//         );
//       case "expenditure_one":
//         return formatNumber(
//           costs.reduce(
//             (sum, category) =>
//               sum + category.children.reduce((subSum, cost) => subSum + Number(cost.price || 0), 0),
//             0
//           )
//         );
//       case "income":
//         return formatNumber(
//           clientData?.amount * clientData?.price -
//           costs.reduce(
//             (sum, category) =>
//               sum +
//               category.children.reduce(
//                 (subSum, cost) => subSum + Number(clientData.amount) * Number(cost.price || 0),
//                 0
//               ),
//             0
//           )
//         );
//       default:
//         return 0;
//     }
//   };

//   return (
//     <div className="flex gap-x-5">
//       <div className="flex flex-col gap-y-4 w-3/4 h-auto overflow-y-auto">
//         <Table 
//           data={costs} 
//           isTree 
//           autoHeight 
//           rowKey="id" 
//           bordered 
//           cellBordered
//           defaultExpandedRowKeys={costs.map(category => category.id)}>
//           <Column width={250}>
//             <HeaderCell>Название</HeaderCell>
//             <Cell style={{ padding: '7px 6px'}}>
//               {(rowData) =>
//                 rowData.children ? (
//                   <span className="mt-2">{rowData.title}</span>
//                 ) : (
//                   <TextInputForTable
//                       value={rowData.title}
//                       placeholder="Название"
//                       onChange={(e) => getValue(e.target.value, "title", rowData, rowData.parentId)}
//                   />
//                 )
//               }
//             </Cell>
//           </Column>
//           <Column width={200}>
//             <HeaderCell>Цена</HeaderCell>
//             <Cell style={{ padding: '7px 6px'}}>
//               {(rowData, rowIndex) =>
//                 rowData.children ? null : (
//                   <NumInputForTable
//                     value={rowData.price}
//                     placeholder="0"
//                     onChange={(e) => getValue(e, "price", rowData, rowData.parentId)}
//                   />
//                 )
//               }
//             </Cell>
//           </Column>
//           <Column width={200}>
//             <HeaderCell>Итог расход</HeaderCell>
//             <Cell>
//               {(rowData) =>
//                 rowData.children ? null : (
//                   <p>{formatNumber(Number(rowData.price || 0) * Number(clientData.amount || 0))}</p>
//                 )
//               }
//             </Cell>
//           </Column>
//           <Column width={100} align="center">
//             <HeaderCell>Действия</HeaderCell>
//             <Cell>
//               {(rowData) =>
//                 rowData.children ? (
//                   <button onClick={() => addRow(rowData.id)} className="cursor-pointer">
//                     <Plus color="green" />
//                   </button>
//                 ) : (
//                   <button onClick={() => deleteRow(rowData.parentId, rowData.id)} className="cursor-pointer">
//                     <CircleMinus color="red" />
//                   </button>
//                 )
//               }
//             </Cell>
//           </Column>
//         </Table>
//       </div>
//       <div className="w-1/4 flex flex-col gap-y-10">
//           <div className="flex flex-col gap-y-4">
//               <p className="font-inter text-base font-semibold">
//               Оплата клиента:{" "}
//               <span className="ml-2 text-sprimary">{getTotal("payment")}</span>
//               </p>
//               <p className="font-inter text-base font-semibold">
//               Расход на один товар:{" "}
//               <span className="ml-2 text-sprimary">{getTotal("expenditure_one")}</span>
//               </p>
//               <p className="font-inter text-base font-semibold">
//               Общий расход:{" "}
//               <span className="ml-2 text-redd">{getTotal("expenditure")}</span>
//               </p>
//               <p className="font-inter text-base font-semibold">
//               Прибыль:{" "}
//               <span className="ml-2 text-emerald-600">{getTotal("income")}</span>
//               </p>
//           </div>
//       </div>
//     </div>
//   )
// }

// export default CalcTable
