import { useFormContext, Controller } from 'react-hook-form'
import './InputText.css'

interface InputTextProps {
  name: string
  placeholder: string
  type?: 'text' | 'email'
  className?: string
  rules?: any
  [key: string]: any
}

const InputText = ({ 
  name,
  placeholder, 
  type = 'text', 
  className = 'input', 
  rules,
  ...props 
}: InputTextProps) => {
  const { control } = useFormContext()
  
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div>
          <input
            {...field}
            {...props}
            type={type}
            className={`${className} ${fieldState.error ? 'error' : ''}`}
            placeholder={placeholder}
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

export default InputText