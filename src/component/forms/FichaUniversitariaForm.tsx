'use client'
import { useEffect, useState } from "react"
import ReactPDF from "@react-pdf/renderer"
import FichaDocument from "../documents/FichaDocument"
import { ETipoTrabalhoUniversitario, IFicha, IFichaFormType, IFichaUniversityFormType } from "../../interface/Interfaces"
import StringUtils from "@/utils/StringUtils"
import Utils from "@/utils/Utils"
import FileService from "@/service/FileService"
import FichaService from "@/service/FichaService"
import styles from "./FichaForm.module.scss"
import stylesFormField from "./FormField.module.scss"
import FormField from "./FormField"
import InputUtils from "@/utils/InputUtils"
import MultiItemFormField from "./MultiItemFormField"
import RadioFormField from "./RadioFormField"
import MainButton from "../buttons/MainButton"
import SelectFormField from "./SelectFormField"

interface PropsType {
  setFormPreview: (form: IFicha) => void
}

export default function FichaForm({ setFormPreview }: PropsType) {
  const [respName, setRespName] = useState<string>("")
  const [pontoAssunto, setPontoAssunto] = useState<string>("")
  const [formInput, setFormInput] = useState<IFichaUniversityFormType>({
    responsabilidades: [],
    titulo: "",
    formato: "",
    subtitulo: "",
    orientador: "",
    tipoTrabalho: "" as ETipoTrabalhoUniversitario,
    universidade: "",
    departamento: "",
    curso: "",
    dataPub: "",
    local: "",
    numPag: 0,
    temIlustracao: false,
    temCor: false,
    issn: 0,
    assuntosSecundario: [],
    cdd: "",
    cdu: "",
    cutter: ""
  })
  const [formIsInvalid, setFormIsInvalid] = useState<Record<string, boolean>>({
    responsabilidades: false,
    titulo: false,
    formato: false,
    orientador: false,
    tipoTrabalho: false,
    universidade: false,
    departamento: false,
    curso: false,
    dataPub: false,
    local: false,
    nomeEditora: false,
    numPag: false,
    assuntosSecundario: false,
    cdd: false
  })

  const fileService = new FileService()
  const fichaService = new FichaService()

  function addRespName() {
    if (!StringUtils.isStringValid(respName) || formInput.responsabilidades.some(item => item == respName)) {
      return
    }
    formIsInvalid["responsabilidades"] = false
    setFormInput(obj => ({ ...obj, responsabilidades: [...obj['responsabilidades'], respName.trim()] }))
    setRespName("")
  }

  function addPontoAssunto() {
    if (!StringUtils.isStringValid(pontoAssunto) || formInput.assuntosSecundario.some(item => item == pontoAssunto)) {
      return
    }
    formIsInvalid["assuntosSecundario"] = false
    setFormInput(obj => ({ ...obj, assuntosSecundario: [...obj['assuntosSecundario'], pontoAssunto] }))
    setPontoAssunto("")
  }

  async function handleFormSubmit(e: any) {
    console.log("Submit:")

    // console.log(formInput)

    // exportToDocx(criaFichaCatalografica(formInput))
    // return
    // let pdfBuffer = await ReactPDF.renderToBuffer(<FichaDocument />);
    if (!validateForm())
      return

    console.log("Enviou")
    let pdfBuffer = await ReactPDF.pdf(<FichaDocument ficha={await fichaService.criaFichaCatalograficaUniversitaria(formInput)} />).toBlob()
    fileService.exportToPdf(pdfBuffer, Utils.formatText(formInput.titulo))
  }

  function validateForm() {
    //Resetar valores de invalido
    setFormIsInvalid(obj => {
      let objCopy = { ...obj }
      let keys = Object.keys(objCopy)
      for (let x = 0; x < keys.length; x++) {
        let key = keys[x];
        (objCopy as any)[key] = false
      }
      return objCopy
    })

    //Validação
    if (formInput.responsabilidades.length == 0) {
      setFormIsInvalid(obj => ({ ...obj, responsabilidades: true }))
      return false
    }

    if (!StringUtils.isStringValid(formInput.titulo)) {
      setFormIsInvalid(obj => ({ ...obj, titulo: true }))
      return false
    }

    if (!StringUtils.isStringValid(formInput.formato)) {
      setFormIsInvalid(obj => ({ ...obj, formato: true }))
      return false
    }

    if (!StringUtils.isStringValid(formInput.orientador)) {
      setFormIsInvalid(obj => ({ ...obj, orientador: true }))
      return false
    }

    if (!StringUtils.isStringValid(formInput.tipoTrabalho)) {
      setFormIsInvalid(obj => ({ ...obj, tipoTrabalho: true }))
      return false
    }

    if (!StringUtils.isStringValid(formInput.universidade)) {
      setFormIsInvalid(obj => ({ ...obj, universidade: true }))
      return false
    }

    if (!StringUtils.isStringValid(formInput.departamento)) {
      setFormIsInvalid(obj => ({ ...obj, departamento: true }))
      return false
    }

    if (!StringUtils.isStringValid(formInput.curso)) {
      setFormIsInvalid(obj => ({ ...obj, curso: true }))
      return false
    }

    if (formInput.dataPub.trim().length !== 4 || (+formInput.dataPub.trim() > new Date().getFullYear() + 1)) {
      setFormIsInvalid(obj => ({ ...obj, dataPub: true }))
      return false
    }

    if (!StringUtils.isStringValid(formInput.local)) {
      setFormIsInvalid(obj => ({ ...obj, local: true }))
      return false
    }

    if (formInput.numPag == 0) {
      setFormIsInvalid(obj => ({ ...obj, numPag: true }))
      return false
    }

    if (formInput.assuntosSecundario.length == 0) {
      setFormIsInvalid(obj => ({ ...obj, assuntosSecundario: true }))
      return false
    }

    //Fazer validacao com padrao CDD CDU se existir.
    if (!StringUtils.isStringValid(formInput.cdd) && !StringUtils.isStringValid(formInput.cdu)) {
      setFormIsInvalid(obj => ({ ...obj, cdd: true }))
      return false
    }

    return true
  }

  function scrollToElementByName(name: string) {
    let elems = document.getElementsByName(name)
    if (elems.length > 0) {
      elems[0].focus({ preventScroll: true })
      window.scrollTo({ behavior: "smooth", top: window.scrollY + elems[0].getBoundingClientRect().top - 100 })
    }
  }

  useEffect(() => {
    let keys = Object.keys(formIsInvalid)
    for (let x = 0; x < keys.length; x++) {
      let name = keys[x];
      if (formIsInvalid[name]) {
        scrollToElementByName(name)
        break
      }
    }
  }, [formIsInvalid])

  useEffect(() => {
    setFormPreview(fichaService.criaFichaCatalograficaUniversitaria(formInput, true))
  }, [formInput])

  useEffect(() => {
    if (formInput.responsabilidades.length > 0) {
      setFormInput(obj => ({ ...obj, cutter: fichaService.getCutter2(formInput.responsabilidades[0], formInput["titulo"]) }))
    } else if (formInput.cutter.length > 0 && formInput.responsabilidades.length == 0) {
      setFormInput(obj => ({ ...obj, cutter: "" }))
    }
  }, [formInput["responsabilidades"], formInput["titulo"]])

  // useEffect(() => {
  //   fetch('api/tabela-cutter?name="Date Jorgeo')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data?.cutter)
  //     })
  // }, [])

  return (
    <form className={styles.container}>
      <div className={styles['flex-full']}>
        {/* Responsabilidade */}
        <MultiItemFormField
          title="Responsabilidades (mín. 1)"
          name="responsabilidades"
          required
          items={formInput.responsabilidades}
          errorMessage={formIsInvalid.responsabilidades ? "Adicione pelo menos 1 responsabilidade" : undefined}
          value={respName}
          highlightPrincipal
          onAddItemHandler={addRespName}
          onRemoveItemHandler={(index: number) =>
            setFormInput(obj => ({ ...obj, responsabilidades: obj['responsabilidades'].filter((item, i) => i !== index) }))
          }
          onKeyDownHandler={(e) => { if (e.key == "Enter") addRespName(); return InputUtils.textFilter(e, "normal", 70) }}
          onPasteHandler={(e) => e.preventDefault()}
          onChangeHandler={(e) => setRespName(e.target.value)} />
      </div>

      <div className={styles['flex-7-12']}>
        {/* Titulo obra */}
        <FormField
          title="Título"
          name="titulo"
          required
          value={formInput.titulo}
          errorMessage={formIsInvalid.titulo ? "Insira um título válido" : ''}
          onKeyDownHandler={InputUtils.textFilter}
          onPasteHandler={(e) => e.preventDefault()}
          onChangeHandler={(e) => {
            setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value }));
            formIsInvalid[e.target.name] = false
          }} />
      </div>
      <div className={styles['flex-5-12']}>
        {/* Formato */}
        <SelectFormField
          title="Formato"
          name="formato"
          required
          value={formInput.formato}
          options={[
            { value: "e-book", label: "E-book" },
            { value: "manuscrito", label: "Manuscrito" },
            { value: "fisico", label: "Físico" }
          ]}
          initialValue={{ value: "", label: "Selecione um formato" }}
          errorMessage={formIsInvalid.formato ? "Insira um formato" : ''}
          onChangeHandler={(e) => {
            setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value }));
            formIsInvalid[e.target.name] = false
          }} />
      </div>
      <div className={styles['flex-full']}>
        {/* subtitulo obra */}
        <FormField
          title="Subtítulo"
          name="subtitulo"
          value={formInput.subtitulo}
          onKeyDownHandler={InputUtils.textFilter}
          onPasteHandler={(e) => e.preventDefault()}
          onChangeHandler={(e) => { setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value })) }} />
      </div>
      <div className={styles['flex-full']}>
        {/* Nome do tradutor */}
        <FormField
          title="Orientador (a)"
          name="orientador"
          value={formInput.orientador}
          required
          errorMessage={formIsInvalid.tipoTrabalho ? "Insira um nome de orientador (a)" : ''}
          onKeyDownHandler={(e) => InputUtils.textFilter(e, "normal", 70)}
          onPasteHandler={(e) => e.preventDefault()}
          onChangeHandler={(e) => { setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value })) }} />
      </div>
      <div className={styles['flex-full']}>
        {/* Nome da editora */}
        <SelectFormField
          title="Tipo de trabalho"
          name="tipoTrabalho"
          required
          value={formInput.tipoTrabalho}
          options={[
            {value: ETipoTrabalhoUniversitario.TCC_GRADUACAO, label: "Trabalho de Conclusão de Curso (Graduação)"},
            {value: ETipoTrabalhoUniversitario.TCC_ESPECIALIZACAO, label: "Trabalho de Conclusão de Curso (Especialização)"},
            {value: ETipoTrabalhoUniversitario.DISSERTACAO, label: "Dissertação (Mestrado)"},
            {value: ETipoTrabalhoUniversitario.TESE, label: "Tese (Doutorado)"}
          ]}
          errorMessage={formIsInvalid.tipoTrabalho ? "Insira um tipo de trabalho válido" : ''}
          initialValue={{value: "", label: "Selecione um tipo de trabalho"}}
          onChangeHandler={(e) => {
            setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value }));
            formIsInvalid[e.target.name] = false
          }} />
      </div>
      <div className={styles['flex-full']}>
        {/* subtitulo obra */}
        <FormField
          title="Universidade"
          name="universidade"
          value={formInput.universidade}
          required
          errorMessage={formIsInvalid.universidade ? "Insira um nome de universidade" : ''}
          onKeyDownHandler={InputUtils.textFilter}
          onPasteHandler={(e) => e.preventDefault()}
          onChangeHandler={(e) => { setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value })) }} />
      </div>
      <div className={styles['flex-full']}>
        {/* subtitulo obra */}
        <FormField
          title="Departamento"
          name="departamento"
          value={formInput.departamento}
          required
          errorMessage={formIsInvalid.departamento ? "Insira um nome de departamento" : ''}
          onKeyDownHandler={InputUtils.textFilter}
          onPasteHandler={(e) => e.preventDefault()}
          onChangeHandler={(e) => { setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value })) }} />
      </div>
      <div className={styles['flex-full']}>
        {/* subtitulo obra */}
        <FormField
          title="Curso"
          name="curso"
          value={formInput.curso}
          required
          errorMessage={formIsInvalid.curso ? "Insira um nome de curso" : ''}
          onKeyDownHandler={InputUtils.textFilter}
          onPasteHandler={(e) => e.preventDefault()}
          onChangeHandler={(e) => { setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value })) }} />
      </div>
      <div className={styles['flex-4-12']}>
        {/* Data da publicacao */}
        <FormField
          title="Data pub."
          name="dataPub"
          required
          value={formInput.dataPub}
          errorMessage={formIsInvalid.dataPub ? "Insira uma data válida" : ''}
          placeholder="Ex.: 2024"
          onKeyDownHandler={(e) => InputUtils.numberFilter(e, 4)}
          onChangeHandler={(e) => { setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value })) }} />
      </div>
      <div className={styles['flex-8-12']}>
        {/* Local de publicacao(cidade) */}
        <FormField
          title="Local da publicação"
          name="local"
          required
          value={formInput.local}
          errorMessage={formIsInvalid.local ? "Insira um local" : ''}
          onPasteHandler={(e) => e.preventDefault()}
          onKeyDownHandler={(e) => InputUtils.textFilter(e, "pontuacao", 50)}
          onChangeHandler={(e) => {
            setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value }));
            formIsInvalid[e.target.name] = false
          }} />
      </div>
      <div className={styles['flex-4-12']}>
        {/* Numero de páginas */}
        <FormField
          title="Nº. de páginas"
          name="numPag"
          required
          value={formInput.numPag}
          onKeyDownHandler={(e) => InputUtils.numberFilter(e, 4)}
          errorMessage={formIsInvalid.numPag ? "Insira um número válido" : ''}
          onChangeHandler={(e) => {
            setFormInput(obj => ({ ...obj, [e.target.name]: +e.target.value }));
            formIsInvalid[e.target.name] = false
          }} />
      </div>
      <div className={styles['flex-6-12']}>
        {/* Numero isbn 10 ou 13 */}
        <FormField
          title="ISSN"
          name="issn"
          value={formInput.issn}
          onKeyDownHandler={(e) => InputUtils.numberFilter(e, 8)}
          onChangeHandler={(e) => {
            setFormInput(obj => ({ ...obj, [e.target.name]: +e.target.value }));
            formIsInvalid[e.target.name] = false
          }} />
      </div>
      <div className={styles['flex-6-12']}>
        {/* Possui ilustracao(sim ou nao) */}
        <RadioFormField
          name="temIlustracao"
          options={[{ label: 'Sim', value: "yes" }, { label: "Não", value: "no" }]}
          title="Possui ilustrações?"
          value={formInput.temIlustracao ? 'yes' : 'no'}
          onChangeHandler={(e) => setFormInput(obj => ({ ...obj, temIlustracao: e.target.value == "yes" }))}
        />
      </div>
      {/* Cor */}
      <div className={styles['flex-6-12']}>
        {/* Possui Cor(sim ou nao) */}
        <RadioFormField
          name="temCor"
          options={[{ label: 'Sim', value: "yes" }, { label: "Não", value: "no" }]}
          title="Possui cor?"
          value={formInput.temCor ? 'yes' : 'no'}
          onChangeHandler={(e) => setFormInput(obj => ({ ...obj, temCor: e.target.value == "yes" }))}
        />
      </div>
      <div className={styles['flex-full']}>
        {/* Pontos de acesso secundário de assunto */}
        <MultiItemFormField
          title="Pontos de acesso secundário de assunto (mín. 1)"
          name="assuntosSecundario"
          required
          items={formInput.assuntosSecundario}
          errorMessage={formIsInvalid.assuntosSecundario ? "Adicione pelo menos 1 ponto de acesso secundário de assunto" : undefined}
          value={pontoAssunto}
          onAddItemHandler={addPontoAssunto}
          onRemoveItemHandler={(index: number) =>
            setFormInput(obj => ({ ...obj, assuntosSecundario: obj['assuntosSecundario'].filter((item, i) => i !== index) }))
          }
          onKeyDownHandler={(e) => { if (e.key == "Enter") addPontoAssunto(); return InputUtils.textFilter(e, "normal", 50) }}
          onPasteHandler={(e) => e.preventDefault()}
          onChangeHandler={(e) => setPontoAssunto(e.target.value)} />
      </div>
      <div className={styles.cdd}>
        <div className={styles['flex-5-12']}>
          {/* CDD */}
          <FormField
            title="CDD"
            name="cdd"
            required
            value={formInput.cdd}
            errorMessage={formIsInvalid.cdd ? "Insira pelo menos um dos códigos: CDD ou CDU" : ''}
            onKeyDownHandler={(e) => InputUtils.textFilter(e, "cdd", 15)}
            onChangeHandler={(e) => {
              setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value }));
              formIsInvalid["cdd"] = false
            }} />
        </div>
        <h4 className={styles['cdd-divisor']}>e/ou</h4>
        <div className={styles['flex-5-12']}>
          {/* CDU */}
          <FormField
            title="CDU"
            name="cdu"
            required
            value={formInput.cdu}
            onKeyDownHandler={(e) => InputUtils.textFilter(e, "cdd", 15)}
            onChangeHandler={(e) => {
              setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value }));
              formIsInvalid["cdd"] = false
            }} />
        </div>
      </div>
      {/* Cutter(gerar por fora pela tabela) */}
      <MainButton
        title="Criar Ficha"
        onClickHandler={handleFormSubmit}
      />
    </form>
  )
}
