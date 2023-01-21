

// console.log('hello, node js')   

/* 
    control shift ` = 터미널 실행
*/

/* 
    함수 
*/
// function sayHello(name) {
//     console.log('Hello ' + name)
// }

// sayHello('John')
// sayHello('Alice')

// const v = 3

// if (v > 5) {
//     console.log('It is a big number')
// }
// else {
//     console.log('작은 숫자입니다.')
// }


/* 
    3초에 한 번씩 주지적으로 출력 
*/
// setInterval(()=>{
//     console.log('Nodejs 연습 중...')
// }, 3000)


/* 
    3초 뒤, 한 번만 실행 
*/
// setTimeout(()=>{
//     console.log('타임아웃, 한 번만 실행')
// }, 3000)

/* 
    Module 함수. 라이브러리
    logger.js --> showLogMessage
*/

const logger = require('./logger.js')   // logger.js 모듈을 불러온다.
// const logger = require('./logger')   // .js를 붙이지 않아도 가능하다.

logger.showLogMessage('모듈에 대한 테스트 중입니다.')
logger.secondLog(`두 번째 로그 메시지`)
console.log('Logger 모듈에 들어있는 소중한 값은: ' + logger.pvalue)

// logger.showLogMessage2('과연 외부 이름이 아니라 내부 이름으로도 가능?')  ---> 불가능... export한 이름으로만 가능하다.

