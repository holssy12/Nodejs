const express = require('express')  // 서버가 WB와 통신할 때 쓴다.
const mariadb = require('mysql');      // 서버가 DB와 통신할 때 쓴다.
const { type } = require('os');
const path = require('path')
const static = require('serve-static')
const dbconfig = require('./config/dbconfig.json');

/*
    Database connection pool

    pool을 만들어 node에서 DB로 갈 수 있는 Connection을 여러개 만들어 놓는다.
    필요시 할당하고, 끝나면 다시 준비상태로 두면서 돌아가는 듯.
*/
const pool = mariadb.createPool({
    connectionLimit: 10, // 사용할 Connection 개수 제한.

    // 아래는 중요한 정보들로, 소스코드 상에서 노출되지 않도록
    // 따로 json 파일을 만들어서 불러와주도록 한다.
    //
    // host: '122.32.33.22',
    // user: 'admin',
    // password: 'veryimportant',
    // database: 'FirstDatabase',  // Default Schema

    host: dbconfig.host,
    port: dbconfig.port,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,

    debug: false        // Debug messsage 띄울 것인지 결정.
})

const app = express()

/*
    URL( Uniform Resource Locator )

    WB가 URL을 이용해 맞는 서버로 찾아가서 요청한다.
*/
app.use(express.urlencoded({ extended: true })) // 확장된 URL encoding 방법을 지원하겠다?

app.use(express.json()) // JSON 형태로 와도 해석하겠다.

/*
    public이라는 디렉토리를 사용할 건데,
    그 디렉토리의 위치는 현재 디렉토리/public이다. ( join으로 ./pulbic으로 되게 한다.)
*/
app.use('/public', static(path.join(__dirname, '/public')))

/*
    WB로부터 post 명령으로 들어오는 /process/adduser에 대한 요청은,
    뒤에 들어가는 함수롤 처리하겠다.
*/
app.post('/process/adduser', (req, res) => {
    console.log('process/adduser 호출됨' + req)

    /*
        app.use(express.urlencoded({ extended: true }))
        app.use(express.json())

        위 두 line으로 인해, 전달받은 request의 데이터를 깔끔한 형태로 해석하여 처리할 수 있게 된다.
    */
    const paramId = req.body.id;
    const paramName = req.body.name;
    const paramAge = req.body.age;
    const paramPassword = req.body.password;

    /*
        놀고 있는 connection 하나 줘라.
        err  : 놀고 있는 connection이 없을 때 주는 것
        conn : connection을 성공적으로 준 것.
    */
    pool.getConnection((err, conn) => {

        // err가 null이 아니면, err가 있다는 뜻.
        if (err) {
            //conn.release();
            console.log('MariaDB get connection error. aborted');

            // WB에게 줄 응답으로, html page를 만들어서 보내준다.
            //  -> 콘솔 뿐만 아니라, 사용자에게도 답장을 주어야 한다.
            res.writeHead('200', { 'Content-type': 'text/html; charset=utf8' })
            res.write('<h2>DB서버 연결 실패</h2>')
            res.end();

            return;
        }

        console.log('데이터베이스 연결 끈 얻었음!');

        // 실제 SQL문으로 row를 넣어준다. 단, password는 함수를 사용해 넣어준다.
        // 들어가는 데이터는 ?로 해준다.
        const exec = conn.query('insert into users (id, name, age, password) values (?,?,?,password(?));',
            [paramId, paramName, paramAge, paramPassword],

            // query를 수행하고 나서 수행되는 함수.
            (err, result) => {
                conn.release() // 사용된 connection을 다시 대기 상태로 만들어준다.
                console.log("실행된 SQL: " + exec.sql)

                // Error 발생 시.
                if (err) {
                    console.log('SQL 실행시 오류 발생')
                    console.dir(err) // Error 세부 정보를 보기 위해 디렉토리를 부른다?

                    // WB에게 줄 응답으로, html page를 만들어서 보내준다.
                    res.writeHead('200', { 'Content-type': 'text/html; charset=utf8' })
                    res.write('<h2>SQL 실행 실패</h2>')
                    res.end();

                    return
                }

                if (result) { // 성공적으로 수행된 경우.
                    console.dir(result)
                    console.log('Inserted 성공')

                    // WB에게 줄 응답으로, html page를 만들어서 보내준다.
                    res.writeHead('200', { 'Content-type': 'text/html; charset=utf8' })
                    res.write('<h2>사용자 추가 성공</h2>')
                    res.end();
                }
                else { // 수행되긴 했는데 제대로 되지 않은 경우.
                    console.log('Inserted 실패')

                    res.writeHead('200', { 'Content-type': 'text/html; charset=utf8' })
                    res.write('<h2>사용자 추가 실패</h2>')
                    res.end();
                }
            }
        )
    })
});

/*
    로그인
*/
app.post('/process/login', (req, res) => {
    console.log('process/login 호출됨' + req);

    const paramID = req.body.id;
    const paramPassword = req.body.password;

    console.log('로그인 요청' + paramID + ' ' + paramPassword);

    pool.getConnection((err, conn) => {

        if (err) {
            console.log('MariaDB get connection error. aborted');

            res.writeHead('200', { 'Content-type': 'text/html; charset=utf8' })
            res.write('<h2>DB서버 연결 실패</h2>')
            res.end();

            return;
        }

        const exec = conn.query('select `id`, `name` from `users` where `id`=? and `password`=password(?);',
            [paramID, paramPassword],
            (err, rows) => {
                conn.release();
                console.log('실행된 SQL query: ' + exec.sql);

                if (err) {
                    console.log('SQL 실행시 오류 발생')
                    console.dir(err)

                    res.writeHead('200', { 'Content-type': 'text/html; charset=utf8' })
                    res.write('<h2>SQL 실행 실패</h2>')
                    res.end()

                    return
                }

                if (rows.length > 0) {
                    console.log('아이디 [%s], 패스워드가 일치하는 사용자 [%s] 찾음', paramID, rows[0].name)

                    res.writeHead('200', { 'Content-type': 'text/html; charset=utf8' })
                    res.write('<h2>로그인 성공</h2>')
                    res.end()

                    return
                }

                else {
                    console.log('아이디 [%s], 패스워드가 일치하지 않음', paramID)

                    res.writeHead('200', { 'Content-type': 'text/html; charset=utf8' })
                    res.write('<h2>로그인 실패. 아이디와 패스워드를 확인하세요.</h2>')
                    res.end()

                    return
                }
            }
        )

    })
});

app.listen(3000, () => {
    console.log('Listen on port 3000...');
});