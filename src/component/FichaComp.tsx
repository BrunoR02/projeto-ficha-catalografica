"use client"
import { useState } from "react";
import FichaForm from "./forms/FichaForm";
import FichaPreview from "./documents/FichaPreview";
import { IFicha } from "@/interface/Interfaces";
import styles from "./FichaComp.module.scss"

export default function FichaComp() {
  let [formValue, setFormValue] = useState<IFicha | null>(null)

  return (
    <div className="flex justify-center select-none">
      {formValue &&
        <div className={styles.preview}>
          <FichaPreview ficha={formValue}></FichaPreview>
        </div>}
      <FichaForm setFormPreview={(form) => setFormValue(form)} />
    </div>
  )
}