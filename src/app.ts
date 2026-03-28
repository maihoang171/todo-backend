import express, { urlencoded } from "express";
import type {Request, Response} from "express";
import 'dotenv/config'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Welcome to Todo App API"
    })
})

app.listen(port, ()=> {
    console.log(`The server is running at http://localhost:${port}`)
})
