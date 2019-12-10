var loginModal = document.getElementById('login_modal');

// 로그인 열기
var loginOpen = document.getElementById('login_nav');

loginOpen.onclick = function () {
    loginModal.style.display = "block";
}

// 로그인 닫기
var loginClose = document.getElementById('login_close');

loginClose.onclick = function () {
    loginModal.style.display = "none";
}

// 로그인 정보 처리(아이디 에러, 패스워드 에러 처리)
var loginInfo = document.getElementById('login_info_label');

var loginbutton = document.getElementById('loginButton');

var login_info_nav = document.getElementById('login_info_nav');
var login_nav = document.getElementById('login_nav'); //로그인
var login_info_label = document.getElementById('login_info_label');
var logout_nav = document.getElementById('logout_nav'); //로그아웃
var singup_nav = document.getElementById('singup_nav'); //회원가입
var mypage_nav = document.getElementById('mypage_nav'); //마이페이지
var purc_nav = document.getElementById('purc_nav'); //구매항목
var admin_nav = document.getElementById('admin_nav'); //어드민 관리창

var pro_delete = document.getElementById('pro_delete'); // 매니저 삭제 버튼
var proadd = document.getElementById('proadd'); // 매니저 추가 버튼
var adminCheck = sessionStorage.getItem("user_super");

function reset_info() {
    login_info_label.innerHTML = "";
}

// 로그인 처리
loginbutton.onclick = function () {
    login_info_label.innerHTML = ""; // 초기화
    var id = document.getElementById('login_id');
    var pw = document.getElementById('login_pw');
    var loginInfo = { // 서버로 객체 보낼 객체
        id: id.value,
        pw: pw.value // 마지막은 비우기
    };
    console.log(loginInfo);
    if (id.value == "" && pw.value == "") { // 아이디 또는 비밀번호 미 입력시
        login_info_label.innerHTML = "아이디 또는 비밀번호를 확인 해주세요.";
        setTimeout(reset_info, 2500); // 2.5 초 이후에 login_info 초기화
    } else {
        $.post('/loginAction', loginInfo, function (data) { // data = response 된 데이터
            console.log(data);
            if (data.done === true) {
                login_info_nav.innerHTML = data.name + "님 환영합니다.";
                loginDone();
                sessionStorage.setItem("user_id", data.id); // 세션 저장
                sessionStorage.setItem("user_name", data.name); // 세션 저장
                sessionStorage.setItem("user_add", data.add); // 세션 저장
                sessionStorage.setItem("user_pnum", data.pnum); // 세션 저장
                sessionStorage.setItem("user_super", data.super); // 세션 저장
                id.value = "";
                pw.value = ""; //입력창 초기화
                if (Boolean(data.super)) { // 0, 1 매니저 구분 [1일시]
                    console.log("관리자님 환영합니다.")
                    pro_delete.classList.add('active'); // 매니저 버튼 생성
                    proadd.classList.add('active');
                    admin_nav.classList.add('active');
                } else {}
            } else {
                login_info_label.innerHTML = "아이디 또는 비밀번호를 확인 해주세요.";
                setTimeout(reset_info, 2500); // 2.5 초 이후에 login_info 초기화
            }
        });
    }
};

logout_nav.onclick = function () {
    logout_nav.classList.remove('active'); // 로그아웃 버튼 표시
    login_nav.classList.remove('active'); // 로그인 버튼 숨김
    singup_nav.classList.remove('active'); // 회원가입 버튼 숨김
    mypage_nav.classList.remove('active'); // 마이페이지 버튼 표시
    purc_nav.classList.remove('active'); // 구매항목 버튼 표시
    sessionStorage.clear(); // 세션 스토리지 초기화
    pro_delete.classList.remove('active'); // 매니저 버튼 삭제
    proadd.classList.remove('active');
    admin_nav.classList.remove('active');
    login_info_nav.innerHTML = "";
};

function loginDone() {
    logout_nav.classList.add('active'); // 로그아웃 버튼 표시
    login_nav.classList.add('active'); // 로그인 버튼 숨김
    singup_nav.classList.add('active'); // 회원가입 버튼 숨김
    mypage_nav.classList.add('active'); // 마이페이지 버튼 숨김
    purc_nav.classList.add('active'); // 구매항목 버튼 숨김
    loginModal.style.display = "none"; // 모달창 종료
    if (Boolean(Number(adminCheck))) { // 계정이 어드민이면 어드민 관리창 표시
        pro_delete.classList.add('active'); // 매니저 버튼 생성
        proadd.classList.add('active');
        admin_nav.classList.add('active');
    }
}

// 세션 스토리지 검사 로그인 유지
function loginSession() {
    var session_id = sessionStorage.getItem("user_id");
    var session_name = sessionStorage.getItem("user_name");
    if (session_id == null) {
        console.log("세션이 없습니다.");
    } else {
        login_info_nav.innerHTML = session_name + "님 환영합니다.";
        loginDone();
    }
}

loginSession();