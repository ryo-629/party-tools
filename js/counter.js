const playerNameInput = document.getElementById("playerNameInput");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const playersArea = document.getElementById("playersArea");
const resetAllBtn = document.getElementById("resetAllBtn");
const clearAllBtn = document.getElementById("clearAllBtn");

const STORAGE_KEY = "party_counter_players_v1";

// { id, name, score }
let players = [];

// =========================
// Storage
// =========================
function savePlayers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

function loadPlayers() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    players = [];
    return;
  }

  try {
    const parsed = JSON.parse(data);
    players = Array.isArray(parsed) ? parsed : [];
  } catch {
    players = [];
  }
}

// =========================
// Utility
// =========================
function makeId() {
  return "p_" + Math.random().toString(36).slice(2, 10);
}

function sanitizeName(name) {
  return name.trim().replace(/\s+/g, " ");
}

// =========================
// Render
// =========================
function renderPlayers() {
  playersArea.innerHTML = "";

  if (players.length === 0) {
    playersArea.innerHTML = `
      <div style="opacity:0.75; font-weight:900; padding:10px 4px;">
        まだプレイヤーがいません。上から追加してね！
      </div>
    `;
    return;
  }

  players.forEach((p) => {
    const el = document.createElement("div");
    el.className = "counter-item";

    el.innerHTML = `
      <div class="counter-name">${p.name}</div>

      <div class="counter-mid">
        <button class="counter-btn counter-minus" data-action="minus" data-id="${p.id}">−</button>
        <div class="counter-score">${p.score}</div>
        <button class="counter-btn counter-plus" data-action="plus" data-id="${p.id}">＋</button>
      </div>

      <button class="counter-del" data-action="delete" data-id="${p.id}">削除</button>
    `;

    playersArea.appendChild(el);
  });
}


// =========================
// Actions
// =========================
function addPlayer() {
  const name = sanitizeName(playerNameInput.value);

  if (!name) {
    alert("名前を入力してね！");
    return;
  }

  if (players.some(p => p.name === name)) {
    alert("同じ名前がすでにいるよ！（別の名前にしてね）");
    return;
  }

  players.push({
    id: makeId(),
    name,
    score: 0,
  });

  savePlayers();
  renderPlayers();

  playerNameInput.value = "";
  playerNameInput.focus();
}

function changeScore(id, diff) {
  const p = players.find(x => x.id === id);
  if (!p) return;

  p.score += diff;

  savePlayers();
  renderPlayers();
}

function deletePlayer(id) {
  const p = players.find(x => x.id === id);
  if (!p) return;

  const ok = confirm(`${p.name} を削除しますか？`);
  if (!ok) return;

  players = players.filter(x => x.id !== id);
  savePlayers();
  renderPlayers();
}

function resetAll() {
  if (players.length === 0) return;

  const ok = confirm("全員の点数を 0 に戻しますか？");
  if (!ok) return;

  players.forEach(p => p.score = 0);
  savePlayers();
  renderPlayers();
}

function clearAll() {
  if (players.length === 0) return;

  const ok = confirm("全員削除しますか？（元に戻せません）");
  if (!ok) return;

  players = [];
  savePlayers();
  renderPlayers();
}

// =========================
// Events
// =========================
addPlayerBtn.addEventListener("click", addPlayer);

playersArea.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === "plus") changeScore(id, 1);
  if (action === "minus") changeScore(id, -1);
  if (action === "delete") deletePlayer(id);
});

resetAllBtn.addEventListener("click", resetAll);
clearAllBtn.addEventListener("click", clearAll);

// =========================
// Init
// =========================
loadPlayers();
renderPlayers();
playerNameInput.focus();
