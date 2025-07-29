import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import './CheckBox.css'

interface CheckBoxProps {
  name: string
  label: React.ReactNode
  className?: string
  rules?: any
  [key: string]: any
}

const CheckBox = ({ 
  name,
  label, 
  className = 'text-primary radio-label',
  rules,
  ...props
}: CheckBoxProps) => {
  const { control } = useFormContext()
  
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div>
          <label className={className}>
            <input 
              {...field}
              {...props}
              type="checkbox" 
              className="checkbox"
              checked={field.value || false}
            />
            <span>{label}</span>
          </label>
          {fieldState.error && (
            <span className="text-red-500 text-sm mt-1 block">
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  )
}

export default CheckBox