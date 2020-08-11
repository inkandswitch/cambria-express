import express from "express"
import { cambriaExpress } from '../src'
import { addProperty, wrapProperty, renameProperty } from 'cambria/dist/helpers'

const migrations = [
  {
    from: "mu",
    to: "v1",
    lenses: [addProperty({ name: 'assignee', type: 'array', arrayItemType: 'string' })],
  },
  {
    from: "v1",
    to: "v2",
    lenses: [wrapProperty("assignee"), renameProperty("assignee","assignees")]
  }
]

const DB = {}
const PORT = 3333

const app = express()
app.use(express.json())
app.use("/api", cambriaExpress({ version: "v2", action: "task", migrations }))

app.get("/api/v2/task/:id", (req,res) => {
  //console.log({ params: req.params })
  const record = DB[req.params.id]
  if (record) {
    res.json(record)
  } else {
    res.status(404).send('not found')
  }
})

app.post("/api/v2/task/:id", (req,res) => {
  //console.log({ params: req.params })
  DB[req.params.id] = req.body
  res.send("ok")
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

/*
curl -i -X POST http://localhost:3333/api/v2/task/1111 --header "Content-Type: application/json"  --data '{"assignees":["tom","joe"]}' 
curl -i -X POST http://localhost:3333/api/v1/task/2222 --header "Content-Type: application/json"  --data '{"assignee":"bob"}' 
curl -i http://localhost:3333/api/v1/task/1111 
curl -i http://localhost:3333/api/v2/task/2222 
*/

