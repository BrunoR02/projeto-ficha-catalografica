import { MouseEventHandler } from "react"
import styles from "./MainButton.module.scss"

interface PropsType {
  title: string
  onClickHandler: MouseEventHandler<HTMLButtonElement>
}

export default function MainButton({ title, onClickHandler }: PropsType) {

  return (
    <button
      type="button"
      onClick={onClickHandler}
      className={styles.button}>
      {title}
    </button>
  )
}