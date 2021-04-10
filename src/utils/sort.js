const historico = require('../assets/historico.json')

const filters = {
    nome: function sortByName(a, b) {
        return a.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") > b.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    },
    periodo: function sortByPeriodo(a, b) {
        return a.periodo > b.periodo
    },
    mencao: function sortByMencao(a, b) {
        const mencoes = { SR: 0, II: 1, MI: 2, MM: 3, MS: 4, SS: 5, '-': -1, '--': -2, '---': -3 }
        return mencoes[a.mencao] > mencoes[b.mencao]
    }
}

const _mergeArrays = (a, b, filter) => {
    const c = []

    while (a.length && b.length) {
        const func = filters[filter]
        c.push(func(a[0], b[0]) ? b.shift() : a.shift())
    }

    while (a.length) {
        c.push(a.shift())
    }
    while (b.length) {
        c.push(b.shift())
    }

    return c
}

const mergeSort = (a, filter) => {
    if (a.length < 2) return a
    const middle = Math.floor(a.length / 2)
    const a_l = a.slice(0, middle)
    const a_r = a.slice(middle, a.length)
    const sorted_l = mergeSort(a_l, filter)
    const sorted_r = mergeSort(a_r, filter)
    return _mergeArrays(sorted_l, sorted_r, filter)
}

export const sort = (filter) => {
    const sortedHistorico = mergeSort(historico, filter)
    console.log(sortedHistorico)
}