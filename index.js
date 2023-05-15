


// cities server

/*
const express = require('express')
const { v4: uuidv4 } = require('uuid')

const app = express()

app.use(express.json())

const cities = [
    {
        id: '5347da70-fef3-4e8f-ba49-e8010edba878',
        name: 'Stockholm',
        population: 1372565
    },
    {
        id: '4787e794-b3ac-4a63-bba0-03203f78e553',
        name: 'Göteborg',
        population: 549839
    },
    {
        id: '4bc43d96-3e84-4695-b777-365dbed33f89',
        name: 'Malmö',
        population: 280415
    },
    {
        id: 'ec6b9039-9afb-4632-81aa-ff95338a011a',
        name: 'Uppsala',
        population: 140454
    },
    {
        id: '6f9eee1f-b582-4c84-95df-393e443a2cae',
        name: 'Västerås',
        population: 110877
    },
    {
        id: '27acb7a0-2b3d-441f-a556-bec0e430992a',
        name: 'Örebro',
        population: 107038
    },
    {
        id: '6745e3f4-636a-4ab7-8626-2311120c92c9',
        name: 'Linköping',
        population: 104232
    },
    {
        id: 'a8a70019-9382-4215-a5b3-6278eb9232c3',
        name: 'Helsingborg',
        population: 97122
    },
    {
        id: '6fc1a491-3710-42f2-936d-e9bf9be4f915',
        name: 'Jönköping',
        population: 89396
    },
    {
        id: '45428195-ab40-43d2-ad11-a62933f4a3a8',
        name: 'Norrköping',
        population: 87247
    }
]

app.get('/:id', (request, response) => {
    const id = cities.find((item) => item.id === request.params.id)

    console.log(id)

    if (!id) {
        response.status(404).send()
    } else {
        response.send(id)
    }
})

app.get('/', (request, response) => {
    let result = cities

    if (request.query.maxPopulation) {
        result = result.filter(
            (city) => city.population <= request.query.maxPopulation
        )
    }

    if (request.query.minPopulation) {
        result = result.filter(
            (city) => city.population >= request.query.minPopulation
        )
    }

    if (request.query.name) {
        result = result.filter(
            (city) =>
                city.name
                    .toLowerCase()
                    .indexOf(request.query.name.toLowerCase()) !== -1
        )
    }

    response.send(result)
})

app.delete('/:id', (request, response) => {
    const id = cities.find((item) => item.id === request.params.id)

    if (id === undefined) {
        response.status(404).send()

        return
    }

    cities.splice(cities.indexOf(id), 1)
    response.send(id)
})

app.post('/', (request, response) => {
    let newCity = {
        id: uuidv4()
    }

    const uni = cities.find((item) => item.name === request.body.name)

    if (request.body.name !== undefined) {
        if (uni !== undefined) {
            response.status(409).send()
            return
        } else {
        newCity.name = request.body.name
        }
    }
    if (request.body.population !== undefined) {
        newCity.population = request.body.population
    }

    const uni2 = cities.filter((item) => item.name === newCity.name)
    console.log(uni2)

    if (
        newCity.name === undefined ||
        typeof newCity.name !== 'string' ||
        newCity.name === '' ||
        newCity.population === undefined ||
        typeof newCity.population !== 'number' ||
        newCity.population < 0 ||
        !Number.isInteger(newCity.population)
    ) {
        response.status(400).send()
        return
    }  else {
        response.status(201)
        cities.push(newCity)
    }


    response.send(cities)
})

app.listen(8080, () => {
    console.log('Redo på http://localhost:8080/')
})

*/

// ta emot json och formulär
/*
const express = require('express')

const app = express()
const multer = require('multer')
const upload = multer({ dest: 'public/' })
const accounts = {}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

function isValid(body) {
    return body.email !== undefined && body.password !== undefined
}

app.get('/', (request, response) => {
    console.log(request.body)
    response.send(`
        <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Meddelandeformulär</title>
    </head>
    <body>
        <h1>Posta ett meddelande</h1>
        <form action="http://localhost:8080/" enctype="multipart/form-data" method="post">
        <label>
            Namn:
            <input name="name" placeholder="Namn" value="">
        </label>
        <label>
            Text:
            <input name="text" placeholder="Text" value="">
        </label>
        <label>
        Bild:
        <input name="image" type="file">
      </label>
        <input type="submit" value="Skicka">
        </form>
    </body>
    </html>
        `)
})

let arr = []

app.post('/', upload.single('image'), (request, response) => {
    const message = {
        name: request.body.name,
        text: request.body.text
    }


    if (request.file) {
       message.image = request.file
    }

    arr.push(message)
    console.log(arr)

    response.send(`
        <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Meddelanden</title>
        </head>
        <body>
        <h1>Meddelanden</h1>
    <dl>
        ${arr
            .map((arrs) => {
                let imageElement = ''
                if (arrs.image) {
                    const imagePath = `/public/${arrs.image.filename}`
                    imageElement = `<img src="${imagePath}" alt="Uploaded image" />`
                }

          return `
        <dt>${arrs.name}</dt>
        <dd>${arrs.text}</dd>
        <dd>${imageElement}</dd>

        `
            })
            .join('')}
    </dl>
        <nav><a href="/">Nytt meddelande</a></nav>
        </body>
        </html>
        `)
})

app.post('/create-accounts', (request, response) => {
    if (request.body.some((value) => !isValid(value))) {
        response.status(400).send()
        return
    }

    if (request.body.some((value) => accounts[value.email] !== undefined)) {
        response.status(409)
    } else {
        request.body.forEach((value) => {
            accounts[value.email] = value.password
        })
        response.status(201)
    }

    response.send()
})

app.post('/create-account', (request, response) => {
    if (!isValid(request.body)) {
        response.status(400).send()

        return
    }

    if (accounts[request.body.email] === undefined) {
        accounts[request.body.email] = request.body.password
        response.status(201)
    } else {
        response.status(409)
    }

    response.send()
})

app.post('/login', (request, response) => {
    if (!isValid(request.body)) {
        response.status(400).send()

        return
    }

    if (accounts[request.body.email] === request.body.password) {
        response.status(200)
    } else {
        response.status(401)
    }

    response.send()
})

app.use('/public', express.static('public'))

app.listen(8080, () => {
    console.log('Redo på http://localhost:8080/')
})

*/

//express med parameters
/*
const express = require('express')

const app = express()

let num = 0

//2a160d03-d430-4ce4-a79c-2cb14f626ee4



app.get('/count', (request, response) => {
    response.status(200)
    response.send(`${num}`)
})

app.get('/add', (request, response) => {
     num = 0



    const keys = Object.keys(request.query.x)



    if (keys.length === 0) {
        response.status(400).send('missing')

        return
    } else {
        response.status(200)

        for (i = 0; i < request.query.x.length; i++) {

            num += Number(request.query.x[i])

        }
        return response.send(num.toString())
    }






})

app.listen(8080, () => {
    console.log('Redo på http://localhost:8080/')
})
*/

// med express
/*
const express = require('express')
const app = express()
var useragent = require('express-useragent')

app.use(useragent.express())

let num = 0
let arr = []
const today = new Date()
const now = today.toISOString()

app.get('/', (request, response) => {

    response.send('Hejsan svejsan')

    let obj = {
        userAgent: request.useragent.source,
        time: now
    }

    response.send(arr.push(obj))
    response.status(200)
    response.end()
})

app.get('/log', (request, response) => {
    response.status(200)

    let html = ''

    for (let i = 0; i < arr.length; i++) {
        html += `<dt>${arr[i].time}</dt><dd>${arr[i].userAgent}</dd>`
    }

    response.format({
        'application/json': () => {
            response.send(arr)
        },
        'text/html': () => {
            response.send(`<dl>${html}</dl>`)
        },
        default: () => {
            response.send(arr)
        }
    })

    response.send(arr)
    response.end()
})

app.delete('/log', (request, response) => {
    response.status(200)
    response.send((arr.length = 0))
    response.end()
})

app.post('/increment', (request, response) => {
    response.send(`${(num += 1)}`)
})

app.listen(8080, () => {
    console.log('Redo på http://localhost:8080/')
})


*/

// without express
/*
const http = require('http')

let num = 0
let n = 1

const app = http.createServer((request, response) => {
    if (request.url === '/') {
        response.write('Hejsan svejsan')
    } else if (request.url === '/foo') {
        response.write('bar')
    } else if (request.url === '/baz') {
        response.write('qux')
    } else if (request.url === '/count' && request.method === 'GET') {
        response.write(`${num}`)
    } else if (request.url === '/increment' && request.method === 'POST') {
        response.write(`${(num += 1)}`)
    } else if (request.url.startsWith(`/add/`) && request.method === 'POST') {
        response.write(`${(num += Number(request.url.split(`/`)[2]))}`)
    } else if (request.url === '/count' && request.method !== 'GET') {
        response.statusCode = 405
    } else if (request.url === '/increment' && request.method !== 'POST') {
        response.statusCode = 405
    } else {
        response.statusCode = 404
    }
    response.end()
})

app.listen({ port: 3000 }, () => {
    console.log('Redo på http://localhost:3000/')
})

const app2 = http.createServer((request, response) => {
    response.statusCode = 302
    response.setHeader('location', 'http://localhost:3000/')
    response.end()
})
app2.listen({ port: 8080 })
*/
