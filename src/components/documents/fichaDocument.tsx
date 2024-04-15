'use client'
import { Ficha } from '@/utils/Utils';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create Document Component
export default function FichaDocument({ficha,preview=false}:{ficha:Ficha,preview?:boolean}){

  let fontSize = preview?13:10
  
  // Create styles
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      display:"flex",
      justifyContent:"center",
      alignItems:"flex-end",
    },
    section: {
      backgroundColor: '#FFF',
      color:"#000",
      marginBottom:preview?0:100,
      padding: 5,
      paddingLeft:preview?7:5,
      display:"flex",
      flexDirection:"row",
      border: "1px solid black",
      borderColor:"#000",
      width:preview?"100%":"12.5cm"
    },
    section2:{
      display:"flex",
      flexDirection:"column",
      flexWrap:"wrap",
    },
    text:{
      fontSize:fontSize,
      marginBottom:preview?7:9,
      marginTop:7,
      width:preview?"100%":"85%",
    },
    text2:{
      fontSize:fontSize,
      textIndent:preview?20:15,
      width:preview?"100%":"85%",
    },
    text3:{
      fontSize:fontSize,
      marginBottom:10,
      textIndent:preview?20:15,
      width:preview?"100%":"85%"
    },
    text4:{
      fontSize:fontSize,
      paddingLeft:180,
      textAlign:"left",
    },
    text5:{
      fontSize:fontSize,
      marginTop:preview?33:27,
      marginRight:5,
      width:"1.3cm"
    }
  });
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.section2}>
            <Text style={styles.text5}>{ficha.linhaCutter}</Text>
          </View>
          <View style={styles.section2}>
            <Text style={styles.text}>{ficha.linha1}</Text>
            <Text style={styles.text2}>{ficha.linha2}</Text>
            <Text style={styles.text3}>{ficha.linha3}</Text>
            {ficha.linhaNota1&&<Text style={styles.text2}>{ficha.linhaNota1}</Text>}
            {ficha.linhaNota2&&<Text style={styles.text2}>{ficha.linhaNota2}</Text>}
            <Text style={styles.text3}>{ficha.linha4}</Text>
            <Text style={styles.text3}>{ficha.linha5}</Text>
            {ficha.linhaCDU&&<Text style={styles.text4}>{ficha.linhaCDU}</Text>}
            {ficha.linhaCDD&&<Text style={styles.text4}>{ficha.linhaCDD}</Text>}
          </View>
        </View>
      </Page>
    </Document>
  )
}