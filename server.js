// 모듈 추출
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer'); // 파일 업로드 미들웨어

// 데이터베이스 연결
var client = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '0000',
    database: 'finaltest',
})

client.connect() // 데이터베이스 접속

//multer 초기화
var storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, 'public/image/wearimage') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (request, file, cb) {
        cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
})
var upload = multer({
    storage: storage
})

// 웹 서버 생성
var app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
) // post 방식 세팅
app.use(bodyParser.json()) // json 사용 하는 경우의 세팅 (객체)

// 로그인
app.post('/loginAction', function (request, response) {
    var id = request.body.id
    var pw = request.body.pw
    var login = {
        id: id,
        pw: pw
    }
    var sendData = {
        id: '',
        name: '',
        add: '',
        pnum: '',
        super: '',
        done: false // 로그인 체크
    }
    client.query('SELECT * FROM customer WHERE id = ? && pw = ?', [login.id, login.pw], function (err, results) {
        if (!err) {
            if (results[0] === undefined) {
                // 아이디가 틀렸을 때
                response.send(sendData)
                console.log(login.id + "님 께서 접속시도를 하셨습니다.")
            } else {
                sendData.id = results[0].id
                sendData.name = results[0].name
                sendData.add = results[0].address
                sendData.pnum = results[0].pnum
                sendData.super = results[0].super
                sendData.done = true // 로그인 완료
                response.send(sendData)
            }
        } else {
            console.log(err)
        }
    })
})

// 회원가입
app.post('/signUpAction', function (request, response) {
    var id = request.body.id,
        pw = request.body.pw,
        name = request.body.name,
        add = request.body.add,
        pnum = request.body.pnum,
        email = request.body.email;
    var insertData = {
        id: id,
        pw: pw,
        name: name,
        add: add,
        pnum: pnum,
        email: email,
        done: false
    }
    client.query('INSERT INTO customer(id,pw,name,address,pnum,email) VALUE(?,?,?,?,?,?)',
        [insertData.id, insertData.pw, insertData.name, insertData.add, insertData.pnum, insertData.email],
        function (err, data) {
            console.log(insertData.id + "님께서 회원가입을 완료하셨습니다.");
            insertData.done = true;
            response.send(insertData.done);
        })
})

// 아이디 중복 체크
app.post('/idOverlap', function (request, response) {
    var id = request.body.id;
    var sendData = {
        id: '',
        overlap: false // 중복 체크
    }
    client.query('SELECT * FROM customer WHERE id = ?', [id], function (err, results) {
        if (!err) {
            if (results[0] === undefined) { // 중복되지 않을 때
                response.send(sendData);
            } else { // 중복될 때
                sendData.id = results[0].id
                sendData.overlap = true // 중복
                response.send(sendData)
                console.log(results[0].id + "아이디가 회원가입 시 중복됩니다.");
            }
        } else {
            console.log(err);
        }
    })
})

// 회원정보 출력
app.post('/mypage', function (request, response) {
    var id = request.body.id;
    var renderData = {
        id: '',
        pw: '',
        name: '',
        add: '',
        pnum: '',
        email: '',
        done: false
    }
    client.query('SELECT * FROM customer WHERE id = ?', [id], function (err, results) {
        if (!err) {
            if (results === undefined) { // 중복되지 않을 때
                response.send(renderData);
            } else { // 중복될 때
                renderData.id = results[0].id
                renderData.pw = results[0].pw
                renderData.name = results[0].name
                renderData.add = results[0].address
                renderData.pnum = results[0].pnum
                renderData.email = results[0].email
                renderData.done = true
                response.send(renderData)
                console.log(results[0].id + "회원정보를 열람했습니다.");
            }
        } else {
            console.log(err);
        }
    })
})

// 회원정보 수정
app.post('/mypageUpdate', function (request, response) {
    var id = request.body.id,
        pw = request.body.pw,
        name = request.body.name,
        add = request.body.add,
        pnum = request.body.pnum,
        email = request.body.email;
    var updateData = {
        id: id,
        pw: pw,
        name: name,
        add: add,
        pnum: pnum,
        email: email,
        done: false
    }
    client.query('UPDATE customer SET pw=?, name=?, address=?, pnum=?, email=? WHERE id=?',
        [updateData.pw, updateData.name, updateData.add, updateData.pnum, updateData.email, updateData.id],
        function (err, results) {
            if (!err) { // 완료시
                updateData.done = true;
                response.send(updateData.done);
                console.log(updateData.id + "회원정보를 수정했습니다.");
            } else {
                console.log(err);
            }
        })
})

// 회원탈퇴
app.post('/mypageDelete', function (request, response) {
    var id = request.body.id;
    var deleteData = {
        id: id,
        done: false
    }
    client.query('DELETE FROM customer WHERE id=?', [deleteData.id],
        function (err, results) {
            if (!err) { // 완료시
                deleteData.done = true;
                response.send(deleteData.done);
                console.log(deleteData.id + "회원 탈퇴 하였습니다.");
            } else {
                console.log(err);
            }
        })
})

// 상품페이지 정보 출력
app.post('/proSearch', function (request, response) {
    var id = request.body.id;
    var searchData = {
        proCode: '',
        proName: '',
        proStock: '',
        proPrice: '',
        proClass: '',
        proImg: '',
        done: false
    }
    client.query('SELECT * FROM product WHERE productCode = ?', [id], function (err, results) {
        if (!err) {
            if (results === undefined) { // 찾을 수 없을 때
                response.send(searchData);
            } else { // 찾았을때;
                searchData.proCode = results[0].productCode
                searchData.proName = results[0].productName
                searchData.proStock = results[0].productStock
                searchData.proPrice = results[0].productPrice
                searchData.proClass = results[0].productClass
                searchData.proImg = results[0].imgName
                searchData.done = true
                response.send(searchData)
                console.log("상품 정보 전송!.");
            }
        } else {
            console.log(err);
        }
    })
})

// 이미지 추가
app.post('/imgUpdate', upload.single('img'), function (request, response) {
    //console.log(request.file.originalname + " 이미지가 업로드가 완료되었습니다.");
    console.log("이미지가 업로드 되었습니다.");
})

// 상품추가
app.post('/proUpdate', function (request, response) {
    var code = request.body.code,
        name = request.body.name,
        stock = request.body.stock,
        price = request.body.price,
        pro_class = request.body.class,
        date = request.body.date,
        img = request.body.img;
    var addData = {
        code: code,
        name: name,
        stock: stock,
        price: price,
        class: pro_class,
        date: date,
        img: img,
        done: false
    }
    client.query('SELECT * FROM product WHERE productCode = ?', [addData.code], function (err, results) {
        if (!err) { // 위 코드 중복방지
            if (results[0] === undefined) { // 중복코드가 없을 때
                client.query('INSERT INTO product(productCode,productName,productStock,productPrice,productClass,productDate,imgName) VALUE(?,?,?,?,?,?,?)',
                    [addData.code, addData.name, addData.stock, addData.price, addData.class, addData.date, addData.img],
                    function (err, results) {
                        console.log("상품추가 완료 되었습니다.");
                        client.query('SELECT * FROM product WHERE productCode = ?', [addData.code], function (err, results) {
                            if (!err) {
                                if (results[0] === undefined) { // 찾을 수 없을 때
                                    response.send(addData);
                                } else { // 찾았을때;
                                    addData.code = results[0].productCode
                                    addData.name = results[0].productName
                                    addData.stock = results[0].productStock
                                    addData.price = results[0].productPrice
                                    addData.class = results[0].productClass
                                    addData.done = true
                                    response.send(addData)
                                    console.log("상품 정보 전송!.");
                                }
                            } else {
                                console.log(err);
                            }
                        })
                    }) // 상품 추가 완료 후 정보 전송
            } else { // 중복될 때
                addData.code = results[0].productCode;
                response.send(addData);
                console.log("동일한 상품코드가 있습니다.");
            }
        } else {
            console.log(err);
        }
    })
})

// 상품삭제
app.post('/proDelete', function (request, response) {
    var code = request.body.code;
    var deleteData = {
        code: code,
        done: false
    }
    client.query('DELETE FROM product WHERE productCode=?', [deleteData.code],
        function (err, results) {
            if (!err) { // 완료시
                deleteData.done = true;
                response.send(deleteData.done);
                console.log(deleteData.code + "번 상품이 삭제되었습니다.");
            } else {
                console.log(err);
            }
        })
})

// 상품 목록 불러오기
app.get('/proItem', function (request, response) {
    var itemlist = [];
    client.query('SELECT COUNT(*) as item FROM product', function (err, results) {
        if (!err) {
            var itemNum = results[0].item;
            client.query('SELECT * FROM product', function (err, results) {
                if (!err) {
                    for (var i = 0; i <= itemNum - 1; i++) { //itemNum = 컬럼 총개수 int형 0부터 시작이므로 -1
                        var itemlistInfo = {
                            code: '',
                            name: '',
                            stock: '',
                            price: '',
                            class: '',
                            img: '',
                        }
                        itemlistInfo.code = results[i].productCode
                        itemlistInfo.name = results[i].productName
                        itemlistInfo.stock = results[i].productStock
                        itemlistInfo.price = results[i].productPrice
                        itemlistInfo.class = results[i].productClass
                        itemlistInfo.img = results[i].imgName
                        itemlist.push(itemlistInfo);
                    }
                    response.send(itemlist);
                } else {
                    console.log(err);
                }
            })
        } else {
            console.log(err);
        }
    })

})

// 상품구매
app.post('/proBuy', function (request, response) {
    var userid = request.body.id,
        productName = request.body.name,
        productStock = request.body.stock,
        totalPrice = request.body.price,
        orderDate = request.body.date,
        userAddress = request.body.add,
        userPnum = request.body.pnum,
        etc = request.body.etc;

    var insertData = {
        id: userid,
        productName: productName,
        productStock: productStock,
        totalPrice: totalPrice,
        orderDate: orderDate,
        userAddress: userAddress,
        userPnum: userPnum,
        etc: etc,
        done: false
    }
    //console.log(insertData);
    client.query('INSERT INTO orderlist(userid,productName,productStock,totalPrice,orderDate,userAddress,userPnum,etc) VALUE(?,?,?,?,?,?,?,?)',
        [insertData.id, insertData.productName, insertData.productStock, insertData.totalPrice, insertData.orderDate, insertData.userAddress, insertData.userPnum, insertData.etc],
        function (err, data) {
            console.log(insertData.id + "님께서 상품" + insertData.productName + "을 구매하셨습니다.");
            insertData.done = true;
        })
    client.query('UPDATE product set productStock = productStock-? WHERE productName=?',
        [insertData.productStock, insertData.productName],
        function (err, data) {
            console.log(insertData.productName + "제품 재고가 줄어들었습니다.");
            response.send(insertData.done);
        })
})

// 구매 목록 불러오기
app.post('/purchase', function (request, response) {
    var id = request.body.userid
    var userInfo = {
        id: id,
    }
    var itemlist = [];
    client.query('SELECT COUNT(*) as item FROM orderlist Where userid=?', [userInfo.id], function (err, results) {
        if (!err) {
            var itemNum = results[0].item;
            client.query('SELECT * FROM orderlist WHERE userid=? ', [userInfo.id], function (err, results) {
                if (!err) {
                    for (var i = 0; i <= itemNum - 1; i++) { //itemNum = 컬럼 총개수 int형 0부터 시작이므로 -1
                        var itemlistInfo = {
                            name: '',
                            stock: '',
                            price: '',
                            date: '',
                            add: '',
                            pnum: '',
                            etc: ''
                        }
                        itemlistInfo.name = results[i].productName
                        itemlistInfo.stock = results[i].productStock
                        itemlistInfo.price = results[i].totalPrice
                        itemlistInfo.date = results[i].orderDate
                        itemlistInfo.add = results[i].userAddress
                        itemlistInfo.pnum = results[i].userPnum
                        itemlistInfo.etc = results[i].etc
                        itemlist.push(itemlistInfo);
                    }
                    response.send(itemlist);
                    console.log(userInfo.id + "님께서 주문정보를 확인했습니다.")
                } else {
                    console.log(err);
                }
            })
        } else {
            console.log(err);
        }
    })

})

// 주문정보 받아오기 (어드민)
app.get('/orderInfo', function (request, response) {
    var orderlist = [];
    client.query('SELECT COUNT(*) as item FROM orderlist', function (err, results) {
        if (!err) {
            var itemNum = results[0].item;
            client.query('SELECT * FROM orderlist', function (err, results) {
                if (!err) {
                    for (var i = 0; i <= itemNum - 1; i++) { //itemNum = 컬럼 총개수 int형 0부터 시작이므로 -1
                        var orderlistInfo = {
                            id: '',
                            num: '',
                            name: '',
                            stock: '',
                            price: '',
                            date: '',
                            add: '',
                            pnum: '',
                            etc: ''
                        }
                        orderlistInfo.id = results[i].userid
                        orderlistInfo.num = results[i].orderNum
                        orderlistInfo.name = results[i].productName
                        orderlistInfo.stock = results[i].productStock
                        orderlistInfo.price = results[i].totalPrice
                        orderlistInfo.date = results[i].orderDate
                        orderlistInfo.add = results[i].userAddress
                        orderlistInfo.pnum = results[i].userPnum
                        orderlistInfo.etc = results[i].etc
                        orderlist.push(orderlistInfo);
                    }
                    response.send(orderlist);
                } else {
                    console.log(err);
                }
            })
        } else {
            console.log(err);
        }
    })
})

// 주문자 받아오기 (어드민)
app.get('/orderUserInfo', function (request, response) {
    var selectlistInfo = [];
    client.query('SELECT COUNT(DISTINCT userid) as item FROM orderlist', function (err, results) {
        if (!err) {
            var itemNum = Number(results[0].item);
            client.query('SELECT DISTINCT userid FROM orderlist', function (err, results) {
                if (!err) {
                    for (var i = 0; i <= itemNum - 1; i++) { //itemNum = 컬럼 총개수 int형 0부터 시작이므로 -1
                        var orderlistInfo = {
                            id: '',
                        }
                        orderlistInfo.id = results[i].userid
                        selectlistInfo.push(orderlistInfo);
                    }
                    response.send(selectlistInfo);
                } else {
                    console.log(err);
                }
            })
        } else {
            console.log(err);
        }
    })
})

// 선택 주문자 정보 받아오기 (어드민)
app.post('/SelectUserInfo', function (request, response) {
    var userid = request.body.userid
    var userInfo = {
        userid: userid,
    }
    var selectUserList = []; // 유저 구매 리스트가 담길 리스트
    client.query('SELECT COUNT(*) as item FROM orderlist WHERE userid=?', [userInfo.userid], function (err, results) {
        if (!err) {
            var itemNum = Number(results[0].item);
            client.query('SELECT * FROM orderlist WHERE userid=?', [userInfo.userid], function (err, results) {
                if (!err) {
                    for (var i = 0; i <= itemNum - 1; i++) { //itemNum = 컬럼 총개수 int형 0부터 시작이므로 -1
                        var orderlistInfo = {
                            id: '',
                            num: '',
                            name: '',
                            stock: '',
                            price: '',
                            date: '',
                            add: '',
                            pnum: '',
                            etc: ''
                        }
                        orderlistInfo.id = results[i].userid
                        orderlistInfo.num = results[i].orderNum
                        orderlistInfo.name = results[i].productName
                        orderlistInfo.stock = results[i].productStock
                        orderlistInfo.price = results[i].totalPrice
                        orderlistInfo.date = results[i].orderDate
                        orderlistInfo.add = results[i].userAddress
                        orderlistInfo.pnum = results[i].userPnum
                        orderlistInfo.etc = results[i].etc
                        selectUserList.push(orderlistInfo);
                    }
                    response.send(selectUserList);
                } else {
                    console.log(err);
                }
            })
        } else {
            console.log(err);
        }
    })
})

// 구매자 구매 정보 변경
app.post('/etcChange', function (request, response) {
    var num = request.body.num,
        etc = request.body.etc;
    var etcData = {
        num: num,
        etc: etc,
        done: false
    }
    client.query('UPDATE orderlist SET etc=? WHERE orderNum=?',
        [etcData.etc, etcData.num],
        function (err, results) {
            if (!err) { // 완료시
                etcData.done = true;
                response.send(etcData.done);
                console.log("구매정보를 수정했습니다.");
            } else {
                console.log(err);
            }
        })
})

// 구매 정보 삭제
app.post('/orderdelete', function (request, response) {
    var num = request.body.num;
    var orderDeleteData = {
        num: num,
        done: false
    }
    client.query('DELETE FROM orderlist WHERE orderNum=?', [orderDeleteData.num],
        function (err, results) {
            if (!err) { // 완료시
                orderDeleteData.done = true;
                response.send(orderDeleteData.done);
                console.log(orderDeleteData.num + "번 주문정보가 삭제되었습니다.");
            } else {
                console.log(err);
            }
        })
})


// 웹 서버 실행
app.listen(7777, function () {
    console.log('Server Running at http://127.0.0.1:7777')
})