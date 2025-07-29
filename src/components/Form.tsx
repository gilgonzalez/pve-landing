import React from 'react'
import FormRenderer, { type FieldConfig } from './FormRenderer'

interface FormData {
  name: string
  surname: string
  email: string
  phone: string
  country: string
  province: string
  typeInstallation: string
  floorNumber: string
  model: string
  message: string
  terms: boolean
}

interface FormProps {
  schema: FieldConfig[]
  acceptConditions: boolean
}

const Form: React.FC<FormProps> = ({ schema, acceptConditions = false }) => {
  const onSubmit = (data: FormData) => {
    console.log('Form data:', data)
  }

  return (
    <FormRenderer
      schema={schema}
      acceptConditions={acceptConditions}
      onSubmit={onSubmit}
      title="SOLICITA PRESUPUESTO"
      submitButtonText="Enviar"
      mode="onBlur"
    />
  )
}

export default Form
export type { FormData }