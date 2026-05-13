const terminal = document.getElementById("terminalBoot");

const lines = [
  "profile: Morando Malau",
  "status: mahasiswa semester 7 Universitas Nasional",
  "experience: 3 years production operator // automotive industry",
  "focus: DevOps fundamentals + Data Analyst fundamentals",
  "learning: Linux, Docker, CI/CD, monitoring, SQL, Python",
  "mindset: disciplined, process-aware, detail-oriented",
  "goal: internship / junior opportunity in tech"
];

function runTerminal() {
  if (!terminal) return;

  terminal.innerHTML = "";
  let i = 0;

  const addLine = () => {
    if (i >= lines.length) {
      const ready = document.createElement("p");
      ready.className = "cursor";
      ready.textContent = "ready: portfolio loaded ";
      terminal.appendChild(ready);
      return;
    }

    const p = document.createElement("p");
    p.textContent = "> " + lines[i];
    terminal.appendChild(p);
    i++;
    setTimeout(addLine, 360);
  };

  setTimeout(addLine, 450);
}

runTerminal();
