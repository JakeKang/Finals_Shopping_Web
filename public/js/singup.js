var singupModal = document.getElementById('singup_modal');

// 회원가입 열기
var singupOpen = document.getElementById('singup_nav');

singupOpen.onclick = function () {
    singupModal.style.display = "block";
}

// 회원가입 닫기
var singupClose = document.getElementById('singup_close');

singupClose.onclick = function () {
    singupModal.style.display = "none";
}

//회원 가입
var si_id = document.getElementById('signup_id');
var si_pw = document.getElementById('signup_pw');
var si_name = document.getElementById('signup_name');
var si_add = document.getElementById('signup_add');
var si_pnum = document.getElementById('signup_pnum');
var si_email = document.getElementById('signup_email'); // 회원가입 정보들

var si_button = document.getElementById('singupButton'); // 회원가입 버튼

var si_info_id = document.getElementById('signup_id_label'); //회원가입 에러 체크
var si_info_pw = document.getElementById('signup_ps_label');
var si_info_pnum = document.getElementById('signup_pnum_label');
var si_info_all = document.getElementById('signup_all_label');

function reset_info() {
    si_info_id.innerHTML = "";
    si_info_pw.innerHTML = "";
    si_info_pnum.innerHTML = "";
    si_info_all.innerHTML = "";
}

si_button.onclick = function () {
    if (si_id.value == "") { // 아이디 공백시
        si_info_all.innerHTML = "빈 칸이 존재합니다. 확인해주세요.";
        setTimeout(reset_info, 2500);
        return si_id.focus();
    } else if (si_pw.value == "") {
        si_info_all.innerHTML = "빈 칸이 존재합니다. 확인해주세요.";
        setTimeout(reset_info, 2500);
        return si_pw.focus();
    } else if (si_name.value == "") { // 이름 공백시
        si_info_all.innerHTML = "빈 칸이 존재합니다. 확인해주세요.";
        setTimeout(reset_info, 2500);
        return si_name.focus();
    } else if (si_add.value == "") { // 주소 공백시
        si_info_all.innerHTML = "빈 칸이 존재합니다. 확인해주세요.";
        setTimeout(reset_info, 2500);
        return si_add.focus();
    } else if (si_pnum.value == "") { // 번호 공백시
        si_info_all.innerHTML = "빈 칸이 존재합니다. 확인해주세요.";
        setTimeout(reset_info, 2500);
        return si_pnum.focus();
    } else if (si_email.value == "") { // 이메일 공백시
        si_info_all.innerHTML = "빈 칸이 존재합니다. 확인해주세요.";
        setTimeout(reset_info, 2500);
        return si_email.focus();
    } else { // 공백이 없을 때
        var SingupInfo = { // 서버로 객체 보낼 객체
            id: si_id.value,
            pw: si_pw.value,
            name: si_name.value,
            add: si_add.value,
            pnum: si_pnum.value,
            email: si_email.value // 마지막은 비우기
        };
        console.log(SingupInfo);
        $.post('/idOverlap', SingupInfo, function (data) { // 아이디 중복체크
            if (data.overlap === true) {
                si_info_id.innerHTML = "아이디가 중복됩니다.";
                setTimeout(reset_info, 2500);
            } else {
                $.post('/signUpAction', SingupInfo, function (data) {
                    console.log(data);
                    if (data == true) {
                        alert("회원가입이 완료되었습니다.");
                        singUpDone();
                    } else {
                        alert("error");
                    }
                })
            }
        })

    }
}

//회원가입 완료
function singUpDone() {
    si_id.value = "";
    si_pw.value = "";
    si_name.value = "";
    si_add.value = "";
    si_pnum.value = "";
    si_email.value = "";
    singupModal.style.display = "none"; // 모달창 종료
}