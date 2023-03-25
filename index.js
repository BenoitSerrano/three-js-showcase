import express from "express"
import { config } from "dotenv"

config()

const app = express()

app.use(express.static('dist'));

app.listen(process.env.PORT, () => {
    console.log("Listening")
})
