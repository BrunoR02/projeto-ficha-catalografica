
export default class InputUtils {
  
  public static numberFilter(e: React.KeyboardEvent<HTMLInputElement>, limitDigits = 2) {
    let textSelected = document?.getSelection()?.toString() || ""

    let limitNumber = 9
    let arrayLimit = []
    for (let x = 0; x < limitDigits; x++) {
      arrayLimit.push(9)
    }
    limitNumber = +arrayLimit.join("")

    const reg = new RegExp(`[0-9]{1,${limitDigits}}`)
    // const reg = /[0-9]{1,4}/
    let lastDigit = e.key
    let input = (e.target as HTMLInputElement).value + lastDigit;
    //Fazer o replace de texto selecionado manualmente.
    if (textSelected.length > 0) {
      input = input.replace(textSelected, "")
    }
    if (!(["Delete", "Backspace", "Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(lastDigit) || e.ctrlKey && lastDigit == "a") && Number.isNaN(+input) || (!Number.isNaN(+input) && !reg.test(input)) || (!Number.isNaN(+input) && +input > limitNumber)) {
      e.preventDefault();
    }
  }

  public static textFilter(e: React.KeyboardEvent<HTMLInputElement>, type: "normal" | "pontuacao" | "cdd" | "dimensao" = "normal", maxLength = 100) {
    let reg = new RegExp(`^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ ${type == "pontuacao" ? ".,:-" : ""}]+$`)
    if (type == "cdd") reg = /^([0-9.-]+)+$/
    if (type == "dimensao") reg = new RegExp("^[0-9]+(\.[0-9]{1,2})?$")
    // const reg = /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]+$/
    let lastDigit = e.key
    let inputLength = ((e.target as HTMLInputElement).value + lastDigit).length;
    // console.log(inputLength)
    if (!(["Delete", "Backspace", "Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key) || e.ctrlKey && e.key == "a") && (!reg.test(e.key) || inputLength > maxLength)) {
      e.preventDefault();
    }
  }
}