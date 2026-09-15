(function () {
  "use strict";

  const banner = document.querySelector("[data-bee-banner]");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!banner || motionQuery.matches) return;

  const stage = banner.querySelector(".bee-research-banner__animation");
  const keywords = [
    "Built Environment",
    "AI",
    "BEM",
    "Bayesian Analysis",
    "EV",
    "Heat Pumps",
    "Renewables"
  ];
  const slots = [];
  const activeKeywords = new Set();
  let previousKeyword = -1;
  let stopped = false;

  banner.classList.add("bee-research-banner--animated");

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function nextKeywordIndex() {
    let index = Math.floor(Math.random() * keywords.length);

    for (let attempt = 0; attempt < keywords.length; attempt += 1) {
      if (index !== previousKeyword && !activeKeywords.has(index)) break;
      index = (index + 1) % keywords.length;
    }

    previousKeyword = index;
    return index;
  }

  function placeKeyword(slot) {
    const bounds = stage.getBoundingClientRect();
    const wordBounds = slot.element.getBoundingClientRect();
    const padding = Math.max(8, Math.min(16, bounds.width * 0.025));
    const maxX = Math.max(padding, bounds.width - wordBounds.width - padding);
    const maxY = Math.max(padding, bounds.height - wordBounds.height - 44);
    const minX = Math.min(maxX, Math.max(padding, bounds.width * 0.2));
    const minY = Math.min(maxY, Math.max(padding, bounds.height * 0.34));
    let candidate = { x: minX, y: minY };

    for (let attempt = 0; attempt < 12; attempt += 1) {
      candidate = {
        x: randomBetween(minX, maxX),
        y: randomBetween(minY, maxY)
      };

      const overlapsVisibleWord = slots.some(function (otherSlot) {
        if (otherSlot === slot || !otherSlot.element.classList.contains("is-visible") || !otherSlot.bounds) {
          return false;
        }

        return candidate.x < otherSlot.bounds.x + otherSlot.bounds.width + 8 &&
          candidate.x + wordBounds.width + 8 > otherSlot.bounds.x &&
          candidate.y < otherSlot.bounds.y + otherSlot.bounds.height + 6 &&
          candidate.y + wordBounds.height + 6 > otherSlot.bounds.y;
      });

      const movedEnough = !slot.previousPosition || Math.hypot(
        Math.abs(candidate.x - slot.previousPosition.x) / Math.max(1, maxX),
        Math.abs(candidate.y - slot.previousPosition.y) / Math.max(1, maxY)
      ) > 0.24;

      if (movedEnough && !overlapsVisibleWord) break;
    }

    slot.previousPosition = candidate;
    slot.bounds = {
      x: candidate.x,
      y: candidate.y,
      width: wordBounds.width,
      height: wordBounds.height
    };
    slot.element.style.transform = `translate(${candidate.x}px, ${candidate.y}px)`;
  }

  function schedule(slot, delay) {
    window.setTimeout(function () {
      if (stopped) return;

      slot.keywordIndex = nextKeywordIndex();
      activeKeywords.add(slot.keywordIndex);
      slot.element.textContent = keywords[slot.keywordIndex];
      slot.element.style.setProperty(
        "--keyword-size",
        `${randomBetween(1.55, 2.55).toFixed(2)}rem`
      );
      placeKeyword(slot);

      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          if (!stopped) slot.element.classList.add("is-visible");
        });
      });

      const visibleFor = randomBetween(1200, 1950);
      window.setTimeout(function () {
        slot.element.classList.remove("is-visible");
        activeKeywords.delete(slot.keywordIndex);
        schedule(slot, 650 + randomBetween(slot.minPause, slot.maxPause));
      }, visibleFor);
    }, delay);
  }

  function makeSlot(minPause, maxPause, initialDelay) {
    const element = document.createElement("span");
    const slot = { element, minPause, maxPause, previousPosition: null, bounds: null };
    element.className = "bee-research-banner__keyword";
    stage.appendChild(element);
    slots.push(slot);
    schedule(slot, initialDelay);
  }

  makeSlot(250, 700, 150);
  makeSlot(450, 900, 700);
  makeSlot(650, 1100, 1350);

  let resizeFrame;
  window.addEventListener("resize", function () {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(function () {
      slots.forEach(function (slot) {
        if (slot.element.textContent) placeKeyword(slot);
      });
    });
  });

  motionQuery.addEventListener("change", function (event) {
    if (!event.matches) return;
    stopped = true;
    slots.forEach(function (slot) {
      slot.element.remove();
    });
    banner.classList.remove("bee-research-banner--animated");
  });
}());
