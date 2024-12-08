

export default class Utils {
  
  public static intToRoman(integer: number): string {
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

  public static formatText(text: string, type: "name" | "normal" = "normal"): string {
    if (text?.length == 0) 
      return text

    if (type == "name") {
      return text.split(" ").map(item => {
        if (item.length == 0) return item
        return item.split("")[0].toUpperCase() + item.split("").slice(1).join("").toLowerCase()
      }).join(" ")
    } else {
      return text.split("")[0].toUpperCase() + text.split("").slice(1).join("").toLowerCase()
    }
  }

  public static convertNameToEntidade(name: string) {
    if (!name) return ""
    let convertedName = `${name}`
    let words = name.split(" ").filter(word => word)
    if (words.length > 1) {
      convertedName = `${words.slice(-1)[0]}, ${words.slice(0, -1).join(" ")}`
    }
    return convertedName
  }
}

