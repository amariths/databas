const { v4: uuidv4 } = require('uuid')
const express = require('express'),
    sqlite = require('sqlite'),
    sqlite3 = require('sqlite3')

let database
;(async () => {
    database = await sqlite.open({
        driver: sqlite3.Database,
        filename: 'test.sqlite'
    })

    console.log('Redo att göra databasanrop')
})()



const app = express()
app.use(express.json())



app.get('/messages', async (request, response) => {
    const cities = await database.all('SELECT * FROM messages ORDER BY created')

    response.send(cities)
})





app.post('/login', async (request, response) => {



    if (
        request.body.email === undefined ||
        request.body.password === undefined
    ) {
        response.status(400).send()
        return
    }
    else {


        const cities1 = await database.all(
            'SELECT * FROM accounts WHERE email=?',
            [request.body.email]
        )
        /*const cities2 = await database.all(
            'SELECT * FROM accounts WHERE password=?',
            [request.body.password]
        )*/


        const c = cities1.find(
            (item) =>
                item.email === request.body.email &&
                item.password === request.body.password
        )

        /*const c1 = cities2.find(
            (item) =>
                item.email === request.body.email ||
                item.password === request.body.password
        )*/



        if (c !== undefined)  {

            response.status(201)
            const id = uuidv4()


            await database.run('INSERT INTO tokens (account_id, token) VALUES (?, ?)', [
            c.id,
                id
            ])


            const k = await database.all('SELECT token FROM tokens')

        const k1 = k.find((item) => item.token === id)

            response.send(k1)

        } else {
            response.status(401).send('failed')
            return
        }
    }
})

app.listen(8080, () => {
    console.log('Redo på http://localhost:8080/')
})
