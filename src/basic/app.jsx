import { fromEvent, of, merge as RxMerge, combineLatest, timer } from 'rxjs'
import { map, startWith, flatMap, mapTo, scan, reduce } from 'rxjs/operators'

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

  const vdom2$ = responseUser$.pipe(
    map(user => {
      let userInfo = function(user) {
        return <div className="user-details">
          <h1 className="user-name">{user.name}</h1>
          <h4 className="user-email">{user.email}</h4>
          <a href={user.website} className="user-website">{user.website}</a>
        </div>
      }

      let r = <div class="users">
        <button className="get-random">获取随机用户</button>
        {user === null ? null : userInfo(user)}
      </div>

      return r
    })
  )
  /* 例2 <---end*/
  
  /*start---> 例3 */
  const action$ = RxMerge(
    sources.DOM3.select('.dec').events('click').pipe(mapTo(-1)),
    sources.DOM3.select('.inc').events('click').pipe(mapTo(1))
  )

  const counter$ = action$.pipe(
    startWith(0),
    scan((prev, cur) => {
      return prev + cur
    }, 0)
  )

  const vdom3$ = counter$.pipe(
    map(count => {
      return <div>
        <button className="dec">减1</button>
        <button className="inc">加1</button>
        <p>Counter: {count}</p>
      </div>
    })
  )
  /* 例3 <---end*/

  /*start---> 例4 */
  const changeWeight$ = sources.DOM4.select('.weight').events('input')
    .pipe(
      map(event => {
        return event.target.value
      }),
      startWith(70)
    )

  const changeHeight$ = sources.DOM4.select('.height').events('input')
    .pipe(
      map(event => {
        return event.target.value
      }),
      startWith(170)
    )

  const bmi$ = combineLatest(changeWeight$, changeHeight$)
    .pipe(
      map(([weight, height]) => {
        weight = Number(weight)
        height = Number(height)
        const heightMeters = height * 0.01
        return { weight, height, bmi: Math.round(weight / (heightMeters * heightMeters)) }
      })
    )

  const vdom4$ = bmi$
    .pipe(
      map(({ weight, height, bmi}) => {
        return <div>
          <div>
            <span>Weight</span> 
            <input className="weight" type="range" min="40" max="140" />
            <span>{weight}kg</span>
          </div>
          <div>
            <span>Height</span>
            <input className="height" type="range" min="140" max="210" />
            <span>{height}cm</span>
          </div>
          <h2>BMI is {bmi}</h2>
        </div>
      })
    )
  /* 例4 <---end*/

  /*start---> 例5 */
  /* 例5 <---end*/

  const sinks = {
    DOM1: vtree$,
    DOM2: vdom2$,
    DOM3: vdom3$,
    DOM4: vdom4$,
    DOM5: view(model(intent(sources.DOM5))),
    HTTP: getRandomUser$
  }

  return sinks
}

function intent(domSource) {
  return {
    changeWeight$: domSource.select('.weight').events('input')
      .pipe(
        map(ev => ev.target.value)
      ),
      
    changeHeight$: domSource.select('.height').events('input')
      .pipe(
        map(ev => ev.target.value)
      )
  }
}

function model(actions) {
  const weight$ = actions.changeWeight$.pipe(
    startWith(70)
  )

  const height$ = actions.changeHeight$.pipe(
    startWith(170)
  )

  return combineLatest(weight$, height$)
    .pipe(
      map(([weight, height]) => {
        weight = Number(weight)
        height = Number(height)
    
        return { weight, height, bmi: bmi(weight, height) }
      })
    )
}

function view(state$) {
  return state$.pipe(
    map(({ weight, height, bmi}) => {
      return <div>
        {renderWeightSlider(weight)}
        {renderHeightSlider(height)}
        <h2>BMI is {bmi}</h2>
      </div>
    })
  )
}

function bmi(weight, height) {
  const heightMeters = height * 0.01
  return Math.round(weight / (heightMeters * heightMeters))
}

// Don't Repeat Yourself
function renderWeightSlider(weight) {
  return renderSlider('Weight', weight, 'kg', 'weight', 40, 140)
  // return <div>
  //   <span>Weight</span>
  //   <input className="weight" type="range" min="40" max="140" />
  //   <span>{weight}kg</span>
  // </div>
}

// Don't Repeat Yourself
function renderHeightSlider(height) {
  return renderSlider('Height', height, 'cm', 'height', 140, 210)
  // return <div>
  //   <span>Height</span>
  //   <input className="height" type="range" min="140" max="210" />
  //   <span>{height}cm</span>
  // </div>
}

// NOTE: 但这种方式并不好，所以我们需要component
function renderSlider(label, value, unit, className, min, max) {
  return <div>
    <span>{label}</span>
    <input className={className} type="range" min={min} max={max} />
    <span>{value}{unit}</span>
  </div>
}