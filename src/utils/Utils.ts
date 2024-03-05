import { Packer,Document as Doc, Paragraph, TextRun, Tab, HeadingLevel } from "docx";

export function criaFichaCatalografica(ficha:FichaForm):Ficha{
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
  let subtitulo = formatText(ficha.subtitulo)
  let tradutor = formatText(ficha.tradutor,"name")
  let local = formatText(ficha.local,"name")
  let nomeEditora = formatText(ficha.nomeEditora,"name")
  let assuntosSecundario = ficha.assuntosSecundario.map(assunto=>formatText(assunto))

  //Cria texto da ficha para ser convertido em pdf ou word.
  let fichaTextArray = []

  let line1 = `${responsabilidades[0]}.`
  if(responsabilidades[0].split(" ").length>1){
    line1 = `${responsabilidades[0].split(" ").slice(-1)[0]}, ${responsabilidades[0].split(" ").slice(0,-1).join(" ")}.\n`
  }

  fichaObj.linha1 = line1
  // fichaTextArray.push(line1)
  
  let line2 = `${titulo}${subtitulo.length>0?`: ${subtitulo}`:""} / ${responsabilidades.join(", ")}${tradutor.length>0?` ; Tradução de ${tradutor}`:""}. ${ficha.edicao!==0?`Ed. ${ficha.edicao}${ficha.edicaoObs.length>0?`, ${ficha.edicaoObs}`:""}. `:""}- ${local}: ${nomeEditora}, ${ficha.dataPub}.`
  
  fichaObj.linha2 = line2
  // fichaTextArray.push(line2)

  let line3 = `Nº ${ficha.numPag}p. : ${ficha.temIlustracao?"il. ":""}${ficha.temCor?"cor. ":""}${ficha.dimensoes.height>0&&ficha.dimensoes.width>0?`${ficha.dimensoes.width}x${ficha.dimensoes.height} cm `:""}${ficha.nomeSerie.length>0?`(${ficha.nomeSerie}${ficha.numSerie!==0?`; ${ficha.numSerie}`:""})`:""}`

  fichaObj.linha3 = line3
  // fichaTextArray.push(line3)

  if(ficha.nota1.length>0){
    let lineNota = `${ficha.nota1}`
    fichaObj.linhaNota1 = lineNota
    // fichaTextArray.push(lineNota)
  }
  if(ficha.nota2.length>0){
    let lineNota = `${ficha.nota2}`
    fichaObj.linhaNota2 = lineNota
    // fichaTextArray.push(lineNota)
  }

  let line4 = `ISBN ${ficha.isbn}\n`

  fichaObj.linha4 = line4
  // fichaTextArray.push(line4)

  let textAssuntosSecundario = `1. ${assuntosSecundario[0]}. `
  if(assuntosSecundario.length>1){
    for(let x=1;x<assuntosSecundario.length;x++){
      textAssuntosSecundario+=`${x+1}. ${assuntosSecundario[x]}. `
    }
  } 

  let responsabilidadesExtenso = `I. ${responsabilidades[0].split(" ").slice(-1)[0]}, ${responsabilidades[0].split(" ").slice(0,-1).join(" ")}. `
  if(responsabilidades.length>1){
    for(let x=1;x<responsabilidades.length;x++){
      responsabilidadesExtenso +=`${intToRoman(x+1)}. ${responsabilidades[x].split(" ").slice(-1)[0]}, ${responsabilidades[x].split(" ").slice(0,-1).join(" ")}. `
    }
  }

  let line5EndText = `${intToRoman(responsabilidades.length+1)}. Título. ${intToRoman(responsabilidades.length+2)}. Série.`

  let line5 = `${textAssuntosSecundario}${responsabilidadesExtenso}${line5EndText}\n`

  fichaObj.linha5 = line5
  // fichaTextArray.push(line5)

  if(ficha.cdu.length>0){
    let lineCDU = `CDU ${ficha.cdu}`
    fichaObj.linhaCDU = lineCDU
    // fichaTextArray.push(lineCDU)
  }

  if(ficha.cdd.length>0){
    let lineCDD = `CDD ${ficha.cdd}`
    fichaObj.linhaCDD = lineCDD
    // fichaTextArray.push(lineCDD)
  }

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

export function exportToPdf(blob:Blob){
  // let blob = new Blob([buffer], {type: "application/pdf"});
  let link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  let fileName = "example.pdf";
  link.download = fileName;
  document.body.appendChild(link); // Required for this to work in FireFox
  link.click();
  document.body.removeChild(link)
}

export function exportToDocx(){
  const doc = new Doc({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 10,
              right: 10,
              bottom: 10,
              left: 1000,
            }
          },
        },
        children: [
          new Paragraph({
            border:{
              top:{
                size:2,color:"#000000",style:"single"
              },
              bottom:{
                size:2,color:"#000000",style:"single"
              },
              left:{
                size:2,color:"#000000",style:"single"
              },
              right:{
                size:2,color:"#000000",style:"single"
              },
            },
            children: [
              new TextRun("Hello World"),
              new TextRun({
                text: "Foo bar",
                bold: true,
              }),
              new TextRun({
                children: [new Tab(), "Github is the best"],
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            text: "Hello World",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph("Foo bar"),
          new Paragraph("Github is the best"),
        ],
      },
    ],
  });

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

function formatText(text:string,type:"name"|"normal"="normal"):string{
  if(text.length==0) return text

  if(type=="name"){
    return text.split(" ").map(item=>{
      return item.split("")[0].toUpperCase() + item.split("").slice(1).join("").toLowerCase()
    }).join(" ")
  } else {
    return text.split("")[0].toUpperCase() + text.split("").slice(1).join("").toLowerCase()
  }
}

export interface FichaForm{
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
  cdu:string
}

export interface Ficha{
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