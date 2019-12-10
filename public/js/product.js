// 상품 정보창
var proName = document.getElementById('productName');
var proPrice = document.getElementById('productPrice');
var proNum = document.getElementById('productNum');
var proStock = document.getElementById('productStock');
var proClass = document.getElementById('productClass');
var proImage = document.querySelector('#productImgae img');

// 상품 정보창
var item = document.querySelector('.main_item .box img');
var proModal = document.getElementById('pro_modal');
var proContainer = document.querySelector('.pro_container');

// 상품 수량
var totalPrice = document.querySelector('#totalPrice span');
var proleft = document.getElementById('proleft');
var pro_stock = document.getElementById('stockbox');
var proright = document.getElementById('proright');
var productbuy = document.getElementById('productbuy');

// 주문 유저 정보
var buyAdd = document.getElementById('buyAdd'); // 주소
var buyPnum = document.getElementById('buyPnum'); // 연락처
var userAdd = sessionStorage.getItem("user_add"); // 기본 주소
var userPnum = sessionStorage.getItem("user_pnum"); // 기본 연락처

// 상품창 닫기
var proClose = document.getElementById('pro_close');

proClose.onclick = function () {
    proModal.style.display = "none";
}

// 상품 모달창 이벤트
//item.onclick = function (event) {}
function productClick(event) {
    console.log(event.target.id);
    var item_list = event.target.id;
    var SearchInfo = { // 서버로 객체 보낼 객체
        id: item_list
    };
    $.post('/proSearch', SearchInfo, function (data) {
        //console.log(data);
        if (data.done === true) {
            if (data.proImg === "null") {
                proImage.src = `./image/wearimage/empty.png`;
            } else {
                proImage.src = `./image/wearimage/${data.proImg}`;
            }
            proName.innerHTML = data.proName;
            proPrice.innerHTML = `제품가격 : <span>${priceCommas(data.proPrice)}<span>`
            proNum.innerHTML = `제품코드 : <span>${data.proCode}</span>`
            proStock.innerHTML = `재고수량 : <span>${data.proStock}</span>`
            proClass.innerHTML = data.proClass;
            buyAdd.value = userAdd;
            buyPnum.value = userPnum;
            // 전체 가격
            var stocktotal = pro_stock.value;
            stocktotal = Number(stocktotal);
            var proPirceNum = proPrice.innerText;
            proPirceNum = proPirceNum.replace(/[^0-9]/g, ''); // 숫자만 가져오기
            proPirceNum = Number(proPirceNum);
            var soldOutCheck = proStock.innerText
            soldOutCheck = soldOutCheck.replace(/[^0-9]/g, '');
            soldOutCheck = Number(soldOutCheck);
            //console.log(soldOutCheck);
            if (soldOutCheck > 0) { // 품절유무 체크
                var total = proPirceNum * stocktotal;
                totalPrice.innerHTML = `총가격 : <span>${priceCommas(total)}</span>`;
                productbuy.classList.remove('active'); // 버튼 숨김
            } else {
                alert("현재 제품은 품절 상태입니다.");
                productbuy.classList.add('active'); // 버튼 숨김
            }
        } else {
            console.log("조회 실패");
        }
    });
    //console.log(SearchInfo);
    proModal.style.display = "block";
}

// 상품 추가창 이벤트
var proadd_modal = document.getElementById('proadd_modal');
var pro_addBtn = document.getElementById('proadd');
var productadd = document.getElementById('productadd');
var proadd_close = document.getElementById('proadd_close');
var pro_add_btn = document.getElementById('pro_add_btn');

// 상품 추가 input
var pro_add_code = document.getElementById('pro_add_code'); // 상품코드
var pro_add_name = document.getElementById('pro_add_name'); // 상품이름
var pro_add_stock = document.getElementById('pro_add_stock'); // 상품개수
var pro_add_price = document.getElementById('pro_add_price'); // 상품가격
var pro_add_class = document.getElementById('pro_add_class'); // 상품종류
var add_info_label = document.getElementById('add_info_label');
var pro_add_img = document.getElementById('pro_add_img'); // 상품이미지

// 상품 추가 후 HTML ITEM 생성 위치 지정
var main_prdList = document.querySelector('ul.main_prdList');

// 이벤트
pro_addBtn.onclick = function () {
    proadd_modal.style.display = "block";
}

proadd_close.onclick = function () {
    proadd_modal.style.display = "none";
    $("#imageUpBtn").removeAttr("disabled");
    $("#imageFile").val(""); // input file 창 초기화
}

pro_add_btn.onclick = function () {
    if (pro_add_code.value == "") { // 제품코드 공백시시
        add_info_label.innerHTML = "빈 칸이 존재합니다. 확인해주세요."; // 패스워드 공백시
        setTimeout(reset_info, 2500);
        return pro_add_code.focus();
    } else if (pro_add_name.value == "") { // 제품이름 공백시
        add_info_label.innerHTML = "빈 칸이 존재합니다. 확인해주세요.";
        setTimeout(reset_info, 2500);
        return pro_add_name.focus();
    } else if (pro_add_stock.value == "") { // 제품개수 공백시
        add_info_label.innerHTML = "빈 칸이 존재합니다. 확인해주세요.";
        setTimeout(reset_info, 2500);
        return pro_add_stock.focus();
    } else if (pro_add_price.value == "") { // 제품가격 공백시
        add_info_label.innerHTML = "빈 칸이 존재합니다. 확인해주세요.";
        setTimeout(reset_info, 2500);
        return pro_add_price.focus();
    } else if (pro_add_class.value == "") { // 제품구분 공백시
        add_info_label.innerHTML = "빈 칸이 존재합니다. 확인해주세요.";
        setTimeout(reset_info, 2500);
        return pro_add_class.focus();
    } else if (pro_add_img.value == "") { // 이미지를 업로드 하지 않았을때.
        pro_add_img.value = "null"; // 기본 null 로 지정
    } else { // 공백이 없을 때
        var addProInfo = { // 서버로 객체 보낼 객체
            code: pro_add_code.value,
            name: pro_add_name.value,
            stock: pro_add_stock.value,
            price: pro_add_price.value,
            class: pro_add_class.value,
            date: add_date,
            img: pro_add_img.value
        };
        $.post('/proUpdate', addProInfo, function (data) {
            console.log(data);
            if (data.done === true) {
                alert("상품을 추가하였습니다.");
                location.reload(); // 상품추가하고 새로고침
                // 초기화 및 창닫기
                addClear();
                proadd_modal.style.display = "none";
            } else {
                console.log("코드 중복");
                add_info_label.innerHTML = "상품코드 " + data.code + " (이/가) 중복됩니다.";
            }
        });

    }
}

// 상품 추가 날짜
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

// 상품 추가 창 클리어
function addClear() {
    pro_add_code.value = "";
    pro_add_name.value = "";
    pro_add_stock.value = "";
    pro_add_price.value = "";
    pro_add_class.value = "";
}

// 가격 3자리 콤마 정규식
function priceCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 상품 목록 유지
function product_item() {
    $.get('/proItem', function (data) {
        //console.log(data);
        //console.log(data[0].img);
        var image_Count = data.length; // 기존 이미지 개수
        var item_Count = data.length; // 상품 총 개수 오브젝트 저장
        for (var i = 0; i <= item_Count - 1; i++) { // 0부터 시작이므로 전체 개수 -1
            var li = document.createElement('li');
            var div = document.createElement('div');
            var img = document.createElement('img');
            var prd_name = document.createElement('p');
            var prd_subname = document.createElement('p');
            var prd_price = document.createElement('p');
            var newId = data[i].code;
            var imgName = data[i].img; // 상품코드로 분류
            prd_name.innerHTML = data[i].name;
            prd_subname.innerHTML = data[i].class;
            prd_price.innerHTML = priceCommas(data[i].price);
            prd_name.id = "prd_name";
            prd_subname.id = "prd_subname";
            prd_price.id = "prd_price";
            div.className = "box";
            li.className = "main_item";
            img.className = "prd_image";
            img.id = newId;
            if (imgName === "null") { // 데이터베이스 이미지 이름이 null 이면(존재하지않음)
                img.src = `./image/wearimage/empty.png`;
            } else { // 아니면 빈화면 이미지 추가
                img.src = `./image/wearimage/${imgName}`; // `` 백틱쓰
            }
            img.addEventListener("click", productClick);
            div.appendChild(img);
            div.appendChild(prd_name);
            div.appendChild(prd_subname);
            div.appendChild(prd_price);
            li.appendChild(div);
            main_prdList.appendChild(li);
        }
    });
}

// 상품수량
proleft.onclick = function () {
    var leftBtn = Number(pro_stock.value);
    if (leftBtn > 1) {
        leftBtn = leftBtn - 1;
        pro_stock.value = leftBtn;
        // 전체 가격
        var stocktotal = pro_stock.value;
        stocktotal = Number(stocktotal);
        var proPirceNum = proPrice.innerText;
        proPirceNum = proPirceNum.replace(/[^0-9]/g, ''); // 숫자만 가져오기
        proPirceNum = Number(proPirceNum);
        var total = proPirceNum * stocktotal;
        totalPrice.innerHTML = `총가격 : <span>${priceCommas(total)}</span>`;
    } else {
        alert("선택 수량은 0을 넘어야 합니다.");
    }
}

proright.onclick = function () {
    var rightBtn = Number(pro_stock.value);
    var stockCheck = proStock.innerText
    stockCheck = stockCheck.replace(/[^0-9]/g, '');
    stockCheck = Number(stockCheck);
    if (rightBtn < stockCheck) { // 남은 재고보다 작을 때
        rightBtn = rightBtn + 1;
        pro_stock.value = rightBtn;
        // 전체 가격
        var stocktotal = pro_stock.value;
        stocktotal = Number(stocktotal);
        var proPirceNum = proPrice.innerText;
        proPirceNum = proPirceNum.replace(/[^0-9]/g, ''); // 숫자만 가져오기
        proPirceNum = Number(proPirceNum);
        var total = proPirceNum * stocktotal;
        totalPrice.innerHTML = `총가격 : <span>${priceCommas(total)}</span>`;
    } else {
        alert("재고 수량이 부족합니다.");
    }
}

var imgfile = document.getElementById('imageFile');
var imgUpform = document.getElementById('imgUpform');

var imgUploadDone = false;
// 이미지 업로드 파일 체크 함수
function checkImg() {
    if (imgfile.files[0] === undefined) {
        alert("이미지를 업로드 하지 않았습니다.");
        return false;
    } else {
        UploadCheck();
    }
}

function UploadCheck() {
    imgUpform.submit();
    alert("이미지 업로드가 완료 되었습니다.");
    var filename = imageFile.files[0].name;
    pro_add_img.value = filename; // 이미지 이름 input 창 채우기
    $("#imageUpBtn").attr("disabled", true); // 업로드 이후 막기 input file
}

function init() {
    product_item(); // 그리기
}

init();