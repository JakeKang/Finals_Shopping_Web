var buyProduct = document.getElementById('productbuy'); // 구매 버튼

var proName = document.getElementById('productName'); // 제품 이름
var totalPrice = document.querySelector('#totalPrice span'); // 제품 총 가격
var proCode = document.querySelector('#productNum span'); // span 태그 안 제품 코드
var pro_stock = document.getElementById('stockbox'); // 상품수량

var userid = sessionStorage.getItem("user_id");
var buyAdd = document.getElementById('buyAdd'); // 주소
var buyPnum = document.getElementById('buyPnum'); // 연락처

buyProduct.onclick = function () {
    // 제품 총 가격
    var prototalPrice = totalPrice.innerText;
    prototalPrice = prototalPrice.replace(/[^0-9]/g, ''); // 숫자만 가져오기
    prototalPrice = Number(prototalPrice);

    // 제품 총 개수
    var totalStock = pro_stock.value;
    totalStock = Number(totalStock);

    if (confirm("구매 하시겠습니까?") == true) {
        var buyProInfo = { // 서버로 객체 보낼 객체
            id: userid,
            name: proName.innerText,
            stock: totalStock,
            date: add_date,
            price: prototalPrice,
            add: buyAdd.value,
            pnum: buyPnum.value,
            etc: "결제완료"
        };
        console.log(buyProInfo);
        $.post('/proBuy', buyProInfo, function (data) {
            console.log(data);
            if (data == true) {
                alert("상품구매가 완료 되었습니다.");
                location.reload(); // 상품구매하고 새로고침
                proModal.style.display = "none";
            } else {
                console.log("error");
            }
        })
    } else {
        alert("구매가 취소되었습니다.");
    }

}

// 제품구매 날짜
var d = new Date();
var year = d.getFullYear();
var month = d.getMonth() + 1; //January is 0!
var day = d.getDate();
if (day < 10) {
    day = '0' + day
}
if (month < 10) {
    month = '0' + month
}
var add_date = year + '-' + month + '-' + day;


var purcModal = document.getElementById('purc_modal');

// 구매항목 열기
var purcOpen = document.getElementById('purc_nav');

purcOpen.onclick = function () {
    purcModal.style.display = "block";

    var userInfo = { // 서버로 객체 보낼 객체
        userid: userid
    };

    $.post('/purchase', userInfo, function (data) {
        console.log(data); //purc_table
        var item_Count = data.length; // 상품 총 개수 오브젝트 저장
        for (var i = 0; i <= item_Count - 1; i++) { // 0부터 시작이므로 전체 개수 -1
            var rowItem = "<tr>"
            rowItem += `<td>${data[i].name}</td>`
            rowItem += `<td>${data[i].stock}</td>`
            rowItem += `<td>${priceCommas(data[i].price)}</td>`
            rowItem += `<td>${data[i].pnum}</td>`
            rowItem += `<td>${data[i].add}</td>`
            rowItem += `<td>${data[i].date}</td>`
            rowItem += `<td>${data[i].etc}</td>`
            rowItem += "</tr>"
            $('#purc_table').append(rowItem);
        }
    });
}

// 구매항목  닫기
var purcClose = document.getElementById('purc_close');
var table_row = document.getElementById('purc_table');

purcClose.onclick = function () {
    purcModal.style.display = "none";
    var row_length = table_row.rows.length - 2;
    console.log(row_length);
    for (var i = 0; i <= row_length; i++) { // 테이블 쌓이는거 방지
        table_row.deleteRow(1);
    }
}

// 제품삭제
var pro_delete = document.getElementById('pro_delete');
var productNum = document.getElementById('productNum');

pro_delete.onclick = function () {
    var productCode = productNum.innerText;
    productCode = productCode.replace(/[^0-9]/g, ''); // 숫자만 가져오기
    productCode = Number(productCode); // 제품코드
    if (confirm("삭제 하시겠습니까?") == true) {
        var deleteProCode = { // 서버로 객체 보낼 객체
            code: productCode
        };
        $.post('/proDelete', deleteProCode, function (data) {
            console.log(data);
            if (data == true) {
                alert("상품삭제가 완료 되었습니다.");
                location.reload(); // 상품삭제하고 새로고침
                proModal.style.display = "none";
            } else {
                console.log("error");
            }
        })
    } else {
        alert("삭제가 취소되었습니다.");
    }
}