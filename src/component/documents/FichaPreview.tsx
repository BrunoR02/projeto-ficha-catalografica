'use client'
import { IFicha } from '@/interface/Interfaces';
import styles from "./FichaPreview.module.scss"

// Create Document Component
export default function FichaPreview({ ficha }: { ficha: IFicha }) {

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <p className={styles.text5}>{ficha.linhaCutter}</p>
      </section>
      <section className={styles.section}>
        <p className={styles.text}>{ficha.linha1}</p>
        <p className={styles.text2}>{ficha.linha2}</p>
        <p className={styles.text3}>{ficha.linha3}</p>
        {ficha.linhaNota1 && <p className={styles.text2}>{ficha.linhaNota1}</p>}
        {ficha.linhaNota2 && <p className={styles.text2}>{ficha.linhaNota2}</p>}
        <p className={styles.text3}>{ficha.linha4}</p>
        <p className={styles.text3}>{ficha.linha5}</p>
        {ficha.linhaCDU && <p className={styles.text4}>{ficha.linhaCDU}</p>}
        {ficha.linhaCDD && <p className={styles.text4}>{ficha.linhaCDD}</p>}
      </section>
    </div>
  )
}