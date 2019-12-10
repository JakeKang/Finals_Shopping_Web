var admin_modal = document.getElementById('admin_modal')

// 어드민 창 열기
var admin_nav = document.getElementById('admin_nav')

admin_nav.onclick = function () {
    admin_modal.style.display = 'block'
    userSelectInfo(); // 셀렉트박스 유저정보 불러오기
    userOrderInfo(); // 전체 구매 정보 불러오기
}

// 어드민 창 닫기
var admin_close = document.getElementById('admin_close')
var select_user_id = '';
var admin_row = document.getElementById('admin_table');

admin_close.onclick = function () {
    admin_modal.style.display = 'none'
    deletetable();
    $('#userSelect option').remove()
    $('#userSelect').append(`<option value="default" select>구매자 선택</option>`)
}

// 구매자 아이디 불러오기
function userSelectInfo() {
    $.get('/orderUserInfo', function (data) {
        select_user_id = data
        var item_Count = data.length // 상품 총 개수 오브젝트 저장
        for (var i = 0; i <= item_Count - 1; i++) {
            // 0부터 시작이므로 전체 개수 -1
            var Select = `<option value="${data[i].id}">`
            Select += `${data[i].id}`
            Select += `</option>`
            $('#userSelect').append(Select)
        }
    })
}

//userSelect
var selectUserid = document.getElementById('selectUserid') // 조회 버튼
var SelectValue = "default"; // UserValue 가 담길 변수 기본 default
$("#userSelect").change(function () { // 셀렉트박스가 Change 이벤트를 일으킬 때 마다 해당 vlaue값을 변수에 저장
    SelectValue = $(this).val();
});

selectUserid.onclick = function () {
    if (SelectValue == "default") { // 구매자 미 선택시;
        alert('구매자를 선택해주세요.');
        deletetable(); // 테이블을 초기화
        userOrderInfo(); // 전체 구매 정보를 불러옴
    } else {
        deletetable() // 초기화 시키고 선택된 정보 입력
        selectOrderInfo(); // 선택된 구매자 정보 넣기
    }
}

// 구매 정보 변경, 삭제 이벤트
var etcValue = "결제완료"; // UserValue 가 담길 변수 기본 default
//구매 정보 변경 확인
$(document).on('change', '#etcSelect', function () {
    // 동적 생성 selectbox 이므로 document.on 이벤트로 확인
    etcValue = $(this).val();
});

// 버튼이 선택된 테이블에서 테이블 값 가져오기


$(document).on("click", "#selectChange", function () {
    var currentRow = $(this).closest('tr'); // 버튼이 선택된 tr 정보를 받아와서
    var orderNum = currentRow.find('td:eq(1)').text(); // 해당 tr 2번째 행인 orderNum 정보 반환
    //console.log(etcValue);
    var selectChangeInfo = { // 서버로 객체 보낼 객체
        num: orderNum,
        etc: etcValue
    };
    $.post('/etcChange', selectChangeInfo, function (data) {
        console.log("구매정보를 수정하였습니다.");
        if (SelectValue == "default") { // default 시
            deletetable(); // 테이블 초기화 후
            userOrderInfo(); // 전체 구매 목록 추가
        } else { // 아니면
            deletetable(); // 테이블 초기화 후
            selectOrderInfo() // 선택된 구매 목록 추가
        }
    });
});

$(document).on("click", "#selectDelete", function () {
    var currentRow = $(this).closest('tr'); // 버튼이 선택된 tr 정보를 받아와서
    var orderNum = currentRow.find('td:eq(1)').text(); // 해당 tr 2번째 행인 orderNum 정보 반환
    //console.log(etcValue);
    var selectdelete = { // 서버로 객체 보낼 객체
        num: orderNum,
    };
    $.post('/orderdelete', selectdelete, function (data) {
        console.log("구매정보를 삭제하였습니다.");
        if (SelectValue == "default") { // default 시
            deletetable(); // 테이블 초기화 후
            userOrderInfo(); // 전체 구매 목록 추가
        } else { // 아니면
            deletetable(); // 테이블 초기화 후
            selectOrderInfo() // 선택된 구매 목록 추가
        }
    });
});

//전체 구매정보
function userOrderInfo() {
    $.get('/orderInfo', function (data) {
        console.log(data) //purc_table
        var item_Count = data.length // 상품 총 개수 오브젝트 저장
        for (var i = 0; i <= item_Count - 1; i++) {
            // 0부터 시작이므로 전체 개수 -1
            var rowItem = '<tr>'
            rowItem += `<td>${data[i].id}</td>`
            rowItem += `<td>${data[i].num}</td>`
            rowItem += `<td>${data[i].name}</td>`
            rowItem += `<td>${data[i].stock}</td>`
            rowItem += `<td>${priceCommas(data[i].price)}</td>`
            rowItem += `<td>${data[i].date}</td>`
            rowItem += `<td>${data[i].add}</td>`
            rowItem += `<td>${data[i].pnum}</td>`
            rowItem += `<td>${data[i].etc}</td>`
            rowItem += `<td>
            <input type="button" value="변경" id="selectChange">
            <input type="button" value="삭제" id="selectDelete"></td>`
            rowItem += '</tr>'
            $('#admin_table').append(rowItem)
        }
    })
}

// 선택된 구매자 구매 정보
function selectOrderInfo() {
    var selectInfo = { // 서버로 객체 보낼 객체
        userid: SelectValue
    };
    $.post('/SelectUserInfo', selectInfo, function (data) {
        var select_Count = data.length // 상품 총 개수 오브젝트 저장
        for (var i = 0; i <= select_Count - 1; i++) {
            // 0부터 시작이므로 전체 개수 -1
            var rowItem = '<tr>'
            rowItem += `<td>${data[i].id}</td>`
            rowItem += `<td>${data[i].num}</td>`
            rowItem += `<td>${data[i].name}</td>`
            rowItem += `<td>${data[i].stock}</td>`
            rowItem += `<td>${priceCommas(data[i].price)}</td>`
            rowItem += `<td>${data[i].date}</td>`
            rowItem += `<td>${data[i].add}</td>`
            rowItem += `<td>${data[i].pnum}</td>`
            rowItem += `<td>${data[i].etc}</td>`
            rowItem += `<td>
            <input type="button" value="변경" id="selectChange">
            <input type="button" value="삭제" id="selectDelete"></td>`
            rowItem += '</tr>'
            $('#admin_table').append(rowItem)
        }
    });
}

// 테이블 초기화 이벤트
function deletetable() {
    var admin_length = admin_row.rows.length - 2;
    //console.log(admin_length);
    for (var i = 0; i <= admin_length; i++) { // 테이블 쌓이는거 방지
        admin_row.deleteRow(1);
    }
}