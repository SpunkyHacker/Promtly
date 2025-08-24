// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(!id || id === '#') return;
    const el = document.querySelector(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// Theme toggle (dark <-> light) — still pure CSS variables
const themeBtn = document.getElementById('themeBtn');
let light=false;
themeBtn.addEventListener('click', ()=>{
  light=!light;
  if(light){
    document.documentElement.style.setProperty('--bg','#f6f7fb');
    document.documentElement.style.setProperty('--bg-soft','#eef0f7');
    document.documentElement.style.setProperty('--panel','#ffffff');
    document.documentElement.style.setProperty('--muted','#f3f5fb');
    document.documentElement.style.setProperty('--text','#0b0f1a');
    document.documentElement.style.setProperty('--sub','#4b5672');
    document.documentElement.style.setProperty('--border','#e7e9f4');
    document.documentElement.style.setProperty('--card','#f9faff');
  }else{
    document.location.reload(); // simplest reset to defaults
  }
});

// Print / Save as PDF (browser built-in)
document.getElementById('printBtn').addEventListener('click', ()=>window.print());

// Simple gauge simulation for the Demo section
const needle = document.getElementById('needle');
const scoreVal = document.getElementById('scoreVal');
const simulateBtn = document.getElementById('simulateBtn');
if(simulateBtn){
  simulateBtn.addEventListener('click', ()=>{
    const score = Math.floor(60 + Math.random()*40); // 60–100
    scoreVal.textContent = score;
    // Map 0–100 to -90deg .. +90deg for semicircle
    const deg = (score/100)*180 - 90;
    needle.style.transform = `rotate(${deg}deg)`;
    // color hint
    const ok = getComputedStyle(document.documentElement).getPropertyValue('--ok').trim();
    const warn = getComputedStyle(document.documentElement).getPropertyValue('--warn').trim();
    const danger = getComputedStyle(document.documentElement).getPropertyValue('--danger').trim();
    const c = score>=80 ? ok : score>=70 ? warn : danger;
    needle.style.stroke = c;
  });
}
