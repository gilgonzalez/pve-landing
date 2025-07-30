import React from 'react'
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form'
import InputText from './form/InputText'
import Select from './form/Select'
import TextArea from './form/TextArea'
import RadioInput from './form/RadioInput'
import CheckBox from './form/CheckBox'

// Tipos base para las opciones
interface SelectOption {
  value: string
  label: string
}

interface RadioOption {
  value: string
  label: string
  className?: string
}

// Tipos para cada tipo de campo
interface BaseFieldConfig {
  name: string
  rules?: any
  className?: string
  gridColumn?: string // Para control de grid CSS
}

interface InputTextConfig extends BaseFieldConfig {
  type: 'text' | 'email'
  placeholder: string
  defaultValue?: string
  // Eliminamos inputType ya que ahora type maneja directamente el tipo de input
}

interface SelectConfig extends BaseFieldConfig {
  type: 'select'
  placeholder?: string
  options: SelectOption[]
  defaultValue?: string
}

interface TextAreaConfig extends BaseFieldConfig {
  type: 'textarea'
  placeholder: string
  rows?: number
  defaultValue?: string
  label?: string // Agregar soporte para label
}

interface RadioConfig extends BaseFieldConfig {
  type: 'radio'
  label: string
  options: RadioOption[]
  defaultValue?: string
}

interface CheckBoxConfig extends BaseFieldConfig {
  type: 'checkbox'
  label: React.ReactNode
  defaultValue?: boolean
}
// Agregar la interfaz para campos hidden después de CheckBoxConfig
interface HiddenConfig extends BaseFieldConfig {
  type: 'hidden'
  value: any // Valor fijo e inmutable
}

// Actualizar el tipo FieldConfig para incluir HiddenConfig
type FieldConfig = 
  | InputTextConfig 
  | SelectConfig 
  | TextAreaConfig 
  | RadioConfig 
  | CheckBoxConfig
  | HiddenConfig

// Props del FormRenderer
interface FormRendererProps {
  schema: FieldConfig[]
  onSubmit: SubmitHandler<any>
  submitButtonText?: string
  submitButtonClassName?: string
  formClassName?: string
  gridClassName?: string
  title?: string
  titleClassName?: string
  defaultValues?: Record<string, any>
  acceptConditions?: boolean
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all'
}

const FormRenderer: React.FC<FormRendererProps> = ({
  schema,
  onSubmit,
  submitButtonText = 'Enviar',
  submitButtonClassName = 'btn-submit-secondary',
  formClassName = 'form-container',
  gridClassName = 'form-grid',
  title,
  titleClassName = 'form-title',
  defaultValues = {},
  mode = 'onBlur',
  acceptConditions = false
}) => {
  // Generar valores por defecto a partir de la configuración de campos
  const generateDefaultValues = () => {
    const defaults: Record<string, any> = { ...defaultValues }
    
    schema.forEach(field => {
      if (field.type === 'hidden') {
        // Para campos hidden, siempre usar el valor definido
        defaults[field.name] = (field as HiddenConfig).value
      } else if (field.defaultValue !== undefined && !defaults[field.name]) {
        defaults[field.name] = field.defaultValue
      }
    })
    
    return defaults
  }

  const methods = useForm({
    defaultValues: generateDefaultValues(),
    mode
  })

  const { handleSubmit } = methods

  // Objeto que mapea tipos de campo a sus componentes correspondientes
  const fieldComponents = {
    text: (field: InputTextConfig, commonProps: any) => (
      <InputText
        {...commonProps}
        placeholder={field.placeholder}
        type="text"
      />
    ),
    email: (field: InputTextConfig, commonProps: any) => (
      <InputText
        {...commonProps}
        placeholder={field.placeholder}
        type="email"
      />
    ),
    select: (field: SelectConfig, commonProps: any) => (
      <Select
        {...commonProps}
        placeholder={field.placeholder}
        options={field.options}
      />
    ),
    textarea: (field: TextAreaConfig, commonProps: any) => (
      <TextArea
        {...commonProps}
        placeholder={field.placeholder}
        rows={field.rows}
        label={field.label}
      />
    ),
    radio: (field: RadioConfig, commonProps: any) => (
      <RadioInput
        {...commonProps}
        label={field.label}
        options={field.options}
      />
    ),
    checkbox: (field: CheckBoxConfig, commonProps: any) => (
      <CheckBox
        {...commonProps}
        label={field.label}
      />
    ),
    hidden: (field: HiddenConfig, commonProps: any) => (
      <input
        {...commonProps}
        type="hidden"
        value={field.value}
        readOnly
      />
    )
  }

  // Función para renderizar cada campo según su tipo
  const renderField = (field: FieldConfig, index: number) => {
    const key = `${field.name}-${index}`
    
    // Forzar que los textareas siempre ocupen toda la fila
    const gridColumnStyle = field.type === 'textarea' 
      ? { gridColumn: '1 / -1' } 
      : field.gridColumn 
        ? { gridColumn: field.gridColumn } 
        : undefined
    
    const commonProps = {
      name: field.name,
      rules: field.rules,
      className: field.className,
      style: gridColumnStyle
    }
  
    const componentRenderer = fieldComponents[field.type]
    
    if (componentRenderer) {
      return React.cloneElement(
        componentRenderer(field as any, commonProps),
        { key }
      )
    }
    
    console.warn(`Tipo de campo no reconocido: ${field.type}`)
    return null
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={formClassName}>
        {title && (
          <h2 className={titleClassName}>{title}</h2>
        )}
        
        {/* Campos del grid (todos excepto textareas) */}
        <div className={gridClassName}>
          {schema
            .filter(field => field.type !== 'textarea')
            .map((field, index) => renderField(field, index))}
        </div>
        
        {/* Textareas fuera del grid */}
        {schema
          .filter(field => field.type === 'textarea')
          .map((field, index) => (
            <div key={`textarea-${field.name}-${index}`} className="mt-6">
              {renderField(field, index)}
            </div>
          ))}
        
        <div className='flex flex-col justify-start mt-12'>
          {acceptConditions && 
            <CheckBox
              name="acceptConditions"
              label={
                <span>
                  He leído y acepto{' '}
                  <a href="/legal_notice" className="underline">Aviso legal</a>{' '}
                  y{' '}
                  <a href="/privacy_policy" className="underline">Política de privacidad</a>
                </span>
              }
              rules={{ required: 'Debe aceptar los términos y condiciones' }}
            />
          }
          <button 
            type="submit" 
            className={submitButtonClassName}
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </FormProvider>
  )
}

export default FormRenderer

// Exportar tipos para uso externo
export type {
  FieldConfig,
  InputTextConfig,
  SelectConfig,
  TextAreaConfig,
  RadioConfig,
  CheckBoxConfig,
  HiddenConfig,
  SelectOption,
  RadioOption,
  FormRendererProps
}