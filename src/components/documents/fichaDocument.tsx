'use client'
import { Ficha } from '@/utils/Utils';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    display:"flex",
    justifyContent:"center",
    alignItems:"flex-end",
  },
  section: {
    margin: 10,
    marginBottom:100,
    padding: 10,
    width:283,
    border: "1px solid black"
  },
  text:{
    fontSize:10,
    marginBottom:10,
  },
  text2:{
    fontSize:10,
    textIndent:20
  },
  text3:{
    fontSize:10,
    marginBottom:10,
    textIndent:20
  },
  text4:{
    fontSize:10,
    marginRight: 5,
    textAlign:"right"
  }
});

// Create Document Component
export default function FichaDocument({ficha}:{ficha:Ficha}){
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
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
      </Page>
    </Document>
  )
}