"use client"
import { useState } from "react";
import FichaForm from "./forms/FichaForm";
import FichaUniversitariaForm from "./forms/FichaUniversitariaForm";
import FichaPreview from "./documents/FichaPreview";
import { IFicha } from "@/interface/Interfaces";
import styles from "./FichaComp.module.scss"

export default function FichaComp() {
  let [formValue, setFormValue] = useState<IFicha | null>(null)
  let [tipoFicha, setTipoFicha] = useState<TFichaType>("livro")

  const tipoFichaOptions = [
    { value: "livro", label: "Livro" },
    { value: "universitario", label: "Trabalho universitário" },
  ]

  return (
    <div className="flex justify-center select-none">
      {formValue &&
        <div className={styles.preview}>
          <FichaPreview ficha={formValue}></FichaPreview>
        </div>}
      <div className={styles["ficha-select-container"]}>
        <h5 className={styles['ficha-select-label']}>Tipo: </h5>
        <select
          onChange={(e) => {
            setTipoFicha(e.target.value as TFichaType);
          }}
          name={"tipoFicha"}
          id={"tipoFicha"}
          value={tipoFicha}
          className={styles['ficha-select-field']}>
          {tipoFichaOptions.map((option, index) => {
            return <option key={index} value={option.value}>{option.label}</option>
          })}
        </select>
      </div>
      {tipoFicha == 'livro' && <FichaForm setFormPreview={(form) => setFormValue(form)} />}
      {tipoFicha == 'universitario' && <FichaUniversitariaForm setFormPreview={(form) => setFormValue(form)} />}
    </div>
  )
}

type TFichaType = "livro" | "universitario"