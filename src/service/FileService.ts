import { IFicha } from "@/interface/Interfaces";
import { Packer, Document as Doc, Paragraph, TextRun, AlignmentType, ParagraphChild, IBorderOptions } from "docx";

export default class FileService {

  exportToTxt(text: string) {
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "ficha.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element)
  }

  exportToPdf(blob: Blob, titulo: string) {
    // let blob = new Blob([buffer], {type: "application/pdf"});
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    let fileName = `Ficha Catalográfica - ${titulo}.pdf`;
    link.download = fileName;
    document.body.appendChild(link); // Required for this to work in FireFox
    link.click();
    document.body.removeChild(link)
  }

  exportToDocx(ficha: IFicha) {
    const styles = {
      section: {
        margin: { top: 10, right: 10, bottom: 100, left: 10 },
        border: { color: "000000", size: 1, style: "solid" }
      },
      text: { fontSize: 10, marginBottom: 10 },
      textIndent: { left: 20 },
      rightAligned: { alignment: AlignmentType.RIGHT }
    };

    // Define the content for the document
    const content = [
      { style: "text", text: "linha1" },
      { style: "textIndent", text: "linha2" },
      { style: "textIndent", text: "linha3" },
      { style: "textIndent", text: "linhaNota1" },
      { style: "textIndent", text: "linhaNota2" },
      { style: "textIndent", text: "linha4" },
      { style: "textIndent", text: "linha5" },
      { style: "rightAligned", text: "linhaCDU" },
      { style: "rightAligned", text: "linhaCDD" }
    ];

    let children: ParagraphChild[] = []

    children.push(new TextRun({
      text: ficha.linha1,
      font: { name: "Arial" }
    }))
    children.push(new TextRun({
      text: ficha.linha2,
      break: 2,
      font: { name: "Arial" }
    }))
    children.push(new TextRun({
      text: ficha.linha3,
      break: 1,
      font: { name: "Arial" }
    }))
    if (ficha.linhaNota1) {
      children.push(new TextRun({
        text: ficha.linhaNota1,
        break: 2,
        font: { name: "Arial" }
      }))
    }
    if (ficha.linhaNota2) {
      children.push(new TextRun({
        text: ficha.linhaNota2,
        break: !ficha.linhaNota1 ? 2 : 1,
        font: { name: "Arial" }
      }))
    }
    children.push(new TextRun({
      text: ficha.linha4,
      break: !ficha.linhaNota1 && !ficha.linhaNota2 ? 2 : 1,
      font: { name: "Arial" }
    }))
    children.push(new TextRun({
      text: "    " + ficha.linha5,
      break: 2,
      font: { name: "Arial" }
    }))
    if (ficha.linhaCDU) {
      children.push(new TextRun({
        text: ficha.linhaCDU,
        break: 2,
        font: { name: "Arial" }
      }))
    }
    if (ficha.linhaCDD) {
      children.push(new TextRun({
        text: ficha.linhaCDD,
        break: !ficha.linhaCDU ? 2 : 1,
        font: { name: "Arial" }
      }))
    }

    let borderStyle: IBorderOptions = {
      color: "auto",
      space: 1,
      style: "single",
      size: 6,
    }

    // Create a new document
    const doc = new Doc({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 500,
              bottom: 500,
              right: 500,
              left: 500,
            }
          }
        },
        children: [new Paragraph({
          border: {
            top: borderStyle,
            bottom: borderStyle,
            left: borderStyle,
            right: borderStyle
          },
          children
        })]
      }]
    });

    // const doc = new Doc({
    //   sections: [
    //     {
    //       properties: {
    //         page: {
    //           margin: {
    //             top: 10,
    //             right: 10,
    //             bottom: 10,
    //             left: 1000,
    //           }
    //         },
    //       },
    //       children: [
    //         new Paragraph({
    //           border:{
    //             top:{
    //               size:2,color:"#000000",style:"single"
    //             },
    //             bottom:{
    //               size:2,color:"#000000",style:"single"
    //             },
    //             left:{
    //               size:2,color:"#000000",style:"single"
    //             },
    //             right:{
    //               size:2,color:"#000000",style:"single"
    //             },
    //           },
    //           children: [
    //             new TextRun("Hello World"),
    //             new TextRun({
    //               text: "Foo bar",
    //               bold: true,
    //             }),
    //             new TextRun({
    //               children: [new Tab(), "Github is the best"],
    //               bold: true,
    //             }),
    //           ],
    //         }),
    //         new Paragraph({
    //           text: "Hello World",
    //           heading: HeadingLevel.HEADING_1,
    //         }),
    //         new Paragraph("Foo bar"),
    //         new Paragraph("Github is the best"),
    //       ],
    //     },
    //   ],
    // });

    Packer.toBlob(doc).then((buffer) => {
      // fs.writeFileSync("My Document.docx", buffer);
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(buffer);
      let fileName = "example.docx";
      link.download = fileName;
      document.body.appendChild(link); // Required for this to work in FireFox
      link.click();
      document.body.removeChild(link)
    });
  }
}