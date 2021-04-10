const coords = {
    nome: {
        x: 129
    },
    periodo: {
        x: 41
    },
    mencao: {
        x: 508
    }
}

const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
pdfExtract.extract('./src/assets/historico_180114689.pdf', {}, (err, data) => {
    if (err) return console.log(err);
    for (let page of data.pages) {
        const nomes = page.content.filter((content, index) => content.x === coords.nome.x)
        console.log(nomes)
    }
});