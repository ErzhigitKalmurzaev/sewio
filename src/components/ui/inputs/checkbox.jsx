import React from 'react'

const Checkbox = ({ isChecked, handleCheckboxChange, label }) => {
  return (
    <div className='flex items-center gap-x-2'>
        <div className="relative flex items-center justify-center w-6 h-6">
            <input
                type="checkbox"
                id="checkbox"
                className="hidden"
                checked={isChecked}
                onChange={handleCheckboxChange}
            />
            <label
                htmlFor="checkbox"
                className="flex items-center justify-center w-6 h-6 rounded-lg border-2 border-blue-100 bg-white cursor-pointer transition-colors"
            >
                <span
                className={`w-3 h-3 bg-[#2F4F4F] rounded-full transition-opacity ${
                    isChecked ? "opacity-100" : "opacity-30"
                }`}
                ></span>
            </label>
        </div>
        <p className='font-inter text-sm font-semibold'>{label}</p>
    </div>
  )
}

export default Checkbox
