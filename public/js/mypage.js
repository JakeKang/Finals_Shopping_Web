// 마이페이지 
var mypageModal = document.getElementById('mypage_modal');

var my_id = document.getElementById('mypage_id');
var pw = document.getElementById('mypage_pw');
var my_name = document.getElementById('mypage_name');
var add = document.getElementById('mypage_add');
var pnum = document.getElementById('mypage_pnum');
var email = document.getElementById('mypage_email');

var updateButton = document.getElementById('updateButton');
var deleteButton = document.getElementById('deleteButton');

var my_info_all = document.getElementById('mypage_all_label');

// 마이페이지 열기
var mypageOpen = document.getElementById('mypage_nav');

mypageOpen.onclick = function () {
    var id = sessionStorage.getItem("user_id"); // 세션 스토리지 유저 아이디 불러옴
    var mypageInfo = { // 서버로 객체 보낼 객체
        id: id
    };
    $.post('/mypage', mypageInfo, function (data) {
        if (data.done === true) {
            my_id.value = data.id;
            pw.value = data.pw;
            my_name.value = data.name;
            add.value = data.add;
            pnum.value = data.pnum;
            email.value = data.email;

        } else {
            console.log("조회 실패");
        }
    });

    mypageModal.style.display = "block";
}

// 마이페이지 닫기
var mypageClose = document.getElementById('mypage_close');

mypageClose.onclick = function () {
    mypageModal.style.display = "none";
}

// 회원 정보 수정
updateButton.onclick = function () {
    if (pw.value == "") {
        my_info_all.innerHTML = "빈 칸이 존재합니다. 확인해주세요."; // 패스워드 공백시
        setTimeout(reset_info, 2500);
        return pw.focus();
    } else if (my_name.value == "") { // 이름 공백시
        my_info_all.innerHTML = "빈 칸이 존재합니다. 확인해주세요.";
        setTimeout(reset_info, 2500);
        return my_name.focus();
    } else if (add.value == "") { // 주소 공백시
        my_info_all.innerHTML = "빈 칸이 존재합니다. 확인해주세요.";
        setTimeout(reset_info, 2500);
        return add.focus();
    } else if (pnum.value == "") { // 번호 공백시
        my_info_all.innerHTML = "빈 칸이 존재합니다. 확인해주세요.";
        setTimeout(reset_info, 2500);
        return pnum.focus();
    } else if (email.value == "") { // 이메일 공백시
        my_info_all.innerHTML = "빈 칸이 존재합니다. 확인해주세요.";
        setTimeout(reset_info, 2500);
        return email.focus();
    } else { // 공백이 없을 때
        var mypageInfo = { // 서버로 객체 보낼 객체
            id: my_id.value,
            pw: pw.value,
            name: my_name.value,
            add: add.value,
            pnum: pnum.value,
            email: email.value // 마지막은 비우기
        };
        console.log(mypageInfo);
        $.post('/mypageUpdate', mypageInfo, function (data) {
            console.log(data);
            alert("회원정보를 수정하였습니다.");
            mypageModal.style.display = "none";
        });

    }
}

// 회원 탈퇴
deleteButton.onclick = function () {
    if (confirm("정말 탈퇴하시겠습니까?") == true) { //확인 버튼 누를시
        var deleteInfo = {
            id: my_id.value
        }
        $.post('/mypageDelete', deleteInfo, function (data) {
            console.log(data);
            alert("탈퇴가 정상적으로 완료되었습니다.");
            mypageModal.style.display = "none";
            sessionStorage.clear();
            location.reload(); //탈퇴 완료후 새로고침하여 세션 초기화
        });
    } else { // 취소
        return;
    }
}