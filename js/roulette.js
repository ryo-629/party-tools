const canvas = document.getElementById("rouletteCanvas");
const ctx = canvas.getContext("2d");

const centerSpinBtn = document.getElementById("centerSpinBtn");
const resultEl = document.getElementById("rouletteResult");

const itemInput = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");
const itemList = document.getElementById("itemList");

let items = loadLS("roulette_items", []);
let rotation = 0;
let spinning = false;

function getColors(n) {
  const colors = [];
  for (let i = 0; i < n; i++) {
    const hue = Math.floor((360 / n) * i);
    colors.push(`hsl(${hue}, 90%, 60%)`);
  }
  return colors;
}

function fitText(text, maxLen = 8) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "…";
}

function drawWheel() {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) / 2 - 18;

  ctx.clearRect(0, 0, w, h);

  const n = items.length;
  if (n === 0) return;

  const colors = getColors(n);
  const slice = (Math.PI * 2) / n;

  // 外枠
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2);
  ctx.fillStyle = "#222";
  ctx.fill();

  for (let i = 0; i < n; i++) {
    const start = rotation + i * slice;
    const end = start + slice;

    // 扇形
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();

    // 文字を「扇形の真ん中」に置く
    const mid = (start + end) / 2;

    // 文字位置（中心からの距離）
    const textR = radius * 0.62;

    const tx = cx + Math.cos(mid) * textR;
    const ty = cy + Math.sin(mid) * textR;

    // 文字回転（読める方向にする）
    ctx.save();
    ctx.translate(tx, ty);

    let angle = mid + Math.PI / 2;
    if (angle > Math.PI / 2 && angle < Math.PI * 1.5) {
      angle += Math.PI;
    }
    ctx.rotate(angle);

    ctx.fillStyle = "#111";
    ctx.font = "900 22px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const label = fitText(items[i], 9);
    ctx.fillText(label, 0, 0);

    ctx.restore();
  }

  // 中心リング
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = "#111";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.25 + 8, 0, Math.PI * 2);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 10;
  ctx.stroke();
}

function renderList() {
  itemList.innerHTML = "";
  items.forEach((name, idx) => {
    const row = document.createElement("div");
    row.className = "item";

    const label = document.createElement("div");
    label.className = "item-name";
    label.textContent = name;

    const del = document.createElement("button");
    del.className = "del-btn";
    del.textContent = "削除";
    del.addEventListener("click", () => {
      items.splice(idx, 1);
      saveLS("roulette_items", items);
      renderList();
      drawWheel();
    });

    row.appendChild(label);
    row.appendChild(del);
    itemList.appendChild(row);
  });
}

function pickResult() {
  const n = items.length;
  const slice = (Math.PI * 2) / n;

  // pointerは「上（-90°）」にあるので、そこに対応する角度を計算
  const pointerAngle = (-Math.PI / 2 - rotation) % (Math.PI * 2);
  const normalized = (pointerAngle + Math.PI * 2) % (Math.PI * 2);

  const index = Math.floor(normalized / slice);
  return items[index];
}

function spin() {
  if (spinning) return;
  if (items.length < 2) {
    alert("2個以上の項目を入れてね！");
    return;
  }

  spinning = true;
  resultEl.textContent = "🎯 結果：回転中...";

  const startRot = rotation;
  const extraSpins = 6 + Math.random() * 4;
  const target = startRot + extraSpins * Math.PI * 2 + Math.random() * Math.PI * 2;

  const duration = 2600;
  const start = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    rotation = startRot + (target - startRot) * easeOutCubic(t);
    drawWheel();

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      spinning = false;
      const res = pickResult();
      resultEl.textContent = `🎯 結果：${res}`;
    }
  }

  requestAnimationFrame(frame);
}

addBtn.addEventListener("click", () => {
  const v = itemInput.value.trim();
  if (!v) return;

  items.push(v);
  itemInput.value = "";
  saveLS("roulette_items", items);
  renderList();
  drawWheel();
});

itemInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addBtn.click();
});

centerSpinBtn.addEventListener("click", spin);

renderList();
drawWheel();
