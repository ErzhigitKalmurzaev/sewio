import React from 'react'
import FolderTable from '../tables/FolderTable'
import CombinationTable from '../tables/combinationTable'
import OperationTable from '../tables/operationTable'


const GeneralTables = ({ urls, params, setParams }) => {
  return (
    <div className='min-h-[500px] font-inter bg-white rounded-lg'>
        {
            urls?.activePage === 'folder' && <FolderTable urls={urls} params={params} setParams={setParams}/>
        }
        {
            urls?.activePage === 'combination' && <CombinationTable urls={urls}/>
        }
        {
            urls?.activePage === 'operation' && <OperationTable urls={urls}/>
        }
    </div>
  )
}

export default GeneralTables
