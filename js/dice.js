const diceCount = document.getElementById("diceCount");
const rollBtn = document.getElementById("rollBtn");
const diceArea = document.getElementById("diceArea");
const diceSum = document.getElementById("diceSum");

function randomDice() {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * 出目に応じて表示するpip（点）の位置
 * tl tc tr
 * ml mc mr
 * bl bc br
 */
const pipMap = {
  1: ["mc"],
  2: ["tl", "br"],
  3: ["tl", "mc", "br"],
  4: ["tl", "tr", "bl", "br"],
  5: ["tl", "tr", "mc", "bl", "br"],
  6: ["tl", "ml", "bl", "tr", "mr", "br"],
};

function createDice(value) {
  // 影とサイコロをまとめるラッパー
  const wrap = document.createElement("div");
  wrap.className = "dice-wrap";

  // 影
  const shadow = document.createElement("div");
  shadow.className = "dice-shadow";

  // サイコロ本体
  const dice = document.createElement("div");
  dice.className = "dice";

  // pip追加
  pipMap[value].forEach(pos => {
    const pip = document.createElement("div");
    pip.className = `pip ${pos}`;
    dice.appendChild(pip);
  });

  wrap.appendChild(shadow);
  wrap.appendChild(dice);

  return wrap;
}

function renderDice(values, rolling = false) {
  diceArea.innerHTML = "";
  values.forEach(v => {
    const wrap = createDice(v);

    if (rolling) {
      wrap.classList.add("rolling");
      wrap.querySelector(".dice").classList.add("rolling");
    }

    diceArea.appendChild(wrap);
  });
}

function animateRoll(count) {
  rollBtn.disabled = true;
  rollBtn.style.opacity = "0.6";
  diceSum.textContent = "🎲 振っています...";

  // 最初に表示
  let temp = Array.from({ length: count }, randomDice);
  renderDice(temp, true);

  let ticks = 0;
  const maxTicks = 18;

  const interval = setInterval(() => {
    ticks++;

    temp = Array.from({ length: count }, randomDice);
    renderDice(temp, true);

    if (ticks >= maxTicks) {
      clearInterval(interval);

      // 最終結果
      const final = Array.from({ length: count }, randomDice);
      renderDice(final, false);

      // 止まる瞬間のbounce
      const wraps = document.querySelectorAll(".dice-wrap");
      wraps.forEach(w => {
        w.classList.add("bounce");
        w.querySelector(".dice").classList.add("bounce");

        setTimeout(() => {
          w.classList.remove("bounce");
          w.querySelector(".dice").classList.remove("bounce");
        }, 350);
      });

      const sum = final.reduce((a, b) => a + b, 0);
      diceSum.textContent = `🎲 合計：${sum}（${final.join(" , ")}）`;

      rollBtn.disabled = false;
      rollBtn.style.opacity = "1";
    }
  }, 70);
}

rollBtn.addEventListener("click", () => {
  const count = Number(diceCount.value);
  animateRoll(count);
});
