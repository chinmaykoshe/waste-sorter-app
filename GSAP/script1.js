const dot = document.querySelector(".dot");
const path = document.querySelector(".cursor-tail path");

let points = [];
const maxPoints = 10; 
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animate() {
  // Smoothly move head
  gsap.to(dot, { x: mouse.x, y: mouse.y, duration: 0.08, ease: "power2.out" });

  // Save position
  points.push({ x: mouse.x, y: mouse.y });
  if (points.length > maxPoints) points.shift();

  if (points.length > 2) {
    let d = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length - 2; i++) {
      // midpoint for smoothing
      let xc = (points[i].x + points[i + 1].x) / 2;
      let yc = (points[i].y + points[i + 1].y) / 2;
      d += ` Q${points[i].x},${points[i].y} ${xc},${yc}`;
    }
    // last segment
    d += ` T${points[points.length - 1].x},${points[points.length - 1].y}`;
    path.setAttribute("d", d);
  }

  requestAnimationFrame(animate);
}
animate();
