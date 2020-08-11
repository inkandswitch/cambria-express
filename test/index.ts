
import * as assert from 'assert'
import { cambriaExpress } from '../src'
import { addProperty, wrapProperty, renameProperty } from 'cambria/dist/helpers'
import express from "express"
import request from "supertest"

describe("handle versioned apis", () => {
  it('abc', (done) => {
    let migrations = [
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
    let server = express()
    server.use(express.json())
    server.use("/api", cambriaExpress({ version: "v2", action: "task", migrations }))
    server.get("/api/v2/task/:id", (req,res) => {
      res.json({
        assignees: ["getv20","getv21"]
      })
    })
    server.post("/api/v2/task/:id", (req,res) => {
      assert.deepEqual({ assignees: [ "postv1" ] }, req.body)
      res.send("ok")
    })
    request(server)
    .post('/api/v1/task/123')
    .send({ assignee: "postv1" })
    .set('Accept', 'application/json')
    .expect(200).then((response) => {
      request(server)
      .get('/api/v1/task/123')
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body, { assignee: "getv20" })
      })
    }).then(done)
  });
})

