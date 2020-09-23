
### Cambria Express

This is a simple proof of concept of what it might look like to use [cambria]() to version rest calls via an express plugin.

A proper implementation would be far more full featured offering different lenses for input and output.

The [example code](https://github.com/inkandswitch/cambria-express/blob/default/example/index.ts) explains this best

The idea is that you only need to implement a single version of the REST api.  If you give CambriaExpress lenses between this version and others it can export them all, lensing input data before calling the canonical api, then reverse lensing the response back into the other format.

```ts
const migrations = [ ..., { from: "v1", to: "v2", lenses: [...] ]

const app = express()
app.use(express.json())
app.use("/api", cambriaExpress({ version: "v2", action: "task", migrations }))

app.get("/api/v2/task/:id", (req,res) => {
  //...
})

```
