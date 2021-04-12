const api = 'http://localhost:3001'

export const sendHistory = async (data) => {
    let response = {}

    try {
        response = await fetch(`${api}/loadFile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                historico: data,
            }),
        })
    } catch (err) {
        console.log(err)
    }

    return {
        status: response.status,
        body: response.status === 200 ? await response.json() : null,
    }
}
