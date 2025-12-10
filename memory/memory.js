// Memory 4x4 — emoji
const EMOJIS = ["🐉","🦊","🦄","🐙","🌟","🍀","⚡","🎲"];
const gridEl = document.getElementById("grid");
const timeEl = document.getElementById("time");
const movesEl = document.getElementById("moves");
const restartBtn = document.getElementById("restart");
const bestTimeEl = document.getElementById("bestTime");

let cards = [], opened = [], matched = 0;
let moves = 0;
let timerInterval = null;
let startTime = null;
let bestTime = parseFloat(localStorage.getItem("memoryBestTime")) || null;

bestTimeEl.textContent = bestTime ? bestTime.toFixed(1) + "s" : "—";

function init(){
  gridEl.innerHTML = "";
  const deck = [...EMOJIS, ...EMOJIS];
  shuffle(deck);
  cards = deck.map((sym,i) => createCard(sym,i));
  cards.forEach(c => gridEl.appendChild(c.el));
  moves = 0; matched = 0; opened = [];
  movesEl.textContent = moves;
  stopTimer();
  timeEl.textContent = "0.0";
  startTime = null;
}
function createCard(sym, idx){
  const wrapper = document.createElement("div");
  wrapper.className = "card";
  wrapper.dataset.symbol = sym;
  wrapper.dataset.index = idx;

  const inner = document.createElement("div");
  inner.className = "card-inner";
  const back = document.createElement("div");
  back.className = "face back";
  back.textContent = "?";
  const front = document.createElement("div");
  front.className = "face front";
  front.textContent = sym;

  inner.appendChild(back);
  inner.appendChild(front);
  wrapper.appendChild(inner);

  wrapper.addEventListener("click", () => onCardClick(wrapper));
  return { el: wrapper, sym };
}
function onCardClick(cardEl){
  if (cardEl.classList.contains("open") || cardEl.classList.contains("matched")) return;
  if (opened.length === 2) return;

  if (!startTime){ startTime = performance.now(); startTimer(); }

  cardEl.classList.add("open");
  cardEl.querySelector(".card-inner").style.transform = "rotateY(180deg)";
  opened.push(cardEl);

  if (opened.length === 2){
    moves++;
    movesEl.textContent = moves;
    setTimeout(checkMatch, 400);
  }
}
function checkMatch(){
  const [a,b] = opened;
  if (!a || !b) { opened = []; return; }
  if (a.dataset.symbol === b.dataset.symbol){
    a.classList.add("matched");
    b.classList.add("matched");
    matched++;
   
    if (matched === EMOJIS.length){
      stopTimer();
      const elapsed = (performance.now() - startTime)/1000;
     
      if (!bestTime || elapsed < bestTime){
        bestTime = elapsed;
        localStorage.setItem("memoryBestTime", bestTime);
        bestTimeEl.textContent = bestTime.toFixed(1) + "s";
      }
      setTimeout(()=> alert("🎉 Перемога! Час: " + elapsed.toFixed(1) + "s\nХоди: " + moves), 200);
    }
  } else {

    a.classList.remove("open");
    b.classList.remove("open");
    a.querySelector(".card-inner").style.transform = "";
    b.querySelector(".card-inner").style.transform = "";
  }
  opened = [];
}
function startTimer(){
  timerInterval = setInterval(()=>{
    const s = (performance.now() - startTime)/1000;
    timeEl.textContent = s.toFixed(1);
  }, 100);
}
function stopTimer(){
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}
restartBtn.addEventListener("click", init);

init();