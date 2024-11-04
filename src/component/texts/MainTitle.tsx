import styles from "./MainTitle.module.scss"

export default function MainTitle({ text }: { text: string }) {
  return (
    <h2 className={styles.title}>
      {text}
    </h2>
  )
}