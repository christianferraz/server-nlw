import express from "express"

const app = express()

app.get('/', (req, res) => {
    return res.status(200).json([
        { id: 1, name: 'John', age: 34 }
    ])
})

app.listen(8000)