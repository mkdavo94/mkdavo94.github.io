function myFunction() {
    var x = document.getElementById("main");
    if (x.style.display === "flex") {
        x.style.display = "none";
    } else {
        x.style.display = "flex";
    }

}



$(function () {

})
$(function(){
    var shrinkHeader = 10;
    $(window).scroll(function() {
        var scroll = getCurrentScroll();
        if ( scroll >= shrinkHeader ) {
            $('.main').addClass('shrink');
        }
        else {
            $('.main').removeClass('shrink');
        }
    });
    function getCurrentScroll() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }
});

$(document).ready(function() {

    var scrollLink = $('.scroll');


    scrollLink.click(function(e) {
        e.preventDefault();
        $('body,html').animate({
            scrollTop: $(this.hash).offset().top + .4
        }, 1000 );
    });


    function validateEmail(tel) {
        var re = /^\d[\d\(\)\ -]{4,14}\d$/
        ;
        return re.test(tel);
    }

    function closeForm() {
        document.contactform.name.value = '';
        document.contactform.tel.value = '';

        $('.tel').removeClass('typing');
        $('.name').removeClass('typing');

        $('.cd-popup').removeClass('is-visible');
        $('.notification').addClass('is-visible');
        $('#notification-text').html("СПАСИБО ЗА ЗАЯВКУ!  <p>Наш менеджер скоро свяжется  с вами.</p>");
    }

    $(document).ready(function($) {


        $('.contacttur').on('click', function(event) {
            event.preventDefault();

            $('#contactblurb').html('ЗАКАЗАТЬ ТУР');
            $('.contact').addClass('is-visible');

            if ($('#name').val().length != 0) {
                $('.name').addClass('typing');
            }
            if ($('#tel').val().length != 0) {
                $('.tel').addClass('typing');
            }

        });

        $('.cd-popup').on('click', function(event) {
            if ($(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup')) {
                event.preventDefault();
                $(this).removeClass('is-visible');
            }
        });

        $(document).keyup(function(event) {
            if (event.which == '27') {
                $('.cd-popup').removeClass('is-visible');
            }
        });


        $('#name').keyup(function() {
            $('.name').addClass('typing');
            if ($(this).val().length == 0) {
                $('.name').removeClass('typing');
            }
        });
        $('#tel').keyup(function() {
            $('.tel').addClass('typing');
            if ($(this).val().length == 0) {
                $('.tel').removeClass('typing');
            }
        });



        $('#contactform').submit(function() {
            var name = $('#name').val();
            var tel = $('#tel').val();


            if (name) {
                if (validateEmail(tel)) {




                            var spreadsheetFields = {
                                "entry.212312005": name,
                                "entry.1226278897": tel
                            };
                            $.ajax({
                                url: "#",
                                data: spreadsheetFields,
                                type: "",
                                dataType: "xml",
                                statusCode: {
                                    0: function() {

                                    },
                                    200: function() {

                                    }
                                }
                            });


                            closeForm();


                } else {
                    $('#notification-text').html('<strong>Прошу написать правильное имя.</strong>');
                    $('.notification').addClass('is-visible');
                }
            } else {
                $('#notification-text').html('<h3><strong><em>Прошу написать правильное емайл.</em></strong></h3>');
                $('.notification').addClass('is-visible');
            }

            return false;
        });
    });















});
(function () {


    function throttle(fn, delay, scope) {
        // Default delay
        delay = delay || 500
        var last, defer;
        return function () {
            var context = scope || this,
                now = +new Date(),
                args = arguments;
            if (last && now < last + delay) {
                clearTimeout(defer);
                defer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, delay);
            } else {
                last = now;
                fn.apply(context, args);
            }
        }
    }

    function extend(destination, source) {
        for (var k in source) {
            if (source.hasOwnProperty(k)) {
                destination[k] = source[k];
            }
        }
        return destination;
    }


    var ScrollManager = (function () {

        var defaults = {

                steps: null,
                navigationContainer: null,
                links: null,
                scrollToTopBtn: null,

                navigationElementClass: '.Quick-navigation',
                currentStepClass: 'active',
                smoothScrollEnabled: true,
                stepsCheckEnabled: true,


                onScroll: null,

                onStepChange: function (step) {
                    var self = this;
                    var relativeLink = [].filter.call(options.links, function (link) {
                        link.classList.remove(self.currentStepClass);
                        return link.hash === '#' + step.id;
                    });
                    relativeLink[0].classList.add(self.currentStepClass);
                },

                smoothScrollAnimation: function (target) {
                    $('html, body').animate({
                        scrollTop: target
                    }, 'slow');
                }
            },

            options = {};

        var _animation = null,
            currentStep = null,
            throttledGetScrollPosition = null;

        return {

            scrollPosition: 0,

            init: function (opts) {

                options = extend(defaults, opts);

                if (options.steps === null) {
                    console.warn('Smooth scrolling require some sections or steps to scroll to :)');
                    return false;
                }

                _animation = function (target) {
                    target = typeof target === 'number' ? target : $(target).offset().top + .4;
                    return options.smoothScrollAnimation(target);
                };

                if (options.smoothScrollEnabled)  this.smoothScroll();

                if (options.scrollToTopBtn) {
                    options.scrollToTopBtn.addEventListener('click', function () {
                        options.smoothScrollAnimation(0);
                    });
                }

                throttledGetScrollPosition = throttle(this.getScrollPosition).bind(this);
                window.addEventListener('scroll', throttledGetScrollPosition);
                window.addEventListener('resize', throttledGetScrollPosition);

                this.getScrollPosition();
            },

            getScrollPosition: function () {
                this.scrollPosition = window.pageYOffset || window.scrollY;
                if (options.stepsCheckEnabled) this.checkActiveStep();
                if (typeof  options.onScroll === 'function') options.onScroll(this.scrollPosition);
            },

            scrollPercentage: function () {
                var body = document.body,
                    html = document.documentElement,
                    documentHeight = Math.max(body.scrollHeight, body.offsetHeight,
                        html.clientHeight, html.scrollHeight, html.offsetHeight);

                var percentage = Math.round(this.scrollPosition / (documentHeight - window.innerHeight) * 100);
                if (percentage < 0)  percentage = 0;
                if (percentage > 100)  percentage = 100;
                return percentage;
            },

            doSmoothScroll: function (e) {
                if (e.target.nodeName === 'A') {
                    e.preventDefault();
                    if (location.pathname.replace(/^\//, '') === e.target.pathname.replace(/^\//, '') && location.hostname === e.target.hostname) {
                        var targetStep = document.querySelector(e.target.hash);
                        targetStep ? _animation(targetStep) : console.warn('Hi! You should give an animation callback function to the Scroller module! :)');
                    }
                }
            },

            smoothScroll: function () {
                if (options.navigationContainer !== null) options.navigationContainer.addEventListener('click', this.doSmoothScroll);
            },

            checkActiveStep: function () {
                var scrollPosition = this.scrollPosition;

                [].forEach.call(options.steps, function (step) {
                    var bBox = step.getBoundingClientRect(),
                        position = step.offsetTop,
                        height = position + bBox.height;

                    if (scrollPosition >= position && scrollPosition < height && currentStep !== step) {
                        currentStep = step;
                        step.classList.add(self.currentStepClass);
                        if (typeof options.onStepChange === 'function') options.onStepChange(step);
                    }
                    step.classList.remove(options.currentStepClass);
                });
            },

            destroy: function () {
                window.removeEventListener('scroll', throttledGetScrollPosition);
                window.removeEventListener('resize', throttledGetScrollPosition);
                options.navigationContainer.removeEventListener('click', this.doSmoothScroll);
            }
        }
    })();


    var scrollToTopBtn = document.querySelector('.Scroll-to-top'),
        steps = document.querySelectorAll('.js-scroll-step'),
        navigationContainer = document.querySelector('.Quick-navigation'),
        links = navigationContainer.querySelectorAll('a'),
        progressIndicator = document.querySelector('.Scroll-progress-indicator');

    ScrollManager.init({
        steps: steps,
        scrollToTopBtn: scrollToTopBtn,
        navigationContainer: navigationContainer,
        links: links,

        onScroll: function () {
            var percentage = ScrollManager.scrollPercentage();
            percentage >= 90 ? scrollToTopBtn.classList.add('visible') : scrollToTopBtn.classList.remove('visible');

            if (percentage >= 10) {
                progressIndicator.innerHTML = percentage + "%";
                progressIndicator.classList.add('visible');
            } else {
                progressIndicator.classList.remove('visible');
            }
        },


    });



})();

$(document).ready(function () {
    $('.slider').slick();


    $('.luchshie').slick({
        lazyLoad: 'ondemand',
        slidesToShow: 4,
        slidesToScroll: 1
    });

    var videoPlayButton,
        videoWrapper = document.getElementsByClassName('video-wrapper')[0],
        video = document.getElementsByTagName('video')[0],
        videoMethods = {
            renderVideoPlayButton: function() {
                if (videoWrapper.contains(video)) {
                    this.formatVideoPlayButton();
                    video.classList.add('has-media-controls-hidden');
                    videoPlayButton = document.getElementsByClassName('video-overlay-play-button')[0];
                    videoPlayButton.addEventListener('click', this.hideVideoPlayButton);
                }
            },

            formatVideoPlayButton: function() {
                videoWrapper.insertAdjacentHTML('beforeend', '\
                <svg class="video-overlay-play-button" viewBox="0 0 200 200" alt="Play video">\
                    <circle cx="100" cy="100" r="90" fill="#5cbc16" stroke-width="15" stroke="#5cbc16"/>\
                    <polygon points="70, 55 70, 145 145, 100" fill="white" style=""/>\
                </svg>\
            ')
            },

            hideVideoPlayButton: function() {
                video.play();
                videoPlayButton.classList.add('is-hidden');
                video.classList.remove('has-media-controls-hidden');
                video.setAttribute('controls', 'controls')
            }
        };

    videoMethods.renderVideoPlayButton()










});
























