import { Packer,Document as Doc, Paragraph, TextRun, AlignmentType, ParagraphChild, IBorderOptions } from "docx";
import tabelaCutter from "../../tabela-cutter/tabela-cutter.json"

export function criaFichaCatalografica(ficha:FichaFormType,preview=false){
  let fichaObj:Ficha = {
    linha1:"",
    linha2:"",
    linha3:"",
    linha4:"",
    linha5:"",
  }
  //Formata textos para criar ficha
  let responsabilidades = ficha.responsabilidades.map(name=>formatText(name,"name"))
  let titulo = formatText(ficha.titulo)
  if(preview && titulo.length==0) titulo = "{Título}"
  let subtitulo = formatText(ficha.subtitulo)
  if(preview && subtitulo.length==0) subtitulo = "{Subtítulo}"
  let tradutor = `Tradução de ${formatText(ficha.tradutor,"name")}`
  if(ficha.tradutor.length==0) tradutor = preview?"{Tradutor}":""
  let local = formatText(ficha.local,"name")
  if(preview && local.length==0) local = "{Local}"
  let nomeEditora = formatText(ficha.nomeEditora,"name")
  if(preview && nomeEditora.length==0) nomeEditora = "{Nome da Editora}"
  let dataPub = ficha.dataPub
  if(preview && dataPub.length==0) dataPub = "{Data}"
  let assuntosSecundario = ficha.assuntosSecundario.map(assunto=>formatText(assunto))

  //Cria texto da ficha para ser convertido em pdf ou word.
  let fichaTextArray = []

  let firstEntidade = convertNameToEntidade(responsabilidades[0])
  if(preview && firstEntidade.length==0) firstEntidade = "{Sobrenome}, {Nome da Principal Responsabilidade}"

  let line1 = `${firstEntidade}.\n`

  fichaObj.linha1 = line1
  // fichaTextArray.push(line1)

  let nomesExtenso = responsabilidades.join(", ")
  if(preview && responsabilidades.length==0) nomesExtenso = "{Responsabilidades por Extenso}"

  let numEdicao = `${ficha.edicao}. ed.`
  if(ficha.edicao==0) numEdicao = preview?"{Nº ed}.":""
  let edicaoObs = `, ${ficha.edicaoObs}.`
  if(ficha.edicao==0 || ficha.edicaoObs.length==0) edicaoObs = preview&&ficha.edicao>0?", {Info Edição}":""
  
  let line2 = `${titulo}${subtitulo.length>0?`: ${subtitulo}`:""} / ${nomesExtenso}${tradutor.length>0?` ; ${tradutor}`:""}. ${numEdicao.length>0?`${numEdicao}${edicaoObs.length>0?`${edicaoObs}`:""} `:""}${local}: ${nomeEditora}, ${dataPub}.`
  
  fichaObj.linha2 = line2
  // fichaTextArray.push(line2)

  //Verifica se tem alguma propriedade do livro explicita
  let temProp = ficha.temIlustracao||ficha.temCor||ficha.dimensoes.width>0||ficha.dimensoes.height>0||ficha.nomeSerie.length>0

  let ilustracao = "il. "
  if(!ficha.temIlustracao) ilustracao = preview?"{il.} ":""
  let cor = "cor. "
  if(!ficha.temCor) cor = preview?"{cor.} ":""

  let dimensoes = ""
  if(ficha.dimensoes.width>0 && ficha.dimensoes.height==0) dimensoes = `${ficha.dimensoes.width} cm `
  if(ficha.dimensoes.width==0 && ficha.dimensoes.height>0) dimensoes = `${ficha.dimensoes.height} cm `
  if(ficha.dimensoes.width>0 && ficha.dimensoes.height>0) dimensoes = `${ficha.dimensoes.width}x${ficha.dimensoes.height} cm `
  if(preview && dimensoes.length==0) dimensoes = "{Largura}x{Altura} cm "

  let serie = `${ficha.nomeSerie}`
  if(ficha.nomeSerie.length==0) serie = preview?"{Nome Série}":""
  let numSerie = `; ${ficha.numSerie}`
  if(ficha.nomeSerie.length==0 || ficha.numSerie==0) numSerie = preview&&ficha.nomeSerie.length>0?"; {Nº Série}":""

  let line3 = `${ficha.numPag} p.${temProp||preview?" : ":""}${ilustracao}${cor}${dimensoes}${serie.length>0?`(${serie}${numSerie})`:""}`

  fichaObj.linha3 = line3
  // fichaTextArray.push(line3)

  if(preview) fichaObj.linhaNota1 = "{Nota 1}"
  if(ficha.nota1.length>0){
    let lineNota = `${ficha.nota1}`
    fichaObj.linhaNota1 = lineNota
    // fichaTextArray.push(lineNota)
  }

  if(preview) fichaObj.linhaNota2 = "{Nota 2}"
  if(ficha.nota2.length>0){
    let lineNota = `${ficha.nota2}`
    fichaObj.linhaNota2 = lineNota
    // fichaTextArray.push(lineNota)
  }

  let isbnNumber = `${ficha.isbn}`
  if(preview && ficha.isbn==0) isbnNumber = "0000000000"

  let line4 = `ISBN ${isbnNumber}\n`

  fichaObj.linha4 = line4
  // fichaTextArray.push(line4)
  
  let firstAssuntoSecundario = assuntosSecundario[0] || ""
  if(preview && firstAssuntoSecundario.length==0) firstAssuntoSecundario = "{Pontos de Acesso Secundário de Assunto}"

  let textAssuntosSecundario = `1. ${firstAssuntoSecundario}. `
  if(assuntosSecundario.length>1){
    for(let x=1;x<assuntosSecundario.length;x++){
      textAssuntosSecundario+=`${x+1}. ${assuntosSecundario[x]}. `
    }
  } 

  let offset = 0
  let firstResponsabilidadeExtenso = convertNameToEntidade(responsabilidades[0])
  if(preview && firstResponsabilidadeExtenso.length==0) {
    firstResponsabilidadeExtenso = "{Pontos de Acesso Secundário de Responsabilidade}"
    offset = 1
  }

  let responsabilidadesExtenso = `I. ${firstResponsabilidadeExtenso}. `
  if(responsabilidades.length>1){
    for(let x=1;x<responsabilidades.length;x++){
      responsabilidadesExtenso +=`${intToRoman(x+1)}. ${convertNameToEntidade(responsabilidades[x])}. `
    }
  }

  let line5EndText = `${intToRoman(responsabilidades.length+1+offset)}. Título. ${intToRoman(responsabilidades.length+2+offset)}. Série.`

  let line5 = `${textAssuntosSecundario}${responsabilidadesExtenso}${line5EndText}\n`

  fichaObj.linha5 = line5
  // fichaTextArray.push(line5)

  if(preview) fichaObj.linhaCDU = "CDU 000"
  if(ficha.cdu.length>0){
    let lineCDU = `CDU ${ficha.cdu}`
    fichaObj.linhaCDU = lineCDU
    // fichaTextArray.push(lineCDU)
  }

  if(preview) fichaObj.linhaCDD = "CDD 000"
  if(ficha.cdd.length>0){
    let lineCDD = `CDD ${ficha.cdd}`
    fichaObj.linhaCDD = lineCDD
    // fichaTextArray.push(lineCDD)
  }

  //Cutter
  fichaObj.linhaCutter = ficha.cutter
  if(preview && ficha.cutter.length==0) fichaObj.linhaCutter = "X000x"
  // if(withCutter) fichaObj.linhaCutter = await getCutter(responsabilidades[0],titulo)

  // let fichaText = fichaTextArray.join("\n")
  // exportToTxt(fichaText)

  return fichaObj
}

function exportToTxt(text:string){
  const element = document.createElement("a");
  const file = new Blob([text], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = "ficha.txt";
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element)
}

export function exportToPdf(blob:Blob,titulo:string){
  // let blob = new Blob([buffer], {type: "application/pdf"});
  let link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  let fileName = `Ficha Catalográfica - ${titulo}.pdf`;
  link.download = fileName;
  document.body.appendChild(link); // Required for this to work in FireFox
  link.click();
  document.body.removeChild(link)
}

export function exportToDocx(ficha:Ficha){
  const styles = {
    section: {
      margin: { top: 10, right: 10, bottom: 100, left: 10 },
      border: { color: "000000", size: 1, style: "solid" }
    },
    text: { fontSize: 10, marginBottom: 10 },
    textIndent: { left: 20 },
    rightAligned: { alignment: AlignmentType.RIGHT }
  };
  
  // Define the content for the document
  const content = [
    { style: "text", text: "linha1" },
    { style: "textIndent", text: "linha2" },
    { style: "textIndent", text: "linha3" },
    { style: "textIndent", text: "linhaNota1" },
    { style: "textIndent", text: "linhaNota2" },
    { style: "textIndent", text: "linha4" },
    { style: "textIndent", text: "linha5" },
    { style: "rightAligned", text: "linhaCDU" },
    { style: "rightAligned", text: "linhaCDD" }
  ];

  let children:ParagraphChild[] = []

  children.push(new TextRun({
    text: ficha.linha1,
    font:{name:"Arial"}
  }))
  children.push(new TextRun({
    text: ficha.linha2,
    break:2,
    font:{name:"Arial"}
  }))
  children.push(new TextRun({
    text: ficha.linha3,
    break:1,
    font:{name:"Arial"}
  }))
  if(ficha.linhaNota1){
    children.push(new TextRun({
      text: ficha.linhaNota1,
      break:2,
      font:{name:"Arial"}
    }))
  }
  if(ficha.linhaNota2){
    children.push(new TextRun({
      text: ficha.linhaNota2,
      break:!ficha.linhaNota1?2:1,
      font:{name:"Arial"}
    }))
  }
  children.push(new TextRun({
    text: ficha.linha4,
    break:!ficha.linhaNota1 && !ficha.linhaNota2?2:1,
    font:{name:"Arial"}
  }))
  children.push(new TextRun({
    text: "    "+ficha.linha5,
    break:2,
    font:{name:"Arial"}
  }))
  if(ficha.linhaCDU){
    children.push(new TextRun({
      text: ficha.linhaCDU,
      break:2,
      font:{name:"Arial"}
    }))
  }
  if(ficha.linhaCDD){
    children.push(new TextRun({
      text: ficha.linhaCDD,
      break:!ficha.linhaCDU?2:1,
      font:{name:"Arial"}
    }))
  }

  let borderStyle:IBorderOptions = {
    color: "auto",
    space: 1,
    style: "single",
    size: 6,
  }

  // Create a new document
  const doc = new Doc({
    sections:[{
      properties:{
        page:{
          margin:{
            top:500,
            bottom:500,
            right:500,
            left:500,
          }
        }
      },
      children:[new Paragraph({
        border:{
          top: borderStyle,
          bottom: borderStyle,
          left: borderStyle,
          right:borderStyle
        },
        children
      })]
    }]
  });
  
  // const doc = new Doc({
  //   sections: [
  //     {
  //       properties: {
  //         page: {
  //           margin: {
  //             top: 10,
  //             right: 10,
  //             bottom: 10,
  //             left: 1000,
  //           }
  //         },
  //       },
  //       children: [
  //         new Paragraph({
  //           border:{
  //             top:{
  //               size:2,color:"#000000",style:"single"
  //             },
  //             bottom:{
  //               size:2,color:"#000000",style:"single"
  //             },
  //             left:{
  //               size:2,color:"#000000",style:"single"
  //             },
  //             right:{
  //               size:2,color:"#000000",style:"single"
  //             },
  //           },
  //           children: [
  //             new TextRun("Hello World"),
  //             new TextRun({
  //               text: "Foo bar",
  //               bold: true,
  //             }),
  //             new TextRun({
  //               children: [new Tab(), "Github is the best"],
  //               bold: true,
  //             }),
  //           ],
  //         }),
  //         new Paragraph({
  //           text: "Hello World",
  //           heading: HeadingLevel.HEADING_1,
  //         }),
  //         new Paragraph("Foo bar"),
  //         new Paragraph("Github is the best"),
  //       ],
  //     },
  //   ],
  // });

  Packer.toBlob(doc).then((buffer) => {
    // fs.writeFileSync("My Document.docx", buffer);
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(buffer);
    let fileName = "example.docx";
    link.download = fileName;
    document.body.appendChild(link); // Required for this to work in FireFox
    link.click();
    document.body.removeChild(link)
  });
}

function intToRoman(integer:number):string {
  const romanNumerals = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' },
  ];
  let result = '';
  for (let i = 0; i < romanNumerals.length; i++) {
    while (integer >= romanNumerals[i].value) {
      result += romanNumerals[i].symbol;
      integer -= romanNumerals[i].value;
    }
  }
  return result;
}

export function formatText(text:string,type:"name"|"normal"="normal"):string{
  if(text?.length==0) return text

  if(type=="name"){
    return text.split(" ").map(item=>{
      if(item.length==0) return item
      return item.split("")[0].toUpperCase() + item.split("").slice(1).join("").toLowerCase()
    }).join(" ")
  } else {
    return text.split("")[0].toUpperCase() + text.split("").slice(1).join("").toLowerCase()
  }
}

function convertNameToEntidade(name:string){
  if(!name) return ""
  let convertedName = `${name}`
  if(name.split(" ").length>1){
    convertedName = `${name.split(" ").slice(-1)[0]}, ${name.split(" ").slice(0,-1).join(" ")}`
  }
  return convertedName
}

async function getCutter(name:string,title:string):Promise<string>{
  return new Promise((resolve,reject)=>{
    fetch(`api/tabela-cutter?name=${name}&title=${title}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data?.cutter)
        resolve(data?.cutter || "")
      })
  })
}

export function getCutter2(name:string,title:string):string {
  //Coloca sobrenome na frente
  let convertedName = formatText(name,"name")
  if(name.split(" ").length>1){
    convertedName = `${name.split(" ").slice(-1)[0]}, ${name.split(" ").slice(0,-1).join(" ")}`
  } 
  let firstLetter = convertedName.split("")[0].toUpperCase()
  let firstTitleLetter = (title?.split("")[0]||"").toLowerCase()
  let data = (tabelaCutter as any)[firstLetter]
  let cutterNumber = 0
  let x = 0
  while(cutterNumber==0){
    let surname = convertedName.split(",")[0]
    if(x>0) surname = surname.split("").slice(0,-x).join("")
    let foundKeys = Object.keys(data).filter(key=>{
      return data[key].includes(surname)
    })
    // console.log(foundKeys)
    cutterNumber = +( foundKeys.length>0?foundKeys[0]: 0)
    if(foundKeys.length>1 && x==0 &&convertedName.split(",").length>1){
      let subName = convertedName.slice(0,convertedName.indexOf(" ")+2)+"."
      // console.log("sub: ",subName)
      let findSubKey = foundKeys.find(key=>data[key].includes(subName))
      if(findSubKey) cutterNumber = +findSubKey
    }
    // console.log(surname,cutterNumber)
    if(cutterNumber == 0) x++
  } 
  let cutter = `${firstLetter}${cutterNumber}${firstTitleLetter}`
  return cutter
}

export interface FichaFormType{
  responsabilidades:string[],
  titulo:string,
  subtitulo:string,
  tradutor:string,
  edicao: number,
  edicaoObs:string,
  dataPub:string,
  local:string,
  nomeEditora:string,
  numPag:number,
  dimensoes:{
    width:number,
    height:number
  },
  temIlustracao:boolean,
  temCor:boolean,
  nomeSerie:string,
  numSerie:number,
  isbn:number,
  nota1:string,
  nota2:string,
  assuntosSecundario:string[],
  cdd:string,
  cdu:string,
  cutter:string
}

export interface Ficha{
  linhaCutter?:string
  linha1:string
  linha2:string
  linha3:string
  linhaNota1?:string
  linhaNota2?:string
  linha4:string
  linha5:string
  linhaCDD?:string
  linhaCDU?:string
}