import React from 'react'
import { Input } from 'rsuite'

const Textarea = ({ label, placeholder, rows = 3, value, onChange }) => {
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
    </div>
  )
}

export default Textarea
