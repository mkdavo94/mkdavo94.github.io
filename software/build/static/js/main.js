
$(function () {
    var shrinkHeader = 10;
    $(window).scroll(function () {
        var scroll = getCurrentScroll();
        if (scroll >= shrinkHeader) {
            $('.header').addClass('shrink');
        }
        else {
            $('.header').removeClass('shrink');
        }
    });

    function getCurrentScroll() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }


    setTimeout(function() {
        $('#load').fadeOut('slow', function() {});
    }, 2000);

});

$(document).ready(function () {

    var scrollLink = $('.scroll');

    // Smooth scrolling
    scrollLink.click(function (e) {
        e.preventDefault();
        $('body,html').animate({
            scrollTop: $(this.hash).offset().top + .4
        }, 1000);
    });

    // Active link switching


});
(function () {

    //////////////////////
    // Utils
    //////////////////////
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

    //////////////////////
    // END Utils
    //////////////////////

    //////////////////////
    // Scroll Module
    //////////////////////

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

                // Callbacks
                onScroll: null,

                onStepChange: function (step) {
                    var self = this;
                    var relativeLink = [].filter.call(options.links, function (link) {
                        link.classList.remove(self.currentStepClass);
                        return link.hash === '#' + step.id;
                    });
                    relativeLink[0].classList.add(self.currentStepClass);
                },

                // Provide a default scroll animation
                smoothScrollAnimation: function (target) {
                    $('html, body').animate({
                        scrollTop: target
                    }, 'slow');
                }
            },

            options = {};

        // Privates
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

                // Allow to customize the animation engine ( jQuery / GSAP / velocity / ... )
                _animation = function (target) {
                    target = typeof target === 'number' ? target : $(target).offset().top + .4;
                    return options.smoothScrollAnimation(target);
                };

                // Activate smooth scrolling
                if (options.smoothScrollEnabled) this.smoothScroll();

                // Scroll to top handling
                if (options.scrollToTopBtn) {
                    options.scrollToTopBtn.addEventListener('click', function () {
                        options.smoothScrollAnimation(0);
                    });
                }

                // Throttle for performances gain
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
                if (percentage < 0) percentage = 0;
                if (percentage > 100) percentage = 100;
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
    //////////////////////
    // END scroll Module
    //////////////////////


    //////////////////////
    // APP init
    //////////////////////

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

        // Customize onScroll behavior
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

        // Behavior when a step changes
        // default : highlight links

        // onStepChange: function (step) {},

        // Customize the animation with jQuery, GSAP or velocity
        // default : jQuery animate()
        // Eg with GSAP scrollTo plugin

        //smoothScrollAnimation: function (target) {
        //		TweenLite.to(window, 2, {scrollTo:{y:target}, ease:Power2.easeOut});
        //}

    });

    //////////////////////
    // END APP init
    //////////////////////

    $(document).ready(function () {

        $("#responsive-menu-icon").click(function () {


            var nav = $(".header");
            var navHeight = nav.height();

            if (navHeight < 222) {

                TweenMax.to(nav, 1, {"height": 222});
            } else {
                TweenMax.to(nav, 1, {"height": 50});
            }

        });


        // menu icon jquery


        // when whole menu div is clicked


        $("#responsive-menu-icon").click(function () {
            // if the menu height is not full, transform icon
            var nav = $(".header");
            var navHeight = nav.height();

            if (navHeight < 222) {
                $("#a").addClass("rotate-down");
                $("#responsive-menu-icon").addClass("menu-up");
                $("#b").addClass("disappear");

                $("#c").addClass("rotate-up");


            } else {

                // if it's not less than full height, remove animation classes
                $("#a").removeClass("rotate-down");
                $("#responsive-menu-icon").removeClass("menu-up");
                $("#b").removeClass("disappear");

                $("#c").removeClass("rotate-up");


            }


        });


    });


    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function closeForm() {
        document.contactform.name.value = '';
        document.contactform.email.value = '';
        document.contactform.message.value = '';


        $('.email').removeClass('typing');
        $('.name').removeClass('typing');
        $('.message').removeClass('typing');

        $('.notification').addClass('is-visible');
        $('#notification-text').html("СПАСИБО ЗА ЗАЯВКУ!  <p>Наш менеджер скоро свяжется  с вами.</p>");
    }

    $(document).ready(function ($) {


        $('#contactblurb').html(' Let\'s work?');
        $('.contact').addClass('is-visible');

        if ($('#name').val().length != 0) {
            $('.name').addClass('typing');
        }
        if ($('#email').val().length != 0) {
            $('.email').addClass('typing');
        }
        if ($('#message').val().length != 0) {
            $('.message').addClass('typing');
        }






        $('#name').keyup(function () {
            $('.name').addClass('typing');
            if ($(this).val().length == 0) {
                $('.name').removeClass('typing');
            }
        });
        $('#email').keyup(function () {
            $('.email').addClass('typing');
            if ($(this).val().length == 0) {
                $('.email').removeClass('typing');
            }
        });
        $('#message').keyup(function () {
            $('.message').addClass('typing');
            if ($(this).val().length == 0) {
                $('.message').removeClass('typing');
            }
        });


        $('#contactform').submit(function () {
            var name = $('#name').val();
            var email = $('#email').val();
            var message = $('#message').val();

            if (name) {
                if (validateEmail(email)) {
                    if (message) {


                        var spreadsheetFields = {
                            "entry.212312005": name,
                            "entry.1226278897": email,
                            "entry.1835345325": message
                        };
                        $.ajax({
                            url: "#",
                            data: spreadsheetFields,
                            type: "",
                            dataType: "xml",
                            statusCode: {
                                0: function () {

                                },
                                200: function () {

                                }
                            }
                        });


                        closeForm();
                    } else {
                        $('#notification-text').html("<strong>Please let us know what you're thinking</strong>");
                        $('.notification').addClass('is-visible');
                    }

                } else {
                    $('#notification-text').html('<strong>Please use a valid email address.</strong>');
                    $('.notification').addClass('is-visible');
                }
            } else {
                $('#notification-text').html('<h3><strong><em>Please provide a name.</em></strong></h3>');
                $('.notification').addClass('is-visible');
            }

            return false;
        });
    });









})();