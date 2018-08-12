import { fromEvent, of } from 'rxjs'
import { map, startWith, flatMap } from 'rxjs/operators'

export function App(sources) {
  /*start---> 例1  */
  const vtree$ = sources.DOM1.select('input').events('change')
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
  /* 例1 <---end*/

  /*start---> 例2 */
  const click$ = sources.DOM2.select('.get-random').events('click')

  const getRandomUser$ = click$.pipe(
    map(() => {
      const randomNum = Math.round(Math.random() * 9) + 1
      return {
        url: 'https://jsonplaceholder.typicode.com/users/' + String(randomNum),
        category: 'users',
        method: 'GET'
      }
    })
  )

  const responseUser$ = sources.HTTP.select('users').pipe(
      flatMap(res => res),
      map(res => res.body),
      startWith(null)
    )

  const vdom$ = responseUser$.pipe(
    map(user => {
      let userInfo = function(user) {
        return <div class="user-details">
          <h1 class="user-name">{user.name}</h1>
          <h4 class="user-email">{user.email}</h4>
          <a href={user.website} class="user-website">{user.website}</a>
        </div>
      }

      let r = <div class="users">
        <button class="get-random" value="获取随机用户"></button>
        {user === null ? null : userInfo(user)}
      </div>

      return r
    })
  )

  const sinks = {
    DOM1: vtree$,
    DOM2: vdom$,
    HTTP: getRandomUser$
  }
  /* 例2 <---end*/

  return sinks
}
