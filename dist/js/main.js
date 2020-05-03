$(document).ready(function () {
    // input placeholders
    $('.input__field').on('focus keyup change', function () {
        if ($(this).val() != "") {
            $(this).addClass('complete');
        } else {
            $(this).removeClass('complete');
        }
    });

    // custom select
    $('.select-custom-currency').select2({
        minimumResultsForSearch: -1,
        // placeholder: "Currency *",
        allowClear: false
    });

    $('.select-custom-category').select2({
        minimumResultsForSearch: -1,
        // placeholder: "All category",
        allowClear: false
    });

    // Input Toggle

    $('.input__toggle').on('click', function (e) {
        e.preventDefault();
        let $input = $(this).closest('.input').find('input');

        $(this).find('svg').toggleClass('hidden');

        if ($input.attr('type') === 'password') {
            $input.attr('type', 'text');
        } else {
            $input.attr('type', 'password');
        }
    });

    // Слайдеры

    let $mainSlider = $('.main-slider'),
        $mainSliderWrap = $mainSlider.closest('.main-slider__wrap');

    $mainSlider.slick({
        slidesToShow: 1,
        dots: true,
        autoplay: true,
        appendDots: $mainSliderWrap.find('.main-slider__dots'),
        prevArrow: $mainSliderWrap.find('.main-slider__prev'),
        nextArrow: $mainSliderWrap.find('.main-slider__next'),
        fade: true,
        cssEase: 'linear',
    });

    $('.winning-slider').slick({
        slidesToShow: 7,
        dots: false,
        autoplay: true,
        autoplaySpeed: 1250,

        responsive: [
            {
                breakpoint: 1555,
                settings: {
                    slidesToShow: 5,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    centerMode: true,
                }
            },
            {
                breakpoint: 601,
                settings: {
                    slidesToShow: 2,
                    centerMode: false,
                }
            },
            {
                breakpoint: 479,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 360,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                }
            }
        ]
    });

});