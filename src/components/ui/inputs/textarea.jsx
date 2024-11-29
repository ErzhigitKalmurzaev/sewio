import React from 'react'
import { Input } from 'rsuite'

const Textarea = ({ label, placeholder, rows = 3, value, onChange, error, errorTitle }) => {
  return (
    <div>
        <label htmlFor="textarea" style={{ fontSize: '13px', fontFamily: 'Inter', fontWeight: '400', color: 'rgba(52, 64, 84, 1)'}}>
            {label}
        </label>
        <Input 
          name="textarea" 
          as="textarea" 
          rows={rows} 
          placeholder={placeholder} 
          value={value}
          onChange={onChange}
        />
        <p className='text-redd text-xs font-inter mt-1'>
          {error && (errorTitle ? errorTitle : '(Заполните поле правильно!)')}
      </p>
    </div>
  )
}

export default Textarea
