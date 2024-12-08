'use client'
import { useEffect, useState } from "react"
import ReactPDF from "@react-pdf/renderer"
import FichaDocument from "../documents/FichaDocument"
import { IFicha, IFichaFormType } from "../../interface/Interfaces"
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
  const [formInput, setFormInput] = useState<IFichaFormType>({
    responsabilidades: [],
    titulo: "",
    formato: "",
    subtitulo: "",
    tradutor: "",
    edicao: 0,
    edicaoObs: "",
    dataPub: "",
    local: "",
    nomeEditora: "",
    numPag: 0,
    dimensoes: {
      width: 0,
      height: 0
    },
    temIlustracao: false,
    temCor: false,
    nomeSerie: "",
    numSerie: 0,
    isbn: 0,
    nota1: "",
    nota2: "",
    assuntosSecundario: [],
    cdd: "",
    cdu: "",
    cutter: ""
  })
  const [formIsInvalid, setFormIsInvalid] = useState<Record<string, boolean>>({
    responsabilidades: false,
    titulo: false,
    formato: false,
    dataPub: false,
    local: false,
    nomeEditora: false,
    numPag: false,
    isbn: false,
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
    let pdfBuffer = await ReactPDF.pdf(<FichaDocument ficha={await fichaService.criaFichaCatalografica(formInput)} />).toBlob()
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

    if (formInput.dataPub.trim().length !== 4 || (+formInput.dataPub.trim() > new Date().getFullYear() + 1)) {
      setFormIsInvalid(obj => ({ ...obj, dataPub: true }))
      return false
    }

    if (!StringUtils.isStringValid(formInput.local)) {
      setFormIsInvalid(obj => ({ ...obj, local: true }))
      return false
    }

    if (!StringUtils.isStringValid(formInput.nomeEditora)) {
      setFormIsInvalid(obj => ({ ...obj, nomeEditora: true }))
      return false
    }

    if (formInput.numPag == 0) {
      setFormIsInvalid(obj => ({ ...obj, numPag: true }))
      return false
    }
    //Caso ISBN nao tiver 10 ou 13 caracteres
    if (![10, 13].includes((formInput.isbn).toString().split("").length)) {
      setFormIsInvalid(obj => ({ ...obj, isbn: true }))
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
    setFormPreview(fichaService.criaFichaCatalografica(formInput, true))
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
          placeholder="Ex.: Napoleon Hill"
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
          placeholder="Ex.: Mais esperto que o Diabo"
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
          placeholder="Ex.: O mistério revelado da liberdade e do sucesso"
          onKeyDownHandler={InputUtils.textFilter}
          onPasteHandler={(e) => e.preventDefault()}
          onChangeHandler={(e) => { setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value })) }} />
      </div>
      <div className={styles['flex-full']}>
        {/* Nome do tradutor */}
        <FormField
          title="Tradução"
          name="tradutor"
          value={formInput.tradutor}
          placeholder="Ex.: Jorge Nascimento Silva"
          onKeyDownHandler={(e) => InputUtils.textFilter(e, "normal", 70)}
          onPasteHandler={(e) => e.preventDefault()}
          onChangeHandler={(e) => { setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value })) }} />
      </div>
      {/*<div className="mt-3 flex flex-col">
        {// Responsabilidade secundarias}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="responsa2">Responsabilidade Secundária</label>
        <input className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
      </div>*/}
      <div className={styles['flex-3-12']}>
        {/* Numero da edição */}
        <FormField
          title="Edição"
          name="edicao"
          value={formInput.edicao}
          onKeyDownHandler={(e) => InputUtils.numberFilter(e, 3)}
          onChangeHandler={(e) => { setFormInput(obj => ({ ...obj, [e.target.name]: +e.target.value })) }} />
      </div>
      <div className={styles['flex-9-12']}>
        {/* Informações sobre edicao abreviado */}
        <FormField
          title="Informações sobre edição"
          name="edicaoObs"
          value={formInput.edicaoObs}
          placeholder="Ex.: Edição padrão"
          onPasteHandler={(e) => e.preventDefault()}
          onKeyDownHandler={InputUtils.textFilter}
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
          placeholder="Ex.: Aracaju, SE"
          onPasteHandler={(e) => e.preventDefault()}
          onKeyDownHandler={(e) => InputUtils.textFilter(e, "pontuacao", 50)}
          onChangeHandler={(e) => {
            setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value }));
            formIsInvalid[e.target.name] = false
          }} />
      </div>
      <div className={styles['flex-full']}>
        {/* Nome da editora */}
        <FormField
          title="Nome da editora"
          name="nomeEditora"
          required
          value={formInput.nomeEditora}
          placeholder="Ex.: Yuukan Livros"
          errorMessage={formIsInvalid.nomeEditora ? "Insira um nome de editora válido" : ''}
          onPasteHandler={(e) => e.preventDefault()}
          onKeyDownHandler={(e) => InputUtils.textFilter(e, "normal", 50)}
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
        {/* Dimensoes livro */}
        <label className={`${stylesFormField.label} ${styles['dimensoes-label']}`} htmlFor="edicao">Dimensões</label>
        <section className={styles.dimensoes}>
          <div className={styles['flex-6-12']}>
            <FormField
              name="dimW"
              value={formInput.dimensoes.width}
              inputMeasure="cm"
              onKeyDownHandler={(e) => InputUtils.numberFilter(e, 2)}
              onChangeHandler={(e) => setFormInput(obj => ({ ...obj, dimensoes: { ...obj.dimensoes, width: +e.target.value } }))} />
          </div>
          <span className={styles['dimensoes-divisor']}>X</span>
          <div className={styles['flex-6-12']}>
            <FormField
              name="dimH"
              value={formInput.dimensoes.height}
              inputMeasure="cm"
              onKeyDownHandler={(e) => InputUtils.numberFilter(e, 2)}
              onChangeHandler={(e) => setFormInput(obj => ({ ...obj, dimensoes: { ...obj.dimensoes, height: +e.target.value } }))} />
          </div>
        </section>
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
        {/* Nome da série(se existir do livro) */}
        <FormField
          title="Nome da série"
          name="nomeSerie"
          value={formInput.nomeSerie}
          onPasteHandler={(e) => e.preventDefault()}
          onKeyDownHandler={(e) => InputUtils.textFilter(e, "normal", 50)}
          onChangeHandler={(e) => setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value }))} />
      </div>
      <div className={styles['flex-3-12']}>
        {/* Numero de série */}
        <FormField
          title="Nº. da série"
          name="numSerie"
          value={formInput.numSerie}
          onKeyDownHandler={(e) => InputUtils.numberFilter(e, 3)}
          onChangeHandler={(e) => setFormInput(obj => ({ ...obj, [e.target.name]: +e.target.value }))} />
      </div>
      <div className={styles['flex-6-12']}>
        {/* Numero isbn 10 ou 13 */}
        <FormField
          title="ISBN"
          name="isbn"
          required
          value={formInput.isbn}
          errorMessage={formIsInvalid.isbn ? "Insira um número de ISBN válido" : ''}
          onKeyDownHandler={(e) => InputUtils.numberFilter(e, 13)}
          onChangeHandler={(e) => {
            setFormInput(obj => ({ ...obj, [e.target.name]: +e.target.value }));
            formIsInvalid[e.target.name] = false
          }} />
      </div>
      <div className={styles['flex-full']}>
        {/* Nota sobre livro 1 */}
        <FormField
          title="Nota 1"
          name="nota1"
          value={formInput.nota1}
          placeholder="Ex.: Capa dura"
          onPasteHandler={(e) => e.preventDefault()}
          onKeyDownHandler={(e) => InputUtils.textFilter(e, "pontuacao")}
          onChangeHandler={(e) => setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value }))} />
      </div>
      <div className={styles['flex-full']}>
        {/* Nota sobre livro 2 */}
        <FormField
          title="Nota 2"
          name="nota2"
          value={formInput.nota2}
          onPasteHandler={(e) => e.preventDefault()}
          onKeyDownHandler={(e) => InputUtils.textFilter(e, "pontuacao")}
          onChangeHandler={(e) => setFormInput(obj => ({ ...obj, [e.target.name]: e.target.value }))} />
      </div>
      <div className={styles['flex-full']}>
        {/* Pontos de acesso secundário de assunto */}
        <MultiItemFormField
          title="Pontos de acesso secundário de assunto (mín. 1)"
          name="assuntosSecundario"
          required
          items={formInput.assuntosSecundario}
          placeholder="Ex.: Desenvolvimento pessoal"
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
