import { fromEvent, of } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

export function App(sources) {
  const vtree$ = sources.DOM.select('input').events('change')
    .pipe(
      map(ev => { 
        return ev.target.checked
      }),
      startWith(false),
      map(toggled => {
        return <div>
          <input type="checkbox" />Toggle me
          <p>{toggled ? 'On' : 'Off'}</p>
        </div>
      })
    )
  
  const sinks = {
    DOM: vtree$
  }
  
  return sinks
}
