import React from 'react'
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form'

interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  children: (field: any) => React.ReactNode
  rules?: any
}

const FormField = <T extends FieldValues>({
  name,
  control,
  children,
  rules
}: FormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className="form-field">
          {children({ ...field, error: fieldState.error })}
        </div>
      )}
    />
  )
}

export default FormField