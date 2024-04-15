import { NextRequest, NextResponse } from "next/server"
import fsPromises from "fs/promises"

export async function GET(request: NextRequest ){

  const name = request.nextUrl.searchParams.get("name") || ""
  const title = request.nextUrl.searchParams.get("title") || ""
  if(name.length==0 || title.length==0){
    return NextResponse.json({message:"Invalid query params"},{status:400})
  }
  //Coloca sobrenome na frente`
  let convertedName = name
  if(name.split(" ").length>1){
    convertedName = `${name.split(" ").slice(-1)[0]}, ${name.split(" ").slice(0,-1).join(" ")}`
  } 

  // console.log(convertedName)
  
  let firstLetter = convertedName.split("")[0].toUpperCase()
  let firstTitleLetter = title.split("")[0].toLowerCase()

  let data:any = {}
  let cutterNumber = 0
  try{
    let files = await fsPromises.readdir(`./tabela-cutter`)
    let findIndex = files.findIndex(file=>file.includes(firstLetter))
    const jsonData = await fsPromises.readFile(`./tabela-cutter/${files[findIndex]}`)
    data = JSON.parse(jsonData.toString())[firstLetter]

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
  } catch(error){
    console.log(error)
    return NextResponse.json({message:"Error reading tabela-cutter"},{status:400})
  }

  let cutter = `${firstLetter}${cutterNumber}${firstTitleLetter}`
  console.log("Cutter: ",cutter)

  return NextResponse.json({cutter},{status:200})
}