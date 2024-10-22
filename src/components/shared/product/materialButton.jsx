import React from 'react'

const MaterialButton = ({ material, selected, setValue }) => {

  const select_material = () => {
    setValue(material)
  }

  return (
    <div 
        key={material.id} 
        className={`w-full h-[42px] ${selected.id === material.id ? 'bg-primary' : ''} p-2 cursor-pointer flex flex-row justify-between items-center gap-x-3 border border-borderGray rounded-md transition-all ease-linear duration-300`}
        onClick={select_material}
    >
        <p className={`text-sm font-medium font-inter ${selected.id === material.id ? 'text-white' : 'text-fprimary'}`}>
            {material.article}
            <span className='ml-3'>{material.name}</span>
        </p>
    </div>
  )
}

export default MaterialButton
