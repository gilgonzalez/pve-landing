import { useFormContext, Controller } from 'react-hook-form'
import './TextArea.css'

interface TextAreaProps {
  name: string
  placeholder: string
  className?: string
  rows?: number
  rules?: any
  label?: string // Agregar label
  [key: string]: any
}

const TextArea = ({ 
  name,
  placeholder, 
  className = 'textarea', 
  rows = 4,
  rules,
  label,
  ...props
}: TextAreaProps) => {
  const { control } = useFormContext()
  
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div>
          {label && (
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
              {label}
            </label>
          )}
          <textarea
            {...field}
            {...props}
            id={name}
            className={`${className} ${fieldState.error ? 'error' : ''}`}
            placeholder={placeholder}
            rows={rows}
          />
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

export default TextArea