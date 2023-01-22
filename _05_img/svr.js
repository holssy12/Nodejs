const express = require('express')
const mariadb = require('mysql')
const path = require('path')
const static = require('serve-static')
const dbconfig = require('./config/dbconfig.json')

const pool = mariadb.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    port: dbconfig.port,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false
})

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/public', static(path.join(__dirname, 'public')))

// WB에서 요청되는 이미지를 DB에서 추출해서 제공하는 부분
app.post('/getimgfromdb', (req, res) => {

    console.log('getimgfromdb 호출됨')

    pool.getConnection((err, conn) => {
        const query_str = 'select * from Animals where rid=5;'

        conn.query(query_str, (error, rows, fields) => {
            if (error) {
                conn.release()
                console.dir(error)
                res.status(401).json('Query failed')
                return
            }

            const reply = {
                'result': rows
            }
            res.status(200).json(reply) // reply를 json 형태로 전송해준다.
            conn.release(); // 전송 완료 후, 연결을 대기 상태로.
        })
    })

})

app.listen(3000, () => {
    console.log('Server started at 3000')
})