import Headroom from 'headroom.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import './modules/form';
import splitToLinesAndFadeUp from './modules/effects/splitLinesAndFadeUp';
import { lenis } from './modules/scroll/leniscroll';
import Swal from 'sweetalert2';

gsap.registerPlugin(ScrollTrigger);
gsap.core.globals('ScrollTrigger', ScrollTrigger);


const header = document.querySelector('.header');
const headroom = new Headroom(header, {});
headroom.init();
header.headroom = headroom;

//data-popup

function useState(initialValue) {
    let value = initialValue;
    const subscribers = [];

    function setValue(newValue) {
        value = newValue;
        subscribers.forEach((subscriber) => subscriber(value));
    }

    function getState() {
        return value;
    }

    function subscribe(callback) {
        subscribers.push(callback);
        return () => {
            const index = subscribers.indexOf(callback);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
        };
    }

    return [getState, setValue, subscribe];
}


const [formPopup, setFormPopup, useSetPopupEffect] = useState(false);

useSetPopupEffect(val => {
    const popup = document.querySelector('[data-popup]');
    popup.classList.toggle('active', val);
    document.body.classList.toggle('popup-open', val);
});

document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-popup-call]');
    if (target) {
        setFormPopup(true);

    }
});
document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-popup-close]');
    if (target || evt.target.classList.contains('popup')) {
        setFormPopup(false);
    }
});


const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
    if (window.screen.width < 1025) return;
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

const [menuState, setMenuState, useSetMenuEffect] = useState(false);

useSetMenuEffect(val => {
    const menu = document.querySelector('[data-menu]');
    // menu.classList.toggle('active', val);
    const tl = gsap.timeline({
        paused: true,
    });
    if (val) {
        tl.add(() => {
            menu.classList.add('active');
        })
            .fromTo(menu.querySelector('.menu__content'), { xPercent: 100 }, { xPercent: 0, duration: 1, ease: 'power4.inOut' })
            .fromTo(menu.querySelector('.menu__bg'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power4.inOut' })
    } else {
        tl.fromTo(menu.querySelector('.menu__content'), { xPercent: 0 }, { xPercent: 100, duration: 0.5, ease: 'power4.inOut' })
            .fromTo(menu.querySelector('.menu__bg'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.25, ease: 'power4.inOut' })
            .add(() => {
                menu.classList.remove('active');
            });
    }
    tl.play();


    if (val) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    document.body.classList.toggle('popup-open', val);
});

document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-menu-call]');
    if (target) {
        setMenuState(true);
    }
});

document.querySelectorAll('.menu__link').forEach(el => {
    el.addEventListener('click',function(evt){
        setMenuState(false);
    });
})

document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-menu-close]');
    if (target || evt.target.classList.contains('menu')) {
        setMenuState(false);
    }
});


document.querySelectorAll('[data-up-arrow]').forEach(el => {
    el.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});



const [callbackPopupOpen, setCallbackPopupOpen, useSetCallbackPopupEffect] = useState(false);

useSetCallbackPopupEffect(val => {
    const popup = document.querySelector('[data-callback-popup]');
    if (val) {
        gsap.timeline({})
            .add(() => {
                popup.classList.add('active');
            })
            .fromTo(popup.querySelector('.callback-popup__content'), { xPercent: 100 }, { xPercent: 0,           duration: 0.5, })
            .fromTo(popup.querySelector('.callback-popup__bg'), { autoAlpha: 0 }, { autoAlpha: 1,           ease: 'power4.inOut', })
    } else {
        gsap.timeline({})
            .fromTo(popup.querySelector('.callback-popup__content'), { xPercent: 0 }, { xPercent: 100 , duration: 0.5, ease: 'power4.inOut',})
            .fromTo(popup.querySelector('.callback-popup__bg'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.25, ease: 'power4.inOut' })
            .add(() => {
                popup.classList.remove('active');
            })
    }
    // popup.classList.toggle('active', val);
    document.body.classList.toggle('popup-open', val);
    // data-callback-popup-close
});

document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-callback-popup-call]');
    if (target) {
        setCallbackPopupOpen(true);
    }
});
document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-callback-popup-close]');
    if (target || evt.target.classList.contains('popup')) {
        setCallbackPopupOpen(false);
    }
});


const [buildPopupOpen, setBuildPopupOpen, useSetBuildPopupEffect] = useState(false);

//data-build-popup

useSetBuildPopupEffect(val => {
    const popup = document.querySelector('[data-build-popup]');
    popup.classList.toggle('active', val);
    document.body.classList.toggle('popup-open', val);
})

document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-build-popup-open]');
    if (target) {
        evt.preventDefault();
        evt.stopPropagation();
        setBuildPopupOpen(true);
    }
});

document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-build-popup-close]');
    if (target || evt.target.classList.contains('popup')) {
        setBuildPopupOpen(false);
    }
});

/** Mobile callback popup */
function mobPopupHandler() {
    const popup = document.querySelector('[data-mobile-callback-popup]');
    const call = document.querySelectorAll('[data-call-mobile-callback-popup]');
    const closeEl = document.querySelectorAll('[data-mobile-callback-close]');
    closeEl.forEach(el => {
        el.addEventListener('click', (evt) => {
            popup.classList.remove('active');

        });
    })

    popup.addEventListener('click', ({ target }) => {
        target === popup ? close(popup) : null;
    })
    call.forEach(el => el.addEventListener('click', (evt) => {
        if (window.screen.width <= 1024) {
            evt.preventDefault();
            popup.classList.add('active');
        }
    }));
    // call.forEach(el => el.addEventListener('touchstart', () => open(popup)));
}

mobPopupHandler();


splitToLinesAndFadeUp('[data-split-lines]', gsap);

document.querySelectorAll('.installment-block__img-wrap img').forEach(el => {
    // gsap.set(el, { scale: 1.05 });
    gsap.timeline({
        scrollTrigger: {
            trigger: el,
            scrub: 1,
        }
    })
        .to(el, { scale: 1.1, ease: 'none' });
});



function innerPagesBgParalax() {
    // .construction-page-bg img
    if (window.screen.width < 600) return;
    const bgImg = document.querySelector('[data-inner-page-bg]');
    if (!bgImg) return;
    gsap.timeline({
        scrollTrigger: {
            trigger: bgImg,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        }
    })
        // .to(bgImg, { scale: 1.05, ease: 'none' })
        .to(bgImg, { scale: 1.05, y: window.innerHeight * 0.35, ease: 'none' });
}

innerPagesBgParalax();


//data-installment-popup-text
//data-installment-popup-open

document.body.addEventListener('click', function installmentPopupHandler(evt) {
    const target = evt.target.closest('[data-installment-popup-open]');
    if (!target) return;
    const text = document.querySelector('[data-installment-popup-text]').innerHTML;
    Swal.fire({
        html: text,
        showCloseButton: true,
        showConfirmButton: false,
        showCancelButton: false,
        width: 600,
        focusConfirm: false,
        customClass: {
            popup: 'installment-popup',
            container: 'installment-popup-container',
            closeButton: 'popup-close',
            confirmButton: 'btn btn--primary',
        },
    });
});

document.body.addEventListener('click', function closeInstallmentPopup(evt) {
    const target = evt.target.closest('[data-installment-popup-close]');
    if (!target) return;
    Swal.close();
});