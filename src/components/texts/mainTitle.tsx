export default function MainTitle({text}:{text:string}){
  return (
    <h2 className="block text-3xl mb-4 text-white" style={{textShadow:"0px 2px black"}}>
      {text}
    </h2>
  )
}