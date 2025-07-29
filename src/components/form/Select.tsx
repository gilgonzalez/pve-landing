import { useFormContext, Controller } from 'react-hook-form'
import './Select.css'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  name: string
  placeholder?: string
  options: SelectOption[]
  className?: string
  rules?: any
  [key: string]: any
}

const Select = ({ 
  name,
  placeholder = 'Selecciona una opción',
  options,
  className = 'select',
  rules,
  ...props
}: SelectProps) => {
  const { control } = useFormContext()
  
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div>
          <select
            {...field}
            {...props}
            className={`${className} ${fieldState.error ? 'error' : ''}`}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldState.error && (
            <span className="error-message">
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  )
}

export default Select