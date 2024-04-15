'use client'
import { Ficha } from '@/utils/Utils';
import { CSSProperties } from 'react';

// Create Document Component
export default function FichaPreview({ficha}:{ficha:Ficha}){
  let fontSize = 13
  
  // Create styles
  const section:CSSProperties= {
      backgroundColor: '#FFF',
      color:"#000",
      marginBottom:0,
      padding: 5,
      paddingLeft:7,
      display:"flex",
      flexDirection:"row",
      border: "1px solid black",
      borderColor:"#000",
      width:"100%"
    },
    section2:CSSProperties={
      display:"flex",
      flexDirection:"column",
      flexWrap:"wrap",
    },
    text={
      fontSize:fontSize,
      marginBottom:7,
      marginTop:7,
      width:"100%",
    },
    text2={
      fontSize:fontSize,
      textIndent:20,
      width:"100%",
    },
    text3={
      fontSize:fontSize,
      marginBottom:10,
      textIndent:20,
      width:"100%"
    },
    text4:CSSProperties={
      fontSize:fontSize,
      textAlign:"left",
      alignSelf:"flex-end",
      width:"40%"
    },
    text5:CSSProperties={
      fontSize:fontSize,
      marginTop:33,
      marginRight:5,
      width:"1.5cm"
    }

  return (
    <div style={section}>
      <section style={section2}>
        <p style={text5}>{ficha.linhaCutter}</p>
      </section>
      <section style={section2}>
        <p style={text}>{ficha.linha1}</p>
        <p style={text2}>{ficha.linha2}</p>
        <p style={text3}>{ficha.linha3}</p>
        {ficha.linhaNota1&&<p style={text2}>{ficha.linhaNota1}</p>}
        {ficha.linhaNota2&&<p style={text2}>{ficha.linhaNota2}</p>}
        <p style={text3}>{ficha.linha4}</p>
        <p style={text3}>{ficha.linha5}</p>
        {ficha.linhaCDU&&<p style={text4}>{ficha.linhaCDU}</p>}
        {ficha.linhaCDD&&<p style={text4}>{ficha.linhaCDD}</p>}
      </section>
    </div>
  )
}