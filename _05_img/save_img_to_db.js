const mariadb = require('mysql')
const fs = require('fs') // 파일 시스템.
const dbconfig = require('./config/dbconfig.json')

// 한 번만 연결하면 되기 때문에, createConnection 사용.
const connection = mariadb.createConnection({
    host: dbconfig.host,
    port: dbconfig.port,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false
})

// 로컬에서 이미지를 읽어서, DB에 저장
const nodejs = {
    img: fs.readFileSync('./nodejs.jpg'), // readFileSync: 파일을 다 읽을 때까지 기다린다.
    name: 'Nodejs' // DB의 name column에 저장될 이름.
}

const react = {
    img: fs.readFileSync('./react.jpg'), // readFileSync: 파일을 다 읽을 때까지 기다린다.
    name: 'React' // DB의 name column에 저장될 이름.
}

// insert into `테이블` set key1=value1, key2=value2...
const query1 = connection.query('insert into `Animals` set ?;',
    nodejs, // nodejs에서는 자동으로 key와 value쌍으로 풀어서 넣어준다.
    (err, result) => {
        if (err) {
            console.dir(err)
            return
        }
        console.log('이미지를 db에 추가 성공: ')
        //console.log(query1.sql)
        console.dir(result)
    }
)

// insert into `테이블` set key1=value1, key2=value2...
const query2 = connection.query('insert into `Animals` set ?;',
    react, // nodejs에서는 자동으로 key와 value쌍으로 풀어서 넣어준다.
    (err, result) => {
        if (err) {
            console.dir(err)
            return
        }
        console.log('이미지를 db에 추가 성공: ')
        //console.log(query2.sql)
        console.dir(result)
    }
)

// createConnection은 연결을 임의로 닫을 수 있다.
connection.end()