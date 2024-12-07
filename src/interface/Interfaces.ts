
export interface IFichaFormType {
  responsabilidades: string[],
  titulo: string,
  formato: string,
  subtitulo: string,
  tradutor: string,
  edicao: number,
  edicaoObs: string,
  dataPub: string,
  local: string,
  nomeEditora: string,
  numPag: number,
  dimensoes: IFichaDimensions,
  temIlustracao: boolean,
  temCor: boolean,
  nomeSerie: string,
  numSerie: number,
  isbn: number,
  nota1: string,
  nota2: string,
  assuntosSecundario: string[],
  cdd: string,
  cdu: string,
  cutter: string
}

export interface IFichaDimensions {
  width: number,
  height: number
}

export interface IFicha {
  linhaCutter?: string
  linha1: string
  linha2: string
  linha3: string
  linhaNota1?: string
  linhaNota2?: string
  linha4: string
  linha5: string
  linhaCDD?: string
  linhaCDU?: string
}

export interface IRadioInputOption {
  label: string
  value: string
}