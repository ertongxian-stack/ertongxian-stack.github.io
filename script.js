const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");
const icon = document.querySelector(".theme-icon");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  root.classList.add("light");
  icon.textContent = "☾";
}

toggle.addEventListener("click", () => {
  root.classList.toggle("light");
  const isLight = root.classList.contains("light");
  icon.textContent = isLight ? "☾" : "☀";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

const canvas = document.querySelector("#particle-canvas");
const ctx = canvas.getContext("2d");
const particles = [];
let width = 0;
let height = 0;
let animationFrame = 0;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function seedParticles() {
  particles.length = 0;
  const count = Math.min(90, Math.max(38, Math.floor(width / 18)));

  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      radius: Math.random() * 1.8 + 0.6,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, width, height);
  const isLight = root.classList.contains("light");
  const dot = isLight ? "rgba(8, 127, 106, 0.36)" : "rgba(103, 213, 181, 0.42)";
  const line = isLight ? "rgba(184, 79, 45, 0.11)" : "rgba(255, 140, 107, 0.13)";

  for (const particle of particles) {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = dot;
    ctx.fill();
  }

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < 130) {
        ctx.globalAlpha = 1 - distance / 130;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = line;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1;
  animationFrame = requestAnimationFrame(drawParticles);
}

function initParticles() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  cancelAnimationFrame(animationFrame);
  resizeCanvas();
  seedParticles();
  drawParticles();
}

window.addEventListener("resize", () => {
  resizeCanvas();
  seedParticles();
});

initParticles();
