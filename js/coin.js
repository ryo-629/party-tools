const coin = document.getElementById("coin");
const tossBtn = document.getElementById("tossBtn");
const coinResult = document.getElementById("coinResult");

let isFlipping = false;

function tossCoin() {
  if (isFlipping) return;

  isFlipping = true;
  tossBtn.classList.add("disabled");
  tossBtn.textContent = "回転中...";
  coinResult.textContent = "結果：...";

  // 表(0) or 裏(1)
  const result = Math.random() < 0.5 ? "front" : "back";

  // アニメ開始
  coin.classList.remove("result-front", "result-back");
  coin.classList.add("flipping");

  setTimeout(() => {
    coin.classList.remove("flipping");

    if (result === "front") {
      coin.classList.add("result-front");
      coinResult.textContent = "結果：表";
    } else {
      coin.classList.add("result-back");
      coinResult.textContent = "結果：裏";
    }

    tossBtn.classList.remove("disabled");
    tossBtn.textContent = "コイントス！";
    isFlipping = false;
  }, 1200);
}

tossBtn.addEventListener("click", tossCoin);
