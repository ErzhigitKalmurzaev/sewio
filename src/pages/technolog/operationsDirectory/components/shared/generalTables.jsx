import React from 'react'
import FolderTable from '../tables/FolderTable'
import CombinationTable from '../tables/combinationTable'


const GeneralTables = ({ urls }) => {
  return (
    <div className='min-h-[480px] font-inter bg-white rounded-xl'>
        {
            urls?.activePage === 'folder' && <FolderTable/>
        }
        {
            urls?.activePage === 'combination' && <CombinationTable/>
        }
    </div>
  )
}

export default GeneralTables
