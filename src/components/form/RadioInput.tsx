import { useFormContext, Controller } from 'react-hook-form'
import './RadioInput.css'

interface RadioOption {
  value: string
  label: string
  className?: string
}

interface RadioInputProps {
  name: string
  label: string
  options: RadioOption[]
  rules?: any
  [key: string]: any
}

const RadioInput = ({ 
  name,
  label, 
  options,
  rules,
  ...props
}: RadioInputProps) => {
  const { control } = useFormContext()
  
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className="radio-input-container">
          <p className="radio-input-label">
            {label} <span className="text-red-500">*</span>
          </p>
          {options.map((option, index) => (
            <label key={index} className={`radio-label ${option.className || ''}`}>
              <input
                {...field}
                {...props}
                className="radio-input"
                type="radio"
                value={option.value}
                checked={field.value === option.value}
              />
              {option.label}
            </label>
          ))}
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

export default RadioInput