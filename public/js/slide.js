/*jQuery 리스트를 이용한 슬라이드 효과*/
var pos = 0; // 기본 위치
var totalSlide = $('#slideShow ul li').length; // 슬라이드 수
var sliderWidth = $('#slideShow').width(); // 슬라이드 길이(기본 1200px)

$(document).ready(function () {
    $('#slideShow #slider').width(sliderWidth * totalSlide); // 전체 슬라이드 길이

    /* 버튼 이벤트 */
    $('#next').click(function () {
        slideRight(); // 다음
    });

    $('#previous').click(function () {
        slideLeft(); // 이전
    });

    var autoSlider = setInterval(slideRight, 5000);

    $('#slideShow').hover( // 마우스 호버 이벤트
        function () {
            $(this).addClass('active'); // 클래스 추가(버튼 보임)
            clearInterval(autoSlider); // 슬라이드 정지
        },
        function () {
            $(this).removeClass('active'); // 클래스 제거(버튼 숨김)
            autoSlider = setInterval(slideRight, 5000); // 슬라이드 작동
        });
});

/* 이전 슬라이드 */
function slideLeft() {
    pos--;
    if (pos == -1) {
        pos = totalSlide - 1;
    }
    $('#slideShow ul#slider').css('left', -(sliderWidth * pos));
}

/* 다음 슬라이드 */
function slideRight() {
    pos++;
    if (pos == totalSlide) {
        pos = 0;
    }
    $('#slideShow ul#slider').css('left', -(sliderWidth * pos));
}


/* 바닐라 JS DIV 태그를 이용한 슬라이드 구현 (버튼 포함) 에러로 보류
var slideShow = document.getElementById('slideShow');
var slideIndex = 0; // 기본 위치는 0으로 초기화
var slideImage = document.querySelectorAll('#slideShow div');

var totalSlide = slideImage.length; // slideImage 개수
var slideWidth = slideShow.clientWidth; // slide 길이 (1200px);

slideImage.forEach(function (element) {
    element.style.width = slideWidth + 'px';
});

var slider = document.querySelector('#slideShow div.slideImage');
slider.style.width = slideWidth * totalSlide + 'px';
// 슬라이드 전체 길이는 슬라이드 길이 * 슬라이드 개수

var nextBtn = document.getElementById('next'); // 다음
var prevBtn = document.getElementById('previous'); // 이전

nextBtn.addEventListener('click', function () {
    plusSlides(1); // 클릭시 값 증가
});

prevBtn.addEventListener('click', function () {
    plusSlides(-1);
});


// btnHover
slideShow.addEventListener('mouseover', function () { // 마우스 오버 이벤트
    this.classList.add('active'); // .active 클래스 추가
    clearInterval(autoSlide);
});

slideShow.addEventListener('mouseleave', function () { //마우스 리브 이벤트
    this.classList.remove('active'); // .active 클래스 제거
    autoSlide = setInterval(plusSlides(1), 3000);
    plusSlides(1);
});

function plusSlides(x) {
    showSlide(slideIndex += x);
}

function showSlide(x) {
    slideIndex = x;
    if (slideIndex == -1) {
        slideIndex = totalSlide - 1;
    } else if (slideIndex === totalSlide) {
        slideIndex = 0;
    }
    slider.style.left = -(sliderWidth * slideIndex) + 'px';
} */