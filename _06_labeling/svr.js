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

// test_3.html에서 이미지 가져오기 버튼을 눌렀을 때, 답변하는 부분
//  -> 이미지를 보내준다.
app.post('/getimgfromdbbyname', (req, res) => {
    console.log('getimgfromdbbyname 호출됨')
    console.log(req.body)
    const imgname = req.body.imgname
    console.log(`imgname ==> ${imgname}`)

    const reply = {
        'status': 'nok'
    }

    pool.getConnection((err, conn) => {

        if (err) {
            conn.release()
            console.log('pool.getConnection 에러 발생')
            console.dir(err)
            reply.status = 'nok db pool error'
            res.json(reply)
            return
        }

        const query_str = 'select `img` from Animals where `name`=?'
        conn.query(query_str, imgname, (error, rows, fields) => {

            if (error) { // DB query 에러 발생
                conn.release()
                console.dir(error)
                reply.status = 'nok query error'
                res.json(reply)
                return
            }

            // 성공 시 처리
            conn.release()

            if (rows.length > 0) {
                reply.status = 'ok'
                reply.rows = rows;
                console.log('이미지 전달 성공')
            }
            else {
                reply.status = 'nok, no result'
                console.log('사진 이름과 매칭되는 사진 없음')
            }

            res.json(reply)

        })

    })
})

app.post('/saveBbox', (req, res) => {

    console.log('saveBbox 호출됨')
    const imgname = req.body.imgname
    const coordstxt = req.body.coords
    console.log(`imgname is ${imgname}`)
    console.log(`coords is ${coordstxt}`)

    const reply = {
        'status': 'nok'
    }

    pool.getConnection((err, conn) => {

        if (err) {
            conn.release()
            console.log('pool.getConnection 에러 발생')
            console.dir(err)
            reply.status = 'nok db pool error'
            res.json(reply)
            return
        }

        const query_str = 'update Animals set `coord`=? where `name`=?'
        conn.query(query_str, [coordstxt, imgname], (error, rows, fields) => {

            if (error) {
                conn.release()
                console.dir(error)
                reply.status = 'nok query error'
                res.json(reply)
                return
            }

            conn.release()
            reply['status'] = 'ok'
            res.json(reply)
            console.log(`Coords 저장 성공. 대상 이미지 ${imgname}`)


        })
    })

})

app.listen(3000, () => {
    console.log('Server started at 3000')
})