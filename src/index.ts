import express from "express"

import {
  LensGraph,
  initLensGraph,
  registerLens,
  applyLensToDoc,
  lensFromTo,
  LensSource
} from 'cambria'

export interface MigrationLens {
  from: string,
  to: string,
  lenses: LensSource
}

export interface Opts {
  version: string,
  action: string,
  migrations: MigrationLens[]
}

export function cambriaExpress(opts: Opts) {
  const regex = new RegExp(`^[/]([^/]*)[/]${opts.action}/(.*)$`,'i')
  // something is wrong if there is not a migration "to" the version we want
  if (!opts.migrations.find(m => m.to === opts.version)) {
    throw new RangeError(`migrations must contain a { to='${opts.version}' }`)
  }
  const graph = opts.migrations.reduce<LensGraph>(
    (graph, migration) => registerLens(graph, migration.from, migration.to, migration.lenses),
    initLensGraph())
  return function (req, res, next) {
    const match = regex.exec(req.url) || []
    const version = match[1]
    const rest = match[2]
    const body = req.body
    if (version && version != opts.version ) {
      req.url = `/${opts.version}/${opts.action}/${rest}`
      if (req.method === "POST") {
        // lens the body before the request is handled
        const lensStack = lensFromTo(graph, version, opts.version)
        req.body = applyLensToDoc(lensStack, req.body)
      }
      if (req.method === "GET") {
        // from and to is reversed in this direction
        const lensStack = lensFromTo(graph, opts.version, version)
        const originalJson = res.json
        // replace the res.json method to transform responses in the correct format
        res.json = function(obj: any){
          const newObj = applyLensToDoc(lensStack, obj)
          originalJson.apply(res, [newObj]);
        };
      }
    }
    next()
  }
}
