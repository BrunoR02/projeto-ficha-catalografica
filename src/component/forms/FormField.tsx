import { ChangeEventHandler, ClipboardEventHandler, KeyboardEventHandler } from "react"
import styles from "./FormField.module.scss"
import { Tooltip } from "react-tooltip"

interface PropsType {
  title?: string
  name: string
  value: string | number
  placeholder?: string
  required?: boolean
  /**
   * Medida de input. Ex.: cm, px.
   */
  inputMeasure?: string
  errorMessage?: string
  onKeyDownHandler?: KeyboardEventHandler<HTMLInputElement>
  onChangeHandler: ChangeEventHandler<HTMLInputElement>
  onPasteHandler?: ClipboardEventHandler<HTMLInputElement>
}

export default function FormField({ title, name, value, required = false, inputMeasure, errorMessage, placeholder, onKeyDownHandler, onChangeHandler, onPasteHandler }: PropsType) {

  return (
    <section className={styles.container}>
      {title && <label className={styles.label} htmlFor={name}>
        {title}
        {required && <span className={styles.required}> *</span>}
      </label>}
      <input
        onChange={onChangeHandler}
        onPaste={onPasteHandler}
        onKeyDown={onKeyDownHandler}
        value={value}
        name={name}
        id={name}
        placeholder={placeholder}
        className={`${styles.input} ${errorMessage ? styles['input-error'] : ''}`} />
      {inputMeasure && <span className={styles.measure}>{inputMeasure}</span>}

      {errorMessage && <Tooltip className={styles['error-tooltip']} anchorSelect={`#${name}`} place="bottom">
        <span className={styles['error-message']}>{errorMessage}</span>
      </Tooltip>}
    </section>
  )
}