const fs = require('fs');
const PDFExtract = require('pdf.js-extract').PDFExtract
const pdfExtract = new PDFExtract()

// Pontos do eixo X do PDF em que está cada informação desejada
const coords = {
    nome: {
        x: 129
    },
    periodo: {
        bottomLimit: 41.3,
        topLimit: 43.24,
        extremeTopLimit: 50
    },
    mencao: {
        bottomLimit: 507.67,
        topLimit: 512.33,
        options: []
    }
}

const mencoesOptions = ['SR', 'II', 'MI', 'MM', 'MS', 'SS', '-', '---']

export const loadFile = () => {
    return pdfExtract.extract('./src/assets/historico1.pdf', {}, (err, data) => {
        if (err) return console.log(err);
        try {
            const materias = []
            for (let page of data.pages) {

                let nomes = page.content.filter(content => content.x === coords.nome.x)
                for (let i = 1; i < nomes.length;) {
                    if (parseFloat(nomes[i].y - nomes[i - 1].y) < 8.6) {
                        nomes[i - 1].str = nomes[i - 1].str + ' ' + nomes[i].str
                        nomes[i - 1].y = nomes[i].y
                        nomes.splice(i, 1)
                    } else i++;
                }

                let periodos = page.content.filter(content => content.x >= coords.periodo.bottomLimit && ((content.x <= coords.periodo.topLimit && parseInt(content.str)) || (content.str === '--' && content.x <= coords.periodo.extremeTopLimit)))
                let mencoes = page.content.filter(content => content.x >= coords.mencao.bottomLimit && content.x <= coords.mencao.topLimit && mencoesOptions.includes(content.str))

                if (!nomes || !periodos || !mencoes) {
                    return false
                }
                if (nomes.length != periodos.length || nomes.length !== mencoes.length || periodos.length !== mencoes.length) {
                    return false
                }

                for (let i = 0; i < Math.min(nomes.length, periodos.length, mencoes.length); i++) {
                    materias.push({ nome: nomes[i].str, periodo: periodos[i].str, mencao: mencoes[i].str })
                }
            }
            fs.writeFile('./src/assets/historico.json', JSON.stringify(materias), function (err) {
                if (err) throw err;
                console.log('Arquivo Salvo!');
            });
        } catch (err) {
            console.log("Erro ---> ", err)
            return false
        }
    });
}