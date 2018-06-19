(function(){
    'use strict';

    var screenWidth = window.innerWidth;

    // эффекты только на больших экранах
    if( screenWidth > 992 ){
        new WOW().init();
    }

    // если есть скрол добавляем белыую подложку
    if( $(window).scrollTop() > 0 ){
        $('header').addClass('scrolled');
    }

    // в зависимости от позиции страницы меняет подложку шапки
    $(window).on('scroll', function(){
        if( $(window).scrollTop() > 0 ){
            $('header').addClass('scrolled');
        }
        else{
            $('header').removeClass('scrolled');
        }
    });


    $(window).on('resize', function(){
        var newWidth = window.innerWidth;
        if( newWidth != screenWidth ){
            $('header .header__links').removeClass('opened');
            $('.filter').removeAttr('style');
            $('.creation__tool_details').css('display', '')
            screenWidth = newWidth;
        }
    });


    // открытие меню
    $('#menu-btn').on('click', function(){
        $('header .header__links').addClass('opened');
        return false;
    });
    // закрытие меню
    $('#close-menu-btn').on('click', function(){
        $('header .header__links').removeClass('opened');
        return false;
    });
    // закрытие меню свайпом
    $('header .header__links').on('swiperight', function(){
        if( screenWidth < 992 ){
            $('header .header__links').removeClass('opened');
        }
        return false;
    });

    // переключение табов
    $('.tabs .tabs__links').on('click', 'a', function(){

        $(this).siblings('a').removeClass('active');
        $(this).addClass('active');

        $( $(this).attr('href') ).show();
        $( $(this).attr('href') ).siblings('.tabs__item').hide();

        return false;
    });

    // открытие попапа с формой входа и регистрации
    $('#auth-btn').on('click', function(){
        $('#overlay').show();
        $('#auth-popup').fadeIn(400);
        return false;
    });

    // закрытие попапа
    $('.popup').on('click', '.popup__close_btn', function () {
        $(this).closest('.popup').fadeOut(400);
        $('#overlay').hide();
        return false;
    });

    // закрытие попапов при нажатии на затемнение
    $('#overlay').on('click', function(){
        $('.popup').fadeOut(400);
        $('#overlay').hide();
    });


})();

