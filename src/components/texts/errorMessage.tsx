export default function ErrorMessage({message}:{message:string}){

  return (
    <span className="absolute translate-y-16 text-esm text-red-500" style={{textShadow:"1px 1px #a70000"}}>{message}</span>
  )
}