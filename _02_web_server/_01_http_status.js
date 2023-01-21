/*
    HTTP Response status code

    sendStatus()

    postman
*/

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    // res.sendStatus(200) // 200 : OK. ( WB에서 OK라고 확인 가능. )
    // res.sendStatus(400) // 400 : Bad Request, '안녕하세요' --> '잘 가세요'
    //                        403 : forbidden, 너는 접근하면 안된다.
    //                        404 : not found, 너가 찾는 자료가 없다.
    //                        500 : internal server error, 너가 보낸 요청 처리하다 오류가 생겼다.
    //                        503 : service unavailable, 처리할 서버가 없다. ( 서버가 죽었다. )
    //
})

app.listen(3000, () => {
    console.log('start listening on 300')
})