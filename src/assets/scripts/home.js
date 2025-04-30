import Swiper, { EffectFade, Mousewheel, Navigation, Autoplay } from 'swiper';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { pad, useState } from './modules/helpers/helpers';
import splitToLinesAndFadeUp from './modules/effects/splitLinesAndFadeUp';

// const header = document.querySelector('.header');

// const headroom = new Headroom(header, {});
// headroom.init();

gsap.registerPlugin(ScrollTrigger);
gsap.core.globals('ScrollTrigger', ScrollTrigger);

Swiper.use([Mousewheel, Navigation]);


function frontScreenStartAnimation() {

}

window.addEventListener('load', () => {
  
  const tl = gsap.timeline({
    paused: true,
  })
    .fromTo('.front-screen__decor, .front-screen__title', {
      autoAlpha: 0,
      y: 50,
    }, {
      autoAlpha: 1,
      y: 0,
      duration: 1.5,
      ease: 'power4.out',   
      stagger: 0.2
    })
    .add(() => {
      document.querySelectorAll('[data-remove-style-on-load]').forEach((el) => {
        
        el.remove();
      })
    });

    tl.play(0);
  ;

  
}, { once: true });

frontScreenStartAnimation();

const sketchScenes = {
  0: {
    image: {
      backgroundSize: '100%',
      backgroundPosition: '50% 50%',
    },
    title1: true,
  },
  1: {
    image: {
      // backgroundSize: '233%',
      // backgroundPosition: '100% 50%',
      backgroundPosition: '95% 62%',
      backgroundSize: '300%'
    },
  },
  2: {
    image: {
      backgroundPosition: '82% 68%',
      backgroundSize: '269%',
    },
  },
  3: {
    image: {
      backgroundPosition: '31% 80%',
      backgroundSize: '400%',
    },
  },
  4: {
    image: {
      backgroundPosition: '6% 73%',
      backgroundSize: '341%',
    },
  },
  5: {
    image: {
      backgroundSize: '315%',
      backgroundPosition: '24% 45%',
    },
  },
  6: {
    image: {
      backgroundPosition: '52% 40%',
      backgroundSize: '340%',
    },
  },
  7: {
    image: {
      backgroundSize: '100%',
      backgroundPosition: '50% 50%',
    },
    title2: true,
  },
}
function sketchHandler() {
  //data-sketch-image
  const sketch = document.querySelector('[data-sketch]');
  const sketchImage = sketch.querySelector('[data-sketch-image]');

  const sketchTitles1 = sketch.querySelectorAll('[data-sketch-scene1-title]');
  const sketchTitles2 = sketch.querySelectorAll('[data-sketch-scene-end-title]');

  gsap.set(sketchTitles1, { autoAlpha: 0 });
  gsap.set(sketchTitles2, { autoAlpha: 0 });

  document.querySelectorAll('[data-sketch-play]').forEach((el, index) => {
    const card = el.querySelector('.card');
    // if (window.innerWidth > 600) return;
    if (!card) return;
    const isMobile = window.screen.width < 600;
    const startProps = isMobile ?
    `${window.innerHeight * 0.75} 50%` : `-5% 50%`;
    const endProps = isMobile ? 
    `${window.innerHeight * 0.95} 50%`:  `0 50%`;
    const cardTl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: startProps,
        end: endProps,
        scrub: 1,
        // markers: true,
      }
    })
    const animationProps = isMobile
      ? { x: index % 2 === 0 ? 50 : -50, autoAlpha: 0 }
      : { autoAlpha: 0, y: 50 };

    const targetProps = isMobile
      ? { x: 0, autoAlpha: 1 }
      : { autoAlpha: 1, y: 0 };

    cardTl.fromTo(card, animationProps, targetProps);
  })
  // const sketchEndScreenPin = createResponsiveTimeline({
  //   createTimelineFn: () => {
  //     return gsap.timeline({
  //       defaults: {
  //         ease: 'none',
  //         force3D: true,
  //       },
  //       scrollTrigger: {
  //         trigger: '[data-sketch-end]',
  //         start: 'top bottom',
  //         end: `${window.innerHeight} bottom`,
  //         scrub: 0,
  //         markers: false,
  //       }
  //     })
  //     .to(sketch, {
  //       y: window.innerHeight * -1,
  //       ease: 'none'
  //     })

  //   }
  // })
  const sketchStartScreenPin = createResponsiveTimeline({
    createTimelineFn: () => {
      return gsap.timeline({
        defaults: {
          ease: 'none',
          force3D: true,
        },
        scrollTrigger: {
          trigger: '.front-screen',
          start: '0% top',
          end: `100% top`,
          scrub: 0,
          markers: false,
        }
      })
      .add(() => {
        console.log('updateTimeline');
      })
      .from(sketch, {
        y: window.innerHeight,
        ease: 'none'
      });
    },
    debounceDelay: 300,
  });
  
  return function(sceneNumber, params = {}) {
    if (window.innerWidth > 600) return;
    gsap.timeline()
      .to(sketchImage, {
        ...sketchScenes[sceneNumber].image,
        duration: 1.5,
        ease: 'power4.inOut',
        ...params
      })
      .to(sketchTitles1, {
        autoAlpha: sketchScenes[sceneNumber].title1 ? 1 : 0,
        duration: 0.25,
        ease: 'power4.inOut',
      }, '<')
      .to(sketchTitles2, {
        autoAlpha: sketchScenes[sceneNumber].title2 ? 1 : 0,
        duration: 0.25,
        ease: 'power4.inOut',
      }, '<');
  }
}

const sketch = sketchHandler();


sketch(0);

document.querySelectorAll('[data-sketch-play]').forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 50%',
    end: 'bottom 50%',
    markers: false,
    onEnter: () => {
      const sceneNumber = el.getAttribute('data-sketch-play');
      sketch(sceneNumber);
    },
    onEnterBack: () => {
      const sceneNumber = el.getAttribute('data-sketch-play');
      sketch(sceneNumber);
    },
  });
});



function frontScreenSlider() {
  const slider = document.querySelector('[data-front-screen-slider]');
  if (!slider) return;
  const speed = 500;
  const delay = 5000;
  const swiper = new Swiper(slider, {
    modules: [EffectFade, Autoplay],
    effect: 'fade',
    loop: true,
    autoplay: { delay: delay - speed },
    speed, 
    init: false,
  });
  swiper.on('afterInit', animateOnInit);
  swiper.on('slideChange', () => {
    animate(swiper, delay / 1000);
  });
  swiper.init();

  function animateOnInit() {
    gsap.fromTo(slider.querySelector('.swiper-slide-active img'), {
      scale: 1
    },{
      scale: 1.1, duration: delay / 1000, ease: 'none',
    })
  }

  function animate(swipe, duration = 0) {
    const slide = slider.querySelector('.swiper-slide-next img');

    if (swipe.realIndex % 2 == 0) {
      const scale = gsap.utils.mapRange(delay, 0, 1, 1.1, duration);
      gsap.fromTo(slide, {
        scale: 1
      },{
        scale: scale, duration, ease: 'none',
      })
    } else{
      const scale = gsap.utils.mapRange(0, delay, 1.1, 1, duration);
      gsap.fromTo(slide, {
        scale: scale
      },{
        scale: 1, duration, ease: 'none',
      })
    }
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        swiper.autoplay.resume();
        animate(swiper, swiper.autoplay.timeLeft / 1000);
      } else {
        swiper.autoplay.pause();
      }
    });
  }, { threshold: 0.5 });
  observer.observe(slider);

}

frontScreenSlider();

document.querySelectorAll('[data-home-down]').forEach((el) => {
  el.addEventListener('click', () => {
    document.querySelector('[data-sketch-play]').scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  })
})

function sketchPopupHandler() {
  const popup = document.querySelector('[data-sketch-popup]');
  const $popupContent = popup.querySelector('[data-sketch-popup-content]');

  const [open, setOpen, subscribeOpen] = useState(false);
  const [ content, setContent, subscribeContent ] = useState('');

  // data-sketch-popup-content


  subscribeContent((state) => {
    if (state) {
      $popupContent.innerHTML = state;
    }
  });

  subscribeOpen((state) => {
    if (state) {
      gsap.timeline()
        .set(popup.querySelector('.text-popup__bg'), {
          autoAlpha: 0,
        })
        .set(popup, {
          autoAlpha: 1,
        })
        .fromTo(popup.querySelector('.text-popup__content'), 
          { xPercent: 100 }, 
          { xPercent: 0, duration: 1, ease: 'power4.inOut' }
        )
        .fromTo(popup.querySelector('.text-popup__bg'), 
          { autoAlpha: 0 }, 
          { autoAlpha: 1, duration: 1, ease: 'power4.inOut' }, 
          '<'
        )
    } else {
      gsap.timeline()
        .to(popup.querySelector('.text-popup__content'), {
          xPercent: 100,
          duration: 0.5,
          ease: 'power4.inOut',
        })
        .to(popup.querySelector('.text-popup__bg'), {
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power4.inOut',
        }, '<')
        .set(popup, {
          autoAlpha: 0,
        })
    }

    document.body.classList.toggle('popup-open', state);
  });


  document.body.addEventListener('click', (e) => {
    if (e.target.closest('[data-sketch-popup-close]')) {
      setOpen(false);
    } else if (e.target.closest('[data-sketch-popup-open]')) {
      setOpen(true);
    }
  });

  document.body.addEventListener('click', function setSketchPopupContent(e) {
    const target = e.target.closest('[data-sketch-popup-content]');
    if (!target) return;
    const attribute = target.getAttribute('data-sketch-popup-content');
    const template = document.getElementById(attribute);
    
    if (!template) return;
    setContent(template.innerHTML);
  })
}

sketchPopupHandler();



function infoSectionParalax() {
  const img1 = document.querySelector('.info-section__img--first img');
  const img2 = document.querySelector('.info-section__img--second img');
  const maxOffsetInPercent = 30;
  const yPercentage = window.innerWidth * maxOffsetInPercent / 1920;

  gsap.set([img1, img2], {
    scale: 1.2,
  })

  gsap.timeline({
    scrollTrigger: {
      trigger: '.info-section',
      scrub: 1
    }
  })
  .fromTo('.info-section__decor1 svg', {
    yPercent: yPercentage,
  }, {
    yPercent: yPercentage*-1
  },'<')
  .fromTo('.info-section__decor2 svg', {
    yPercent: yPercentage,
  }, {
    yPercent: yPercentage*-1
  }, '<')
  .fromTo(img1, {
    y: 50,
  }, {
    y: 50*-1
  },'<')
  .fromTo(img2, {
    y: 50,
  }, {
    y: 50*-1
  }, '<');


  const card1 = document.querySelector('.info-section__card--card1');
  const card2 = document.querySelector('.info-section__card--card2');

  [card1, card2].forEach((el) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        once: true,
      }
    })
    .fromTo(el, {
      y: 50,
      autoAlpha: 0,
    }, {
      y: 0,
      autoAlpha: 1,
    },'<');

  })

}

infoSectionParalax();


function infoSection2Paralax() {
  const el = document.querySelector('.info-section2__img')
  gsap.timeline({
    defaults: {
        force3D: true,
        ease: 'none'
    },
    scrollTrigger: {
        trigger: el,
        scrub: true,
    }
    
})
    .fromTo(el.querySelector('.info-section2__img-wrap'), {
        y: -100,
    }, {
        y: 100,
    })
    .fromTo(el.querySelector('img'), {
        scale: 1.2
    }, {
        scale: 1
    }, '<');
}

infoSection2Paralax();

function infoSection3Paralax() {
  const el = document.querySelector('.info-section3');
  const images = el.querySelectorAll('[class*="info-section3__img"]');
  images.forEach((image) => {
    gsap.set(image.querySelector('img'), {
      scale: 1.1,
    });
    gsap.timeline({
      defaults: {
          force3D: true,
          ease: 'none'
      },
      scrollTrigger: {
          trigger: image,
          scrub: true,
      }
      
  })
      .fromTo(image.querySelector('[class*="-wrap"]'), {
          y: -50,
      }, {
          y: 50,
      })
      .fromTo(image.querySelector('img'), {
          scale: 1.1
      }, {
          scale: 1
      }, '<');
  });
}

infoSection3Paralax();


function infoSection4Paralax() {
  const img = document.querySelector('.info-section4__img img');
  const decor = document.querySelector('.info-section4__decor svg');

  const maxOffsetInPercent = 30;
  const yPercentage = window.innerWidth * maxOffsetInPercent / 1920;

  gsap.set([img], {
    scale: 1.2,
  })

  gsap.timeline({
    scrollTrigger: {
      trigger: '.info-section4',
      scrub: 1
    }
  })
  .fromTo(decor, {
    yPercent: yPercentage*-1,
  }, {
    yPercent: yPercentage
  },'<')
  .fromTo(img, {
    y: 0,
  }, {
    y: 50
  },'<');


  const card1 = document.querySelector('.info-section4__card.card1');
  const card2 = document.querySelector('.info-section4__card.card2');

  [card1, card2].forEach((el) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        once: true,
      }
    })
    .fromTo(el, {
      y: 50,
      autoAlpha: 0,
    }, {
      y: 0,
      autoAlpha: 1,
    },'<');
  });

  // gsap.timeline({
  //   scrollTrigger: {
  //     trigger: '.info-section',
  //     once: true,
  //     start: '30% 50%',
  //   }
  // })
  // .fromTo([card1, card2], {
  //   y: 50,
  //   autoAlpha: 0,
  // }, {
  //   y: 0,
  //   autoAlpha: 1,
  //   stagger: 0.2,
  // },'<');
}

infoSection4Paralax();


function techInfoParalax() {
  const img = document.querySelector('.tech-info__bg img');

  gsap.set([img], {
    scale: 1.2,
  })
  gsap.timeline({
    scrollTrigger: {
      trigger: '.tech-info',
      scrub: 1
    }
  })
  .fromTo(img, {
    y: -50,
  }, {
    y: 50
  },'<')
}

techInfoParalax();

splitToLinesAndFadeUp('[data-split-lines-and-fade-up]', gsap);


function createResponsiveTimeline({
  createTimelineFn,
  debounceDelay = 300
}) {

  if (window.screen.width < 600) {
    return createTimelineFn();
  }
  let resizeTimeout;
  let timeline = null;

  function updateTimeline() {
    if (timeline) {
      timeline.scrollTrigger.kill(true);
      timeline.kill(true);
      timeline = null;
    }
    timeline = createTimelineFn();
  }

  window.addEventListener('resize', () => {

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateTimeline, debounceDelay);
  });

  updateTimeline();

  return () => {
    if (timeline) {
      timeline.scrollTrigger.kill(true);
      timeline.kill(true);
    }
    clearTimeout(resizeTimeout);
  };
}