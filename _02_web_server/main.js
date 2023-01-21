/*
    require() : 모듈을 import 하겠다.
    express() : Creates an Express application.
*/
const express = require('express') // npm install express --save
const app = express()
/*
    서버가 만들어진다.
    터미널에 node main.js로 서버를 열면,
    브라우저에서 localhost:3000 으로 접속 가능.
*/
app.listen(3000, () => {
    console.log('3000번에 귀를 대고 듣기 시작했음.')
})

/*
    처리해주는 루틴들을 추가...
    app.get('목적지 폴더', call back 함수(request, response))  : client가 server에 get 요청 했을 때 처리해주는 명령어.
    request  : WB -> WS
    response : WS -> WB 

    app.post() : client가 server에  

    locathost:3000/about

    nodemon main.js : 소스코드가 변하면 자동으로 다시 서버를 실행시켜 준다.

    res.send() : web browser에게 response를 준다.

    __dirname : 현재 디렉터리 이름.
*/

/*
    script 경로로 들어오는 요청에 대해서는 __dirname + '/scripts' 로 가라.

    로컬 폴더 __dirname : main.js가 있는 폴더 위치
*/
app.use('/scripts', express.static(__dirname + '/scripts'))

app.get('/', (req, res) => {
    console.log(' ===> 루트에 대한 요청 들어왔음.')
    // res.send('루트에 대한 요청')
    res.sendFile(__dirname + '/pages/index.html')
})

app.get('/about', (req, res) => {
    console.log(' ===> about에 대한 요청 들어왔음.')
    // res.send('about에 대한 요청')
    res.sendFile(__dirname + '/pages/about.html')
})

app.get('/working', (req, res) => {
    console.log(' ===> working에 대한 요청 들어왔음.')
    res.sendFile(__dirname + '/pages/working.html')
})
