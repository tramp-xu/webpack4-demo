import './style.css'

import printMe from './print'
import { cube } from './math'

printMe()
let a = cube(3)
console.log(a)

if (module.hot) {
  module.hot.accept('./print.js', function () {
    console.log('Accepting the updated printMe module!')
    printMe()
  })
}
