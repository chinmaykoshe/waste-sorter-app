// gsap.to(".page1 .box1", {
//     duration: 1, 
//     x: 300,
//     delay: 1
// });
// gsap.from(".page1 .box2", {
//     duration: 1, 
//     x: 300,
//     delay: 1
// });

var tl = gsap.timeline({ delay: 1 });

tl.to(".page1 .box1", {
    duration: 1,
    x: 300,
    repeat: -1,
    yoyo: true,
});
tl.from(".page1 .box2", {
    duration: 1,
    x: -300,
    repeat: -1,
    yoyo: true,
});

gsap.to(".page2 h1", {
    x: -600,
    delay: 1,
    scrollTrigger:
    {
        trigger: ".page2",
        scrub: 2,
        start: 'top 60%',
        end: 'top -100%'
    }
});

// var path = "M 10 250 Q 500 250 1090 250"

// var finalPath = "M 10 250 Q 500 250 1090 250"

// var string = document.querySelector(".string");

// string.addEventListener("mousemove", function(dets){
//     gsap.to(".string path", {
//         attr:{ d: `M 10 250 Q ${dets.x} ${dets.y} 1090 250` },
// })
// })

// string.addEventListener("mouseleave", function(){
//     gsap.to(".string path", {
//         attr:{ d:finalPath },
//     })
// })

var path = "M 10 250 Q 500 250 990 250";
var finalPath = "M 10 250 Q 500 250 990 250";

// Select the SVG and the path separately
var svg = document.querySelector("svg.string");
var pathElem = document.querySelector("svg.string path.string");

svg.addEventListener("mousemove", e => {
    const rect = svg.getBoundingClientRect();


    const x = e.clientX - rect.width / 2;
    const y = e.clientY -   rect.height / 2;
    gsap.to(pathElem, {
        attr: { d: `M 10 250 Q ${e.clientX} ${e.clientY} 990 250` }
    });
});

svg.addEventListener("mouseleave", () => {
    gsap.to(pathElem, {
        attr: { d: finalPath },
        ease: "elastic.out(1,0.1)"
    });
});


// simple, dependency-free version
const page4 = document.querySelector('.page4');
const eyes = Array.from(document.querySelectorAll('.page4 .eye'))
                  .map(eye => ({ eye, pupil: eye.querySelector('.pupil') }));

let raf = null;
page4.addEventListener('mousemove', e => {
  // throttle updates with requestAnimationFrame
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const mx = e.clientX, my = e.clientY;
    eyes.forEach(({ eye, pupil }) => {
      const r = eye.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = mx - cx, dy = my - cy;
      const eyeRadius = r.width / 2;
      const pupilRadius = pupil.offsetWidth / 2;
      const max = eyeRadius - pupilRadius;
      const dist = Math.hypot(dx, dy);
      const scale = dist > max ? max / dist : 1;
      pupil.style.transform = `translate(${dx * scale}px, ${dy * scale}px)`;
    });
  });
});

page4.addEventListener('mouseleave', () =>
  eyes.forEach(({ pupil }) => pupil.style.transform = 'translate(0, 0)')
);



const page5 = document.querySelector('.page5');
const hoverTargets = document.querySelectorAll('.divpage5 h1, .divpage5 p');
const dot = document.querySelector('.dot');

page5.addEventListener('mousemove', function (e) {

    const rect = page5.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(dot, {
        x: x - dot.offsetWidth / 2,
        y: y - dot.offsetHeight / 2,
    });
});

// Scale dot on hover
hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(dot, {
            scale: 3,  // or scale: 3 (your choice)
            opacity:0.5,
            ease: "power1.out",
        });
    });

    el.addEventListener('mouseleave', () => {
        gsap.to(dot, {
            scale: 1,   // reset
            ease: "power1.out",
        });
    });
});

