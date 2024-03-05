'use client'
import { ChangeEvent, FormEvent, MouseEventHandler, useEffect, useState } from "react"
import ErrorMessage from "../texts/errorMessage"
import { FichaForm, criaFichaCatalografica, exportToDocx, exportToPdf } from "@/utils/Utils"
import ReactPDF from "@react-pdf/renderer"
import FichaDocument from "../documents/fichaDocument"

export default function FichaForm(){
  const [respName,setRespName] = useState<string>("")
  const [pontoAssunto,setPontoAssunto] = useState<string>("")
  const [formInput,setFormInput] = useState<FichaForm>({
    responsabilidades:[],
    titulo:"",
    subtitulo:"",
    tradutor:"",
    edicao: 1,
    edicaoObs:"",
    dataPub:"",
    local:"",
    nomeEditora:"",
    numPag:0,
    dimensoes:{
      width:0,
      height:0
    },
    temIlustracao:false,
    temCor:false,
    nomeSerie:"",
    numSerie:0,
    isbn:0,
    nota1:"",
    nota2:"",
    assuntosSecundario:[],
    cdd:"",
    cdu:""
  })
  const [formIsInvalid,setFormIsInvalid] = useState({
    responsabilidades:false,
    titulo:false,
    dataPub:false,
    local:false,
    nomeEditora:false,
    numPag:false,
    isbn:false,
    assuntosSecundario:false,
    cdd:false
  })


  function numberFilter(e:React.KeyboardEvent<HTMLInputElement>,limitDigits=2){
    let textSelected = document?.getSelection()?.toString() || ""

    let limitNumber = 9
    let arrayLimit = []
    for(let x=0;x<limitDigits;x++){
      arrayLimit.push(9)
    }
    limitNumber = +arrayLimit.join("")

    const reg = new RegExp(`[0-9]{1,${limitDigits}}`)
    // const reg = /[0-9]{1,4}/
    let lastDigit = e.key
    let input = (e.target as HTMLInputElement).value + lastDigit;
    //Fazer o replace de texto selecionado manualmente.
    if(textSelected.length>0){
      input = input.replace(textSelected,"")
    }   
    if (!(["Delete","Backspace","Tab","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(lastDigit) || e.ctrlKey && lastDigit=="a") && Number.isNaN(+input) || (!Number.isNaN(+input)&&!reg.test(input)) || (!Number.isNaN(+input) && +input > limitNumber)) {
      e.preventDefault();
    }
  }

  function textFilter(e:React.KeyboardEvent<HTMLInputElement>,type:"normal"|"pontuacao"|"cdd"|"dimensao"="normal"){
    let reg = new RegExp(`^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ ${type=="pontuacao"?".,:-":""}]+$`)
    if(type=="cdd") reg = /^([0-9.-]+)+$/
    if(type=="dimensao") reg = new RegExp("^[0-9]+(\.[0-9]{1,2})?$")
    // const reg = /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]+$/
    if (!(["Delete","Backspace","Tab","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key) || e.ctrlKey && e.key=="a") && !reg.test(e.key)) {
      e.preventDefault();
   }
  }

  function addRespName(){
    if(respName.trim().length==0 || formInput.responsabilidades.some(item=>item==respName)){
      return
    }
    formIsInvalid["responsabilidades"] = false
    setFormInput(obj=>({...obj,responsabilidades:[...obj['responsabilidades'],respName]}))
    setRespName("")
  }
  
  function addPontoAssunto(){
    if(pontoAssunto.trim().length==0 || formInput.assuntosSecundario.some(item=>item==pontoAssunto)){
      return
    }
    formIsInvalid["assuntosSecundario"] = false
    setFormInput(obj=>({...obj,assuntosSecundario:[...obj['assuntosSecundario'],pontoAssunto]}))
    setPontoAssunto("")
  }

  async function handleFormSubmit(e:any){
    console.log("Submit:")
    console.log(formInput)

    // exportToDocx()
    // return
    // let pdfBuffer = await ReactPDF.renderToBuffer(<FichaDocument />);
    
    if(validateForm()){
      console.log("Enviou")
    } else return
    let pdfBuffer = await ReactPDF.pdf(<FichaDocument ficha={criaFichaCatalografica(formInput)} />).toBlob()
    exportToPdf(pdfBuffer)
    
  }


  function validateForm(){
    //Resetar valores de invalido
    setFormIsInvalid(obj=>{
      let objCopy = {...obj}
      let keys = Object.keys(objCopy)
      for(let x=0;x<keys.length;x++){
        let key = keys[x];
        (objCopy as any)[key] = false
      }
      return objCopy
    })

    //Validação
    if(formInput.responsabilidades.length==0){
      setFormIsInvalid(obj=>({...obj,responsabilidades:true}))
      return false
    }

    if(formInput.titulo.trim().length==0){
      setFormIsInvalid(obj=>({...obj,titulo:true}))
      return false
    }
    
    if(formInput.dataPub.trim().length!==4){
      setFormIsInvalid(obj=>({...obj,dataPub:true}))
      return false
    }
    
    if(formInput.local.trim().length==0){
      setFormIsInvalid(obj=>({...obj,local:true}))
      return false
    }

    if(formInput.nomeEditora.trim().length==0){
      setFormIsInvalid(obj=>({...obj,nomeEditora:true}))
      return false
    }

    if(formInput.numPag==0){
      setFormIsInvalid(obj=>({...obj,numPag:true}))
      return false
    }
    //Caso ISBN nao tiver 10 ou 13 caracteres
    if(![10,13].includes((formInput.isbn).toString().split("").length)){
      setFormIsInvalid(obj=>({...obj,isbn:true}))
      return false
    }
    
    if(formInput.assuntosSecundario.length==0){
      setFormIsInvalid(obj=>({...obj,assuntosSecundario:true}))
      return false
    }
    
    //Fazer validacao com padrao CDD CDU se existir.
    if(formInput.cdd.trim().length==0 && formInput.cdu.trim().length==0){
      setFormIsInvalid(obj=>({...obj,cdd:true}))
      return false
    }

    return true
  }

  useEffect(()=>{
    let keys = Object.keys(formIsInvalid)
    for(let x=0;x<keys.length;x++){
      let key = keys[x];
      if((formIsInvalid as any)[key]){
        let elems = document.getElementsByName(key)
        if(elems.length>0){
          elems[0].focus({preventScroll:true})
          window.scrollTo({behavior:"smooth",top:window.scrollY+elems[0].getBoundingClientRect().top-100})
        }
        break
      }
    }

  },[formIsInvalid])

  return (
    <form className="flex flex-wrap items-center w-4/12 gap-x-4">
      <div className="mt-3 flex flex-col w-full">
        {/* Responsabilidade */}
        <label htmlFor="responsabilidades" className="block text-sm font-medium leading-6 text-gray-900">Responsabilidades (mín. 1) <span className="text-red-700">*</span></label>
        <div className="flex">
          <input 
            name="responsabilidades" 
            value={respName} 
            onChange={(e)=>setRespName(e.target.value)}
            onKeyDown={(e)=>{if(e.key=="Enter") addRespName();return textFilter(e)}}
            className="block w-full mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6" type="text"/>
          <span onClick={addRespName} 
            className="block text-white rounded-md bg-indigo-500 text-xl ml-2 p-1 px-3 hover:cursor-pointer hover:bg-indigo-600">+</span>
        </div>
        {formIsInvalid.responsabilidades && <ErrorMessage message={"Adicione pelo menos 1 responsabilidade"}/>}
        <ul className="list-none flex flex-wrap justify-start gap-x-1 gap-y-0">
          {formInput.responsabilidades.length>0 && formInput.responsabilidades.map((value,index)=>{
            return (<li key={index} className="mt-3 block">
              <span className="rounded-md text-sm bg-indigo-300 p-2">
                {value}
                {index==0 && <span className="text-sm rounded-md bg-black ml-2 px-2 bg-black-500 text-white">Principal</span>}
                <span onClick={()=>setFormInput(obj=>({...obj,responsabilidades:obj['responsabilidades'].filter((item,i)=>i!==index)}))} 
                  className="ml-2 text-sm text-red-800 hover:cursor-pointer">X</span>
              </span>
            </li>)
          })}
          
        </ul>
      </div>

      <div className="mt-3 flex flex-col w-full">
        {/* Titulo obra */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="titulo">Título <span className="text-red-700">*</span></label>
        <input 
          onChange={(e)=>{
            setFormInput(obj=>({...obj,[e.target.name]:e.target.value}));
            (formIsInvalid as any)[e.target.name] = false
          }}
          onKeyDown={textFilter}
          value={formInput.titulo}
          name="titulo" 
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
          {formIsInvalid.titulo && <ErrorMessage message={"Insira um título válido"}/>}
      </div>
      <div className="mt-3 flex flex-col w-full">
        {/* subtitulo obra */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="subtitulo">Subtítulo</label>
        <input 
          onChange={(e)=>setFormInput(obj=>({...obj,[e.target.name]:e.target.value}))}
          onKeyDown={textFilter}
          value={formInput.subtitulo}
          name="subtitulo"
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
      </div>
      <div className="mt-3 flex flex-col w-full">
        {/* Nome do tradutor */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="tradutor">Tradução</label>
        <input 
          onChange={(e)=>setFormInput(obj=>({...obj,[e.target.name]:e.target.value}))}
          onKeyDown={textFilter}
          value={formInput.tradutor}
          name="tradutor"
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
      </div>
      {/*<div className="mt-3 flex flex-col">
        {// Responsabilidade secundarias}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="responsa2">Responsabilidade Secundária</label>
        <input className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
      </div>*/}
      <div className="mt-3 flex flex-col w-3/12">
        {/* Numero da edição */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="edicao">Edição</label>
        <input 
          onChange={(e)=>setFormInput(obj=>({...obj,[e.target.name]:+e.target.value}))}
          onKeyDown={(e)=>numberFilter(e,3)}
          value={formInput.edicao}
          name="edicao" 
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
      </div>
      <div className="mt-3 flex flex-col w-8/12 flex-1">
        {/* Informações sobre edicao abreviado */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="edicaoObs">Informações sobre edição</label>
        <input 
          onChange={(e)=>setFormInput(obj=>({...obj,[e.target.name]:e.target.value}))}
          onKeyDown={textFilter}
          value={formInput.edicaoObs}
          name="edicaoObs" 
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
      </div>
      <div className="mt-3 flex flex-col w-4/12">
        {/* Data da publicacao */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="dataPub">Data da publicação <span className="text-red-700">*</span></label>
        <input 
          onChange={(e)=>setFormInput(obj=>({...obj,[e.target.name]:e.target.value}))}
          onKeyDown={(e)=>numberFilter(e,4)}
          value={formInput.dataPub}
          name="dataPub" 
          placeholder="Ex.: 2024"
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
          {formIsInvalid.dataPub && <ErrorMessage message={"Insira uma data válida"}/>}
      </div>
      <div className="mt-3 flex flex-col w-7/12 flex-1">
        {/* Local de publicacao(cidade) */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="local">Local da publicação <span className="text-red-700">*</span></label>
        <input 
          onChange={(e)=>{
            setFormInput(obj=>({...obj,[e.target.name]:e.target.value}));
            (formIsInvalid as any)[e.target.name] = false
          }}
          onKeyDown={(e)=>textFilter(e,"pontuacao")}
          value={formInput.local}
          name="local" 
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
          {formIsInvalid.local && <ErrorMessage message={"Insira um local"}/>}
      </div>
      <div className="mt-3 flex flex-col w-full">
        {/* Nome da editora */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="nomeEditora">Nome da editora <span className="text-red-700">*</span></label>
        <input 
          onChange={(e)=>{
            setFormInput(obj=>({...obj,[e.target.name]:e.target.value}));
            (formIsInvalid as any)[e.target.name] = false
          }}
          onKeyDown={textFilter}
          value={formInput.nomeEditora}
          name="nomeEditora" 
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
          {formIsInvalid.nomeEditora && <ErrorMessage message={"Insira um nome de editora válido"}/>}
      </div>
      <div className="mt-3 flex flex-col w-4/12">
        {/* Numero de páginas */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="numPag">Núm. de páginas <span className="text-red-700">*</span></label>
        <input 
          onChange={(e)=>{
            setFormInput(obj=>({...obj,[e.target.name]:e.target.value}));
            (formIsInvalid as any)[e.target.name] = false
          }}
          onKeyDown={(e)=>numberFilter(e,4)}
          value={formInput.numPag}
          name="numPag" 
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
          
          {formIsInvalid.numPag && <ErrorMessage message={"Insira um número válido"}/>}
      </div>
      
      <div className="mt-3 flex flex-col w-6/12">
        {/* Dimensoes livro */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="edicao">Dimensões</label>
        <section className="flex w-full gap-2 mt-1 items-center">
          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 sm:max-w-md">
            <input 
              onChange={(e)=>setFormInput(obj=>({...obj,dimensoes:{...obj.dimensoes,width:+e.target.value}}))}
              onKeyDown={(e)=>numberFilter(e,2)}
              value={formInput.dimensoes.width}
              name="dimW" 
              className="block w-7/12 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-0 sm:text-sm sm:leading-6"/>
            <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">cm</span>
          </div>
          <h4 className="mx-auto text-sm">x</h4>
          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 sm:max-w-md">
            <input 
              onChange={(e)=>setFormInput(obj=>({...obj,dimensoes:{...obj.dimensoes,height:+e.target.value}}))}
              onKeyDown={(e)=>numberFilter(e,2)}
              value={formInput.dimensoes.height}
              name="dimH"
              className="block w-7/12 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-0 sm:text-sm sm:leading-6"/>
            <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">cm</span>
          </div>
        </section>
      </div>
      <div className="mt-3 flex flex-col w-4/12">
        {/* Possui ilustracao(sim ou nao) */}
        <h4 className="block text-sm font-medium leading-6 text-gray-900">Possui ilustrações?</h4>
        <div className="flex">
          <input 
            onChange={(e)=>setFormInput(obj=>({...obj,temIlustracao:e.target.value=="yes"}))}
            value="yes"
            checked={formInput.temIlustracao}
            name="temIlustracao"
            id="ilustYes"
            className="block mt-1 rounded-md border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 cursor-pointer accent-indigo-600" type="radio"/>
          <label htmlFor="ilustYes" className="ml-2">Sim</label>
        </div>
        <div className="flex">
          <input 
            onChange={(e)=>setFormInput(obj=>({...obj,temIlustracao:!(e.target.value=="no")}))}
            value="no"
            checked={!formInput.temIlustracao}
            name="temIlustracao"
            id="ilustNo"
            className="block mt-1 rounded-md border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 cursor-pointer accent-indigo-600" type="radio"/>
          <label htmlFor="ilustNo" className="ml-2">Não</label>
        </div>
      </div>
      {/* Cor */}
      <div className="mt-3 flex flex-col w-e/12">
        {/* Possui Cor(sim ou nao) */}
        <h4 className="block text-sm font-medium leading-6 text-gray-900">Possui cor?</h4>
        <div className="flex">
          <input 
            onChange={(e)=>setFormInput(obj=>({...obj,temCor:e.target.value=="yes"}))}
            value="yes"
            checked={formInput.temCor}
            name="temCor"
            id="corYes"
            className="block mt-1 rounded-md border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 cursor-pointer accent-indigo-600" type="radio"/>
          <label htmlFor="corYes" className="ml-2">Sim</label>
        </div>
        <div className="flex">
          <input 
            onChange={(e)=>setFormInput(obj=>({...obj,temCor:!(e.target.value=="no")}))}
            value="no"
            checked={!formInput.temCor}
            name="temCor"
            id="corNo"
            className="block mt-1 rounded-md border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 cursor-pointer accent-indigo-600" type="radio"/>
          <label htmlFor="corNo" className="ml-2">Não</label>
        </div>
      </div>
      <div className="mt-3 flex flex-col w-full">
        {/* Nome da série(se existir do livro) */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="nomeSerie">Nome da série</label>
        <input 
          onChange={(e)=>setFormInput(obj=>({...obj,[e.target.name]:e.target.value}))}
          onKeyDown={textFilter}
          value={formInput.nomeSerie}
          name="nomeSerie" 
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
      </div>
      <div className="mt-3 flex flex-col w-3/12">
        {/* Numero de série */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="numSerie">Núm. da série</label>
        <input 
          onChange={(e)=>setFormInput(obj=>({...obj,[e.target.name]:+e.target.value}))}
          onKeyDown={(e)=>numberFilter(e,3)}
          value={formInput.numSerie}
          name="numSerie" 
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
      </div>
      <div className="mt-3 flex flex-col w-6/12">
        {/* Numero isbn 10 ou 13 */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="isbn">ISBN <span className="text-red-700">*</span></label>
        <input 
          onChange={(e)=>{
            setFormInput(obj=>({...obj,[e.target.name]:+e.target.value}));
            (formIsInvalid as any)[e.target.name] = false
          }}
          onKeyDown={(e)=>numberFilter(e,13)}
          value={formInput.isbn}
          name="isbn" 
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
        {formIsInvalid.isbn && <ErrorMessage message={"Insira um número de ISBN válido"}/>}
      </div>
      <div className="mt-3 flex flex-col w-full">
        {/* Nota sobre livro 1 */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="nota1">Nota 1</label>
        <input 
          onChange={(e)=>setFormInput(obj=>({...obj,[e.target.name]:e.target.value}))}
          onKeyDown={(e)=>textFilter(e,"pontuacao")}
          value={formInput.nota1}
          name="nota1" 
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
      </div>
      <div className="mt-3 flex flex-col w-full">
        {/* Nota sobre livro 2 */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="nota2">Nota 2</label>
        <input 
          onChange={(e)=>setFormInput(obj=>({...obj,[e.target.name]:e.target.value}))}
          onKeyDown={(e)=>textFilter(e,"pontuacao")}
          value={formInput.nota2}
          name="nota2" 
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
      </div>
      <div className="mt-3 flex flex-col w-full">
        {/* Pontos de acesso secundário de assunto */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="assuntosSecundario">Pontos de acesso secundário de assunto (mín. 1)<span className="text-red-700">*</span></label>
        <div className="flex">
          <input 
            name="assuntosSecundario" 
            value={pontoAssunto} 
            onChange={(e)=>setPontoAssunto(e.target.value)}
            onKeyDown={(e)=>{if(e.key=="Enter") addPontoAssunto();return textFilter(e)}}
            className="block w-full mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
          <span onClick={addPontoAssunto} 
            className="block text-white rounded-md bg-indigo-500 text-xl ml-2 p-1 px-3 hover:cursor-pointer hover:bg-indigo-600">+</span>
        </div>
        {formIsInvalid.assuntosSecundario && <ErrorMessage message={"Adicione pelo menos 1 ponto de acesso secundário de assunto"}/>}
        <ul className="list-none flex flex-wrap justify-start gap-x-1 gap-y-0">
          {formInput.assuntosSecundario.length>0 && formInput.assuntosSecundario.map((value,index)=>{
            return (<li key={index} className="mt-3 block">
              <span className="rounded-md text-sm bg-indigo-300 p-2">
                {value}
                <span onClick={()=>setFormInput(obj=>({...obj,assuntosSecundario:obj['assuntosSecundario'].filter((item,i)=>i!==index)}))}
                  className="ml-2 text-sm text-red-800 hover:cursor-pointer">X</span>
              </span>
            </li>)
          })}
          
        </ul>
      </div>
      <div className="mt-3 flex flex-col w-5/12">
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="cdd">CDD <span className="text-red-700">*</span></label>
        <input 
          onChange={(e)=>{
            setFormInput(obj=>({...obj,[e.target.name]:e.target.value}));
            formIsInvalid["cdd"] = false
          }}
          onKeyDown={(e)=>textFilter(e,"cdd")}
          value={formInput.cdd}
          name="cdd" 
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
          {formIsInvalid.cdd && <ErrorMessage message={"Insira pelo menos um dos dois códigos: CDD ou CDU"}/>}
      </div>
      <h4 className="mt-8">e/ou</h4>
      <div className="mt-3 flex flex-col w-5/12">
        {/* CDU ou CDD */}
        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="cdu">CDU <span className="text-red-700">*</span></label>
        <input 
          onChange={(e)=>{
            setFormInput(obj=>({...obj,[e.target.name]:e.target.value}));
            formIsInvalid["cdd"] = false
          }}
          onKeyDown={(e)=>textFilter(e,"cdd")}
          value={formInput.cdu}
          name="cdu" 
          className="block mt-1 rounded-md ring-1 ring-outset ring-gray-300 focus-within:ring-2 focus-within:ring-outset focus-within:ring-indigo-600 outline-none border-0 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
      </div>
      {/* Cutter(gerar por fora pela tabela) */}
      <button type="button"onClick={handleFormSubmit} className="block w-6/12 mx-auto font-bold text-white p-2 mt-5 rounded-md bg-indigo-500 hover:bg-indigo-600">Criar Ficha</button>
    </form>
  )
}
