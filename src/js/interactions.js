const glow = document.getElementById("cursorGlow");

window.addEventListener("pointermove", (event) => {
  if (!glow) return;
  glow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
});

document.querySelectorAll(".focus-card, .project-row, .value-card").forEach((el) => {
  el.addEventListener("pointermove", (event) => {
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    el.style.background = `
      radial-gradient(circle at ${x}% ${y}%, rgba(98,217,255,0.10), transparent 36%),
      linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018)),
      rgba(13, 17, 22, 0.88)
    `;
  });

  el.addEventListener("pointerleave", () => {
    el.style.background = "";
  });
});
