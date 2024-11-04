
export default class StringUtils {

  public static isStringValid(text: string, minLength: number = 1) {
    if(typeof text !== 'string')
      return false
    if(text.trim().length < minLength)
      return false

    return true
  }
}