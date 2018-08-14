import './index.styl'

import { run } from '@cycle/rxjs-run'
import { makeDOMDriver } from '@cycle/dom'
import { makeHTTPDriver } from '@cycle/http'
import { App } from './app'

const main = App

const drivers = {
  DOM1: makeDOMDriver('#app1'),
  DOM2: makeDOMDriver('#app2'),
  DOM3: makeDOMDriver('#app3'),
  DOM4: makeDOMDriver('#app4'),
  HTTP: makeHTTPDriver()
}

run(main, drivers)
