import { ChangeEventHandler } from "react"
import styles from "./FormField.module.scss"
import { Tooltip } from "react-tooltip"

interface PropsType {
  title?: string
  name: string
  value: string | number
  options: { value: string, label: string }[]
  initialValue: { value: string, label: string }
  required?: boolean
  errorMessage?: string
  selectClass?: string
  onChangeHandler: ChangeEventHandler<HTMLSelectElement>
}

export default function SelectFormField({ title, name, value, initialValue, options, required = false, selectClass, errorMessage, onChangeHandler }: PropsType) {


  return (
    <section className={styles.container}>
      {title && <label className={styles.label} htmlFor={name}>
        {title}
        {required && <span className={styles.required}> *</span>}
      </label>}
      <select
        onChange={onChangeHandler}
        name={name}
        id={name}
        value={value}
        className={`${styles.input} ${selectClass} ${errorMessage ? styles['input-error'] : ''}`}>
        {[initialValue, ...options].map((option, index) => {
          return <option key={index} value={option.value}>{option.label}</option>
        })}
      </select>

      {errorMessage && <Tooltip className={styles['error-tooltip']} anchorSelect={`#${name}`} place="bottom">
        <span className={styles['error-message']}>{errorMessage}</span>
      </Tooltip>}
    </section>
  )
}