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
  
  // Generar clases CSS específicas según el tipo
  const getInputClasses = (baseClass: string, hasError: boolean, inputType: string) => {
    const typeClass = inputType === 'email' ? 'input-email' : 'input-text'
    const errorClass = hasError ? 'error' : ''
    return `${baseClass} ${typeClass} ${errorClass}`.trim()
  }
  
  // Validaciones específicas según el tipo
  const getValidationRules = (inputType: string, customRules?: any) => {
    const baseRules = customRules || {}
    
    if (inputType === 'email') {
      return {
        ...baseRules,
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Ingresa un email válido'
        }
      }
    }
    
    return baseRules
  }
  
  return (
    <Controller
      name={name}
      control={control}
      rules={getValidationRules(type, rules)}
      render={({ field, fieldState }) => (
        <div className="input-container">
          {/* Indicador @ posicionado ANTES del input para mejor control */}
          {type === 'email' && (
            <span className="input-type-indicator">@</span>
          )}
          <input
            {...field}
            {...props}
            type={type}
            className={getInputClasses(className, !!fieldState.error, type)}
            placeholder={placeholder}
            autoComplete={type === 'email' ? 'email' : 'off'}
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