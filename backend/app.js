const express = require('express')
const cors = require('cors')
const PDFExtract = require('pdf.js-extract').PDFExtract
const bodyParser = require("body-parser");
const fs = require('fs')

const port = 3001

const pdfExtract = new PDFExtract()
const app = express()
const server = require("http").createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.get("/health", function (req, res) {
    res.json({ status: "OK" });
});

app.post('/loadFile', async function (req, res) {
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

    const b64 = req.body.historico
    if (!b64.split(',')[0].includes('pdf')) return res.status(400).json({ message: 'Arquivo não é um PDF' })

    fs.writeFileSync('./assets/historico.pdf', b64.split(';base64,').pop(), { encoding: 'base64' }, function (err) {
        console.log('File created');
    });

    const m = pdfExtract.extract('./assets/historico.pdf', {}, (err, data) => {
        if (err) return console.log('Erro --> ', err);
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
                if (nomes.length !== periodos.length || nomes.length !== mencoes.length || periodos.length !== mencoes.length) {
                    return false
                }

                for (let i = 0; i < Math.min(nomes.length, periodos.length, mencoes.length); i++) {
                    materias.push({ nome: nomes[i].str, periodo: periodos[i].str, mencao: mencoes[i].str })
                }
            }

            return res.status(200).json({ message: 'Arquivo carregado com sucesso!', materias })
        } catch (err) {
            console.log("Erro ---> ", err)
            return res.status(200).json({ message: 'Erro ao carregar arquivo!' })
        }
    });


});

server.listen(port);
console.log("Server is listening on port " + port);
