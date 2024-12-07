import { IFicha, IFichaDimensions, IFichaFormType } from "../interface/Interfaces"
import tabelaCutter from "../../tabela-cutter/tabela-cutter.json"
import Utils from "@/utils/Utils"

export default class FichaService {

  criaFichaCatalografica(ficha: IFichaFormType, isPreview = false) {
    const fichaObj: IFicha = {
      linha1: "",
      linha2: "",
      linha3: "",
      linha4: "",
      linha5: "",
    }
    //Formata textos para criar ficha
    let responsabilidades = ficha.responsabilidades.map(name => Utils.formatText(name, "name"))
    let titulo = Utils.formatText(ficha.titulo)
    let formato = ficha.formato
    let subtitulo = Utils.formatText(ficha.subtitulo)
    let tradutor = `Tradução de ${Utils.formatText(ficha.tradutor, "name")}`
    let local = Utils.formatText(ficha.local, "name")
    let nomeEditora = Utils.formatText(ficha.nomeEditora, "name")
    let dataPub = ficha.dataPub
    if (isPreview) {
      if (titulo.length == 0)
        titulo = "{Título}"
      if (formato.length == 0)
        formato = "{formato}"
      if (subtitulo.length == 0)
        subtitulo = "{Subtítulo}"
      if (local.length == 0)
        local = "{Local}"
      if (nomeEditora.length == 0)
        nomeEditora = "{Nome da Editora}"
      if (dataPub.length == 0)
        dataPub = "{Data}"
      if (ficha.cdd.length == 0)
        fichaObj.linhaCDD = "CDD 000"
      if (ficha.cdu.length == 0)
        fichaObj.linhaCDU = "CDU 000"
    }

    if (ficha.tradutor.length == 0)
      tradutor = isPreview ? "{Tradutor}" : ""

    let assuntosSecundario = ficha.assuntosSecundario.map(assunto => Utils.formatText(assunto))

    //Cria texto da ficha para ser convertido em pdf ou word.
    let fichaTextArray = []

    let firstEntidade = Utils.convertNameToEntidade(responsabilidades[0])
    if (isPreview && firstEntidade.length == 0) firstEntidade = "{Sobrenome}, {Nome da Principal Responsabilidade}"

    fichaObj.linha1 = `${firstEntidade}.\n`
    // fichaTextArray.push(line1)

    let nomesExtenso = responsabilidades.join(", ")
    if (isPreview && responsabilidades.length == 0) nomesExtenso = "{Responsabilidades por Extenso}"

    let numEdicao = `${ficha.edicao}. ed.`
    if (ficha.edicao == 0) numEdicao = isPreview ? "{Nº ed}." : ""
    let edicaoObs = `, ${ficha.edicaoObs}.`
    if (ficha.edicao == 0 || ficha.edicaoObs.length == 0) edicaoObs = isPreview && ficha.edicao > 0 ? ", {Info Edição}" : ""

    let line2 = `${titulo}${formato.length > 0 ? ` [${formato}]` : ''}${subtitulo.length > 0 ? `: ${subtitulo}` : ""} / ${nomesExtenso}${tradutor.length > 0 ? ` ; ${tradutor}` : ""}. ${numEdicao.length > 0 ? `${numEdicao}${edicaoObs.length > 0 ? `${edicaoObs}` : ""} ` : ""}${local}: ${nomeEditora}, ${dataPub}.`

    fichaObj.linha2 = line2
    // fichaTextArray.push(line2)

    //Verifica se tem alguma propriedade do livro explicita
    let temProp = ficha.temIlustracao || ficha.temCor || ficha.dimensoes.width > 0 || ficha.dimensoes.height > 0 || ficha.nomeSerie.length > 0

    let ilustracao = "il. "
    if (!ficha.temIlustracao) ilustracao = isPreview ? "{il.} " : ""
    let cor = "cor. "
    if (!ficha.temCor) cor = isPreview ? "{cor.} " : ""

    let dimensoes = this.getDimensionsText(ficha.dimensoes, isPreview)

    let serie = `${ficha.nomeSerie}`
    if (ficha.nomeSerie.length == 0) serie = isPreview ? "{Nome Série}" : ""
    let numSerie = `; ${ficha.numSerie}`
    if (ficha.nomeSerie.length == 0 || ficha.numSerie == 0) numSerie = isPreview && ficha.nomeSerie.length > 0 ? "; {Nº Série}" : ""

    let line3 = `${ficha.numPag} p.${temProp || isPreview ? " : " : ""}${ilustracao}${cor}${dimensoes}${serie.length > 0 ? `(${serie}${numSerie})` : ""}`

    fichaObj.linha3 = line3
    // fichaTextArray.push(line3)

    if (isPreview) fichaObj.linhaNota1 = "{Nota 1}"
    if (ficha.nota1.length > 0) {
      let lineNota = `${ficha.nota1}`
      fichaObj.linhaNota1 = lineNota
      // fichaTextArray.push(lineNota)
    }

    if (isPreview) fichaObj.linhaNota2 = "{Nota 2}"
    if (ficha.nota2.length > 0) {
      let lineNota = `${ficha.nota2}`
      fichaObj.linhaNota2 = lineNota
      // fichaTextArray.push(lineNota)
    }

    let isbnNumber = `${ficha.isbn}`
    if (isPreview && ficha.isbn == 0) isbnNumber = "0000000000"

    let line4 = `ISBN ${isbnNumber}\n`

    fichaObj.linha4 = line4
    // fichaTextArray.push(line4)

    let firstAssuntoSecundario = assuntosSecundario[0] || ""
    if (isPreview && firstAssuntoSecundario.length == 0) firstAssuntoSecundario = "{Pontos de Acesso Secundário de Assunto}"

    let textAssuntosSecundario = `1. ${firstAssuntoSecundario}. `
    if (assuntosSecundario.length > 1) {
      for (let x = 1; x < assuntosSecundario.length; x++) {
        textAssuntosSecundario += `${x + 1}. ${assuntosSecundario[x]}. `
      }
    }

    let offset = 0
    let firstResponsabilidadeExtenso = Utils.convertNameToEntidade(responsabilidades[0])
    if (isPreview && firstResponsabilidadeExtenso.length == 0) {
      firstResponsabilidadeExtenso = "{Pontos de Acesso Secundário de Responsabilidade}"
      offset = 1
    }

    let responsabilidadesExtenso = `I. ${firstResponsabilidadeExtenso}. `
    if (responsabilidades.length > 1) {
      for (let x = 1; x < responsabilidades.length; x++) {
        responsabilidadesExtenso += `${Utils.intToRoman(x + 1)}. ${Utils.convertNameToEntidade(responsabilidades[x])}. `
      }
    }

    let line5EndText = `${Utils.intToRoman(responsabilidades.length + 1 + offset)}. Título. ${Utils.intToRoman(responsabilidades.length + 2 + offset)}. Série.`

    let line5 = `${textAssuntosSecundario}${responsabilidadesExtenso}${line5EndText}\n`

    fichaObj.linha5 = line5
    // fichaTextArray.push(line5)

    if (ficha.cdu.length > 0) {
      let lineCDU = `CDU ${ficha.cdu}`
      fichaObj.linhaCDU = lineCDU
      // fichaTextArray.push(lineCDU)
    }

    if (ficha.cdd.length > 0) {
      let lineCDD = `CDD ${ficha.cdd}`
      fichaObj.linhaCDD = lineCDD
      // fichaTextArray.push(lineCDD)
    }

    //Cutter
    fichaObj.linhaCutter = ficha.cutter
    if (isPreview && ficha.cutter.length == 0)
      fichaObj.linhaCutter = "X000x"

    // if(withCutter) fichaObj.linhaCutter = await getCutter(responsabilidades[0],titulo)

    // let fichaText = fichaTextArray.join("\n")
    // exportToTxt(fichaText)

    return fichaObj
  }

  getDimensionsText(fichaDimensions: IFichaDimensions, isPreview = false): string {
    let dimensoes = ""
    if (fichaDimensions.width > 0 && fichaDimensions.height == 0)
      dimensoes = `${fichaDimensions.width} cm `
    if (fichaDimensions.width == 0 && fichaDimensions.height > 0)
      dimensoes = `${fichaDimensions.height} cm `
    if (fichaDimensions.width > 0 && fichaDimensions.height > 0)
      dimensoes = `${fichaDimensions.width}x${fichaDimensions.height} cm `

    if (isPreview && dimensoes.length == 0)
      dimensoes = "{Largura}x{Altura} cm "

    return dimensoes
  }

  async getCutter(name: string, title: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch(`api/tabela-cutter?name=${name}&title=${title}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data?.cutter)
          resolve(data?.cutter || "")
        })
    })
  }

  getCutter2(name: string, title: string): string {
    //Coloca sobrenome na frente
    let convertedName = Utils.formatText(name, "name")
    if (name.split(" ").length > 1) {
      convertedName = `${name.split(" ").slice(-1)[0]}, ${name.split(" ").slice(0, -1).join(" ")}`
    }
    let firstLetter = convertedName.split("")[0].toUpperCase()
    let firstTitleLetter = (title?.split("")[0] || "").toLowerCase()
    let data = (tabelaCutter as any)[firstLetter]
    let cutterNumber = 0
    let x = 0
    while (cutterNumber == 0) {
      let surname = convertedName.split(",")[0]
      if (x > 0) surname = surname.split("").slice(0, -x).join("")
      let foundKeys = Object.keys(data).filter(key => {
        return data[key].includes(surname)
      })
      // console.log(foundKeys)
      cutterNumber = +(foundKeys.length > 0 ? foundKeys[0] : 0)
      if (foundKeys.length > 1 && x == 0 && convertedName.split(",").length > 1) {
        let subName = convertedName.slice(0, convertedName.indexOf(" ") + 2) + "."
        // console.log("sub: ",subName)
        let findSubKey = foundKeys.find(key => data[key].includes(subName))
        if (findSubKey) cutterNumber = +findSubKey
      }
      // console.log(surname,cutterNumber)
      if (cutterNumber == 0) x++
    }
    let cutter = `${firstLetter}${cutterNumber}${firstTitleLetter}`
    return cutter
  }
}