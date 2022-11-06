
// logger.js : 다른 파일에서도 쓸 수 있게 Module로 만들어주자.

function showLogMessage(msg) {
    console.log(`--------------------------------------`)
    console.log(`로그 메시지는 : ${msg}`)
    console.log(`--------------------------------------`)
}

function showLogMessage2(msg) {
    console.log(`======================================`)
    console.log(`로그 메시지는 : ${msg}`)
    console.log(`======================================`)
}

const precious_value = 78

// 모듈을.만들겠다.외부에서 쓸 이름 = 실제 이름
module.exports.showLogMessage = showLogMessage
module.exports.secondLog = showLogMessage2
module.exports.pvalue = precious_value
