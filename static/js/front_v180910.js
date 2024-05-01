// JavaScript Document
"use strict";

$(document).ready(function () {
    gnbUI();
    checkCurrentMenu();
    topBtn();
}); // ready

// a 태그 상단 튐 방지
$(document).on("click", 'a[href="#"]', function (e) {
    e.preventDefault();
});

// image slide
$.fn.setImageSlide = function (options) {
    var settings = $.extend(
        {
            slideFirst: 1,
            isTimerOn: true,
            timerSpeed: 3000,
            fadeSpeed: 500,
            transitionType: "basic",
        },
        options
    );

    this.each(function () {
        var $selector = $(this);
        var numSlide = $selector.find("ul.slide li").length;
        var slideNow = 0;
        var slideNext = 0;
        var slidePrev = 0;
        var slideFirst = settings.slideFirst;
        var timerId = "";
        var timerSpeed = settings.timerSpeed;
        var fadeSpeed = settings.fadeSpeed;
        var isTimerOn = settings.isTimerOn;
        var onPlaying = false;
        var showSlide = "";

        // 초기화
        $selector.find("ul.slide li").each(function (i) {
            $selector
                .find("ul.indicator")
                .append('<li><a href="#">' + (i + 1) + "번 이미지</a></li>\n");
        });
        if (isTimerOn === true) {
            $selector.find("p.control a.play").addClass("on");
        } else {
            $selector.find("p.control a.play").removeClass("on");
        }
        switch (settings.transitionType) {
            case "basic":
                showSlide = showSlideBasic;
                break;
            case "fade":
                showSlide = showSlideFade;
                break;
            case "swipe":
                showSlide = showSlideSwipe;
                break;
            case "animation":
                showSlide = showSlideAnimation;
                break;
            default:
                showSlide = showSlideBasic;
        }
        showSlide(slideFirst);

        $selector.find("ul.indicator li a").on("click", function () {
            var index = $selector
                .find("ul.indicator li")
                .index($(this).parent());
            showSlide(index + 1);
        });
        $selector.find("p.control a.prev").on("click", function () {
            $(this)
                .stop(true)
                .animate({ left: "-70px" }, 50)
                .animate({ left: "-60px" }, 100);
            showSlide(slidePrev);
        });
        $selector.find("p.control a.next").on("click", function () {
            $(this)
                .stop(true)
                .animate({ right: "-70px" }, 50)
                .animate({ right: "-60px" }, 100);
            showSlide(slideNext);
        });
        $selector.find("p.control a.play").on("click", function () {
            if (isTimerOn === true) {
                clearTimeout(timerId);
                isTimerOn = false;
                $(this).removeClass("on");
            } else {
                timerId = setTimeout(function () {
                    showSlide(slideNext);
                }, timerSpeed);
                isTimerOn = true;
                $(this).addClass("on");
            }
        });

        // 공통함수
        function showSlideBasic(n) {
            clearTimeout(timerId);
            $selector.find("ul.slide li").css({ display: "none" });
            $selector
                .find("ul.slide li:eq(" + (n - 1) + ")")
                .css({ display: "block" });
            $selector.find("ul.indicator li").removeClass("on");
            $selector
                .find("ul.indicator li:eq(" + (n - 1) + ")")
                .addClass("on");
            slideNow = n;
            slideNext = n + 1 > numSlide ? 1 : n + 1;
            slidePrev = n - 1 < 1 ? numSlide : n - 1;
            if (isTimerOn === true) {
                timerId = setTimeout(function () {
                    showSlide(slideNext);
                }, timerSpeed);
            }
        } // end of showSlideBasic

        function showSlideFade(n) {
            if (slideNow === n || onPlaying === true) return false; // 현재 위치 네비 누르면 재실행 막기 || 애니메이션 중 클릭해서 애니메이션 쌓이는 것 막기
            clearTimeout(timerId);
            if (slideNow === 0) {
                $selector.find("ul.slide li").css({ display: "none" });
                $selector
                    .find("ul.slide li:eq(" + (n - 1) + ")")
                    .css({ display: "block" });
            } else {
                onPlaying = true;
                $selector
                    .find("ul.slide li:eq(" + (slideNow - 1) + ")")
                    .stop(true)
                    .animate({ opacity: 0 }, fadeSpeed, function () {
                        onPlaying = false;
                    });
                $selector
                    .find("ul.slide li:eq(" + (n - 1) + ")")
                    .css({ display: "block", opacity: 0 })
                    .stop(true)
                    .animate({ opacity: 1 }, fadeSpeed);
            }
            $selector.find("ul.indicator li").removeClass("on");
            $selector
                .find("ul.indicator li:eq(" + (n - 1) + ")")
                .addClass("on");
            slideNow = n;
            slideNext = n + 1 > numSlide ? 1 : n + 1;
            slidePrev = n - 1 < 1 ? numSlide : n - 1;
            if (isTimerOn === true) {
                timerId = setTimeout(function () {
                    showSlide(slideNext);
                }, timerSpeed);
            }
        } // end of showSlideFade

        function showSlideSwipe(n) {
            clearTimeout(timerId);
            if (slideNow === 0) {
                // 시작할 때
                $selector.find("ul.slide li").each(function (i) {
                    $(this).css({ left: i * 100 + "%", display: "block" }); // 옆으로 밀 때 흰 화면 안 보이게 하기 위한 display: block;
                });
                $selector
                    .find("ul.slide")
                    .css({ transition: "none", left: -(n - 1) * 100 + "%" });
            } else {
                $selector
                    .find("ul.slide")
                    .css({ transition: "all .5s", left: -(n - 1) * 100 + "%" });
            }
            $selector.find("ul.indicator li").removeClass("on");
            $selector
                .find("ul.indicator li:eq(" + (n - 1) + ")")
                .addClass("on");
            slideNow = n;
            slideNext = n + 1 > numSlide ? 1 : n + 1;
            slidePrev = n - 1 < 1 ? numSlide : n - 1;
            if (isTimerOn === true) {
                timerId = setTimeout(function () {
                    showSlide(slideNext);
                }, timerSpeed);
            }
        } // end of showSlideSwipe

        function showSlideAnimation(n) {
            if (slideNow === n || onPlaying === true) return false; // 현재 위치 네비 누르면 재실행 막기 || 애니메이션 중 클릭해서 애니메이션 쌓이는 것 막기
            clearTimeout(timerId);
            if (slideNow === 0) {
                $selector.find("ul.slide li").css({ display: "none" });
                $selector
                    .find("ul.slide li:eq(" + (n - 1) + ")")
                    .css({ display: "block" });
            } else {
                onPlaying = true;
                $selector
                    .find("ul.slide li:eq(" + (slideNow - 1) + ")")
                    .attr({ class: "off" })
                    .one("animationend", function () {
                        onPlaying = false;
                    });
                $selector
                    .find("ul.slide li:eq(" + (n - 1) + ")")
                    .css({ display: "block", opacity: 0 })
                    .attr({ class: "on" });
            }
            $selector.find("ul.indicator li").removeClass("on");
            $selector
                .find("ul.indicator li:eq(" + (n - 1) + ")")
                .addClass("on");
            slideNow = n;
            slideNext = n + 1 > numSlide ? 1 : n + 1;
            slidePrev = n - 1 < 1 ? numSlide : n - 1;
            if (isTimerOn === true) {
                timerId = setTimeout(function () {
                    showSlide(slideNext);
                }, timerSpeed);
            }
        } // end of showSlideAnimation
    }); // end of each
}; // end of jquery function - setImageSlide

// GNB
function gnbUI() {
    $("#gnb > li > a").on("mouseenter", function () {
        $("#gnb > li").removeClass("open");
        $(this).parent().addClass("open");
    });
    $("#gnb > li")
        .on("focusin", function () {
            $(this).addClass("open");
        })
        .on("focusout", function () {
            $(this).removeClass("open");
        }); // 버블링 이용
    $("#header").on("mouseleave", function () {
        $("#gnb > li").removeClass("open");
    });
} // end of gnbUI

// GNB 서브페이지 표시 기능
function checkCurrentMenu() {
    var dataMenu = $("body").attr("class").split(" ");
    if (dataMenu[0] !== "sub") return false;
    $("#gnb > li").each(function () {
        if (dataMenu[1] === $(this).attr("data-menu")) {
            $(this).addClass("on");
        }
    });
    $("#gnb > li.on > ul > li   ").each(function () {
        if (dataMenu[2] === $(this).attr("data-menu")) {
            $(this).addClass("on");
        }
    });
} // end of checkCurrentMenu

// 문화유산정보 slide banner
$.fn.setSlideBanner = function (options) {
    var settings = $.extend(
        {
            isTimerOn: true,
            timerSpeed: 3000,
            widthMove: 300,
            widthMoveUnit: 2,
        },
        options
    );

    this.each(function () {
        var $selector = $(this);
        var offsetLeft = 0;
        var minOffsetLeft = 0;
        var widthBox = $selector.find("div.box").innerWidth();
        var widthBar = 0;
        var widthMove =
            $selector.find("ul.banner li:eq(0)").outerWidth(true) *
            settings.widthMoveUnit;
        if (
            options.widthMove !== undefined &&
            options.widthMoveUnit === undefined
        ) {
            widthMove = settings.widthMove;
        }
        var timerId = "";
        var timerSpeed = settings.timerSpeed;
        var isTimerOn = settings.isTimerOn;

        // 초기화
        $selector.find("ul.banner li").each(function () {
            widthBar += $(this).outerWidth(true);
        });
        $selector.find("ul.banner").css({ width: widthBar + "px" });
        minOffsetLeft = -(widthBar - widthBox);
        if (isTimerOn === true) {
            timerId = setTimeout(function () {
                moveSlide("next", "auto");
            }, timerSpeed);
            $selector.find("p.control a.play").addClass("on");
        } else {
            $selector.find("p.control a.play").removeClass("on");
        }

        // 이벤트
        $selector.find("p.control a.prev").on("click", function () {
            moveSlide("prev", "manual");
        });
        $selector.find("p.control a.next").on("click", function () {
            moveSlide("next", "manual");
        });
        $selector.find("p.control a.play").on("click", function () {
            if (isTimerOn === true) {
                clearTimeout(timerId);
                isTimerOn = false;
                $(this).removeClass("on");
            } else {
                timerId = setTimeout(function () {
                    moveSlide("next", "auto");
                }, timerSpeed);
                isTimerOn = true;
                $(this).addClass("on");
            }
        });

        // 공통함수
        function moveSlide(direction, type) {
            // type: timer가 돌리는 next와 사람이 누르는 next를 구분하는 변수
            clearTimeout(timerId);
            if (direction === "prev") {
                if (offsetLeft === 0) {
                    $selector
                        .find("ul.banner")
                        .stop(true)
                        .animate({ left: "10px" }, 50)
                        .animate({ left: 0 }, 100);
                } else {
                    offsetLeft += widthMove;
                    if (offsetLeft > 0) offsetLeft = 0;
                    $selector
                        .find("ul.banner")
                        .stop()
                        .animate({ left: offsetLeft + "px" }, 300);
                }
            } else {
                if (offsetLeft === minOffsetLeft) {
                    if (type === "auto") {
                        offsetLeft = 0;
                        $selector
                            .find("ul.banner")
                            .stop(true)
                            .animate({ left: offsetLeft + "px" }, 300);
                    } else {
                        $selector
                            .find("ul.banner")
                            .stop(true)
                            .animate({ left: offsetLeft - 10 + "px" }, 50)
                            .animate({ left: offsetLeft + "px" }, 100);
                    }
                } else {
                    offsetLeft -= widthMove;
                    if (offsetLeft < minOffsetLeft) offsetLeft = minOffsetLeft;
                    $selector
                        .find("ul.banner")
                        .stop()
                        .animate({ left: offsetLeft + "px" }, 300);
                }
            } // end of if
            if (isTimerOn === true) {
                // 타이머를 지속적으로 돌려주는 설정
                timerId = setTimeout(function () {
                    moveSlide("next", "auto");
                }, timerSpeed);
            }
        } // end of moveSlide
    }); // end of each
}; // end of jquery function - setSlideBanner

// 공지사항 카테고리 클릭
function mainNtc() {
    $("#notice .ntc-tit > li").click(function () {
        $(this).siblings().find("a").removeClass("active");
        $(this).find("a").addClass("active");
        $(this).siblings().find("span").removeClass("active");
        $(this).find("span").addClass("active");
        $(this).siblings().find("ul").hide();
        $(this).find("ul").show();
    });
    $("#notice .ntc-tit > li").eq(0).trigger("click");
} // end of mainNtc

// 홍보영상
function mainVid() {
    $("#video .play a").click(function () {
        $("#video .popup-vid").fadeIn();
        $(".top").fadeOut();
    });
    $("#video .close a").click(function () {
        $("#video .popup-vid").fadeOut();
        $(".top").fadeIn();
    });
} // end of mainVid

// 탑 버튼
function topBtn() {
    $(window).scroll(function () {
        var nowScroll = $(window).scrollTop();
        var showBtn = $("#container").position().top;
        if (nowScroll >= showBtn) {
            $(".top").fadeIn();
        } else {
            $(".top").hide();
        }
    }); //scroll
    $(".top a").click(function () {
        var pos = $("#header").position().top;
        $("html, body").animate({ scrollTop: pos });
    });
} // end of topBtn
