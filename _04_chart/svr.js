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
    debug: false,
    timezone: '09:00'   // Asia/Seoul. DB에 저장된 UTC시간을 Localize한다.
})

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/public', static(path.join(__dirname, 'public')))

app.post('/chartdatafromdb', (req, res) => {
    console.log('chartdatafromdb 호출됨')

    pool.getConnection((err, conn) => {

        // Client에게 보낼 데이터 초기화. 초기값은 오류 상태.
        const resData = {}
        resData.result = 'error'
        resData.temp = []
        resData.reg_date = []

        if (err) {
            conn.release()
            console.log('MariaDB getConnection error. aborted')
            res.json(resData) // 오류 데이터를 json으로 보내준다.
            return;
        }

        // DB에 data를 요청한다.
        const exec = conn.query('select `temperature`, `reg_date` from `Building_Temperature` order by `reg_date` asc;',
            (err, rows) => {
                if (err) {
                    console.log('MariaDB query error. aborted')
                    res.json(resData) // 오류 데이터를 json으로 보내준다.
                    return;
                }

                if (rows[0]) { // 조건에 맞는 데이터가 1개라도 있으면, rows[0]는 null이 아닐 것.
                    console.log('MariaDB query success.')
                    resData.result = 'ok'
                    rows.forEach((val) => {
                        resData.temp.push(val.temperature)
                        resData.reg_date.push(val.reg_date)
                    })
                }
                else { // query는 성공, 그러나 데이터가 없는 경우
                    resData.result = 'none'
                }

                return res.json(resData); // 데이터를 json으로 보내준다.
            })


    })

})

// building id가 주어진 경우를 처리.
app.post('/chartdatafromdbwithbid', (req, res) => {
    console.log('chartdatafromdbwithbid 호출됨')

    const bid = req.body.bid
    console.log('bid is %s', bid)

    pool.getConnection((err, conn) => {

        // Client에게 보낼 데이터 초기화. 초기값은 오류 상태.
        const resData = {}
        resData.result = 'error'
        resData.temp = []
        resData.reg_date = []

        if (err) {
            conn.release()
            console.log('MariaDB getConnection error. aborted')
            res.json(resData) // 오류 데이터를 json으로 보내준다.
            return;
        }

        // DB에 data를 요청한다.
        const exec = conn.query('select `temperature`, `reg_date` from `Building_Temperature` where `building_id` = ? order by `reg_date` asc;',
            [bid],
            (err, rows) => {
                if (err) {
                    console.log('MariaDB query error. aborted')
                    res.json(resData) // 오류 데이터를 json으로 보내준다.
                    return;
                }

                if (rows[0]) { // 조건에 맞는 데이터가 1개라도 있으면, rows[0]는 null이 아닐 것.
                    console.log('MariaDB query success.')
                    resData.result = 'ok'
                    rows.forEach((val) => {
                        resData.temp.push(val.temperature)
                        resData.reg_date.push(val.reg_date)
                    })
                }
                else { // query는 성공, 그러나 데이터가 없는 경우
                    resData.result = 'none'
                }

                return res.json(resData); // 데이터를 json으로 보내준다.
            })


    })

})

app.listen(3000, () => {
    console.log('Server statred at 3000')
})
