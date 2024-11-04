import { ChangeEventHandler, ClipboardEventHandler, KeyboardEventHandler } from "react"
import styles from "./MultiItemFormField.module.scss"
import FormField from "./FormField"
import { Tooltip } from "react-tooltip"

interface PropsType {
  title: string
  name: string
  value: string | number
  placeholder?: string
  required?: boolean
  items: string[]
  errorMessage?: string
  highlightPrincipal?: boolean
  onKeyDownHandler?: KeyboardEventHandler<HTMLInputElement>
  onChangeHandler: ChangeEventHandler<HTMLInputElement>
  onPasteHandler?: ClipboardEventHandler<HTMLInputElement>
  onAddItemHandler: () => void
  onRemoveItemHandler: (index: number) => void
}

export default function MultiItemFormField({ title, name, value, required = false, highlightPrincipal = false, errorMessage, placeholder, items, onKeyDownHandler, onChangeHandler, onPasteHandler, onAddItemHandler, onRemoveItemHandler }: PropsType) {

  return (
    <>
      <div className={styles.field}>
        <FormField
          title={title}
          name={name}
          required={required}
          value={value}
          placeholder={placeholder}
          errorMessage={errorMessage}
          onKeyDownHandler={onKeyDownHandler}
          onPasteHandler={onPasteHandler}
          onChangeHandler={onChangeHandler} />
        <span id={`add-${name}`} onClick={onAddItemHandler}
          className={styles.add}>+</span>
      </div>
      <Tooltip anchorSelect={`#add-${name}`} place="top">Adicionar novo</Tooltip>

      <ul className={styles.list}>
        {items.length > 0 && items.map((value, index) => {
          return (<li key={index} className={styles.item}>
            {value}
            {highlightPrincipal && index == 0 && <span className={styles['item-tag']}>Principal</span>}
            <span id={`remove-${name}-${index}`} onClick={() => onRemoveItemHandler(index)}
              className={styles['item-close']}>X</span>
            <Tooltip anchorSelect={`#remove-${name}-${index}`} place="top">Remover</Tooltip>
          </li>)
        })}
      </ul>
    </>
  )
}