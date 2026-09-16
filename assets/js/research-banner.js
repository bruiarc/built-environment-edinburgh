(function () {
  "use strict";

  const banner = document.querySelector("[data-bee-banner]");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!banner || motionQuery.matches) return;

  const stage = banner.querySelector(".bee-research-banner__animation");
  const keywords = [
    "Energy Modelling",
    "Digital Twins",
    "Smart Grid",
    "AI",
    "Net Zero",
    "Heat Pumps",
    "Energy Systems",
    "Urban Environment",
    "EV",
    "Indoor Environment"
  ];
  const keywordLayouts = {
    "Energy Modelling": { side: "left", offset: "1%", top: "1%", size: "clamp(0.9rem, 3vw, 1.7rem)", opacity: 0.81 },
    "Digital Twins": { side: "right", offset: "5%", top: "5%", size: "clamp(1rem, 3.2vw, 1.8rem)", opacity: 0.81 },
    "Smart Grid": { side: "left", offset: "20%", top: "25%", size: "clamp(0.82rem, 2.6vw, 1.45rem)", opacity: 0.9 },
    "AI": { side: "right", offset: "13%", top: "21%", size: "clamp(1.05rem, 3.4vw, 1.9rem)", opacity: 0.81 },
    "Net Zero": {
      side: "left",
      offset: "35%",
      top: "41%",
      size: "clamp(1.05rem, 3.4vw, 1.9rem)",
      opacity: 0.9
    },
    "Heat Pumps": { side: "right", offset: "12%", top: "49%", size: "clamp(0.82rem, 2.6vw, 1.45rem)", opacity: 0.81 },
    "Energy Systems": { side: "left", offset: "10%", top: "61%", size: "clamp(0.82rem, 2.6vw, 1.45rem)", opacity: 0.9 },
    "Urban Environment": { side: "right", offset: "1%", top: "73%", size: "clamp(0.9rem, 2.8vw, 1.55rem)", opacity: 0.9 },
    "Smart Control": { side: "left", offset: "5%", top: "77%", size: "clamp(0.9rem, 2.9vw, 1.65rem)", opacity: 0.9 },
    "Indoor Environment": { side: "right", offset: "25%", top: "85%", size: "clamp(0.82rem, 2.6vw, 1.45rem)", opacity: 0.6 }
  };
  const slots = [];
  const activeKeywords = new Set();
  const recentKeywords = [];
  const cooldownLength = 6;
  let keywordBag = [];
  let stopped = false;

  banner.classList.add("bee-research-banner--animated");

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function refillKeywordBag() {
    keywordBag = keywords.map(function (_, index) { return index; });

    for (let index = keywordBag.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [keywordBag[index], keywordBag[swapIndex]] = [keywordBag[swapIndex], keywordBag[index]];
    }
  }

  function nextKeywordIndex() {
    const deferred = [];

    while (deferred.length <= keywords.length) {
      if (keywordBag.length === 0) {
        refillKeywordBag();
        deferred.length = 0;
      }

      const index = keywordBag.pop();
      if (!activeKeywords.has(index) && !recentKeywords.includes(index)) {
        keywordBag.unshift(...deferred);
        return index;
      }

      deferred.push(index);
    }

    keywordBag.unshift(...deferred);
    return keywords.findIndex(function (_, index) {
      return !activeKeywords.has(index);
    });
  }

  function rememberKeyword(index) {
    recentKeywords.push(index);
    if (recentKeywords.length > cooldownLength) recentKeywords.shift();
  }

  function placeKeyword(slot) {
    const layout = keywordLayouts[keywords[slot.keywordIndex]];

    slot.element.style.left = layout.side === "left" ? layout.offset : "auto";
    slot.element.style.right = layout.side === "right" ? layout.offset : "auto";
    slot.element.style.top = layout.top;
    slot.element.style.setProperty("--keyword-size", layout.size);
    slot.element.style.setProperty("--keyword-opacity", layout.opacity);
  }

  function schedule(slot, delay) {
    window.setTimeout(function () {
      if (stopped) return;

      slot.keywordIndex = nextKeywordIndex();
      activeKeywords.add(slot.keywordIndex);
      slot.element.textContent = keywords[slot.keywordIndex];
      placeKeyword(slot);

      slot.active = true;
      rememberKeyword(slot.keywordIndex);

      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          if (!stopped) slot.element.classList.add("is-visible");
        });
      });

      const visibleFor = randomBetween(900, 1463);
      window.setTimeout(function () {
        slot.element.classList.remove("is-visible");
        window.setTimeout(function () {
          slot.active = false;
          activeKeywords.delete(slot.keywordIndex);
          schedule(slot, randomBetween(slot.minPause, slot.maxPause));
        }, 490);
      }, visibleFor);
    }, delay);
  }

  function makeSlot(minPause, maxPause, initialDelay) {
    const element = document.createElement("span");
    const slot = {
      element,
      minPause,
      maxPause,
      active: false
    };
    element.className = "bee-research-banner__keyword";
    stage.appendChild(element);
    slots.push(slot);
    schedule(slot, initialDelay);
  }

  makeSlot(188, 525, 113);
  makeSlot(338, 675, 525);
  makeSlot(488, 825, 1013);

  motionQuery.addEventListener("change", function (event) {
    if (!event.matches) return;
    stopped = true;
    slots.forEach(function (slot) {
      slot.element.remove();
    });
    banner.classList.remove("bee-research-banner--animated");
  });
}());
