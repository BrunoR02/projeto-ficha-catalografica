"use client"
import { useState } from "react";
import FichaForm from "./forms/fichaForm";
import { Ficha } from "@/utils/Utils";
import FichaPreview from "./documents/fichaPreview";


export default function FichaComp(){
  let [formValue,setFormValue] = useState<Ficha|null>(null)

  return (
    <div className="flex justify-center select-none">
      {formValue &&
      <div className="animate-[fadeIn_1s_ease-in] fixed left-5 w-4/12 shadow-md shadow-white opacity-80 hover:opacity-100 hover:transition-all duration-300">
        <FichaPreview ficha={formValue}></FichaPreview>
      </div>}
      <FichaForm setFormPreview={(form)=>setFormValue(form)}/>
    </div>
  )
}