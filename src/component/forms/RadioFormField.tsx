import { ChangeEventHandler } from "react"
import styles from "./RadioFormField.module.scss"
import stylesFormField from "./FormField.module.scss"
import { IRadioInputOption } from "@/interface/Interfaces"

interface PropsType {
  title: string
  name: string
  value: string
  options: IRadioInputOption[]
  onChangeHandler: ChangeEventHandler<HTMLInputElement>
}

export default function RadioFormField({ title, name, value, options, onChangeHandler }: PropsType) {

  return (
    <div className={stylesFormField.container}>
      <h4 className={stylesFormField.label}>{title}</h4>
      <section className={styles.options}>
        {options && options.map(option => {
          return <div key={option.value} className={styles.field}>
            <input
              onChange={onChangeHandler}
              value={option.value}
              checked={option.value == value}
              name={name}
              id={`${name}-${option.value}`}
              className={styles['field-input']} type="radio" />
            <label htmlFor={`${name}-${option.value}`} className={stylesFormField.label}>{option.label}</label>
          </div>
        })}
      </section>
    </div>
  )
}