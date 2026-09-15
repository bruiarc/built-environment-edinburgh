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
  let previousKeyword = -1;
  let stopped = false;

  banner.classList.add("bee-research-banner--animated");

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function nextKeywordIndex() {
    let index = Math.floor(Math.random() * keywords.length);
    if (index === previousKeyword) index = (index + 1) % keywords.length;
    previousKeyword = index;
    return index;
  }

  function placeKeyword(slot) {
    const bounds = stage.getBoundingClientRect();
    const wordBounds = slot.element.getBoundingClientRect();
    const padding = Math.max(8, Math.min(16, bounds.width * 0.025));
    const maxX = Math.max(padding, bounds.width - wordBounds.width - padding);
    const maxY = Math.max(padding, bounds.height - wordBounds.height - padding);
    let candidate = { x: padding, y: padding };

    for (let attempt = 0; attempt < 12; attempt += 1) {
      candidate = {
        x: randomBetween(padding, maxX),
        y: randomBetween(padding, maxY)
      };

      if (!slot.previousPosition) break;

      const xDistance = Math.abs(candidate.x - slot.previousPosition.x) / Math.max(1, maxX);
      const yDistance = Math.abs(candidate.y - slot.previousPosition.y) / Math.max(1, maxY);
      if (Math.hypot(xDistance, yDistance) > 0.28) break;
    }

    slot.previousPosition = candidate;
    slot.element.style.transform = `translate(${candidate.x}px, ${candidate.y}px)`;
  }

  function schedule(slot, delay) {
    window.setTimeout(function () {
      if (stopped) return;

      slot.element.textContent = keywords[nextKeywordIndex()];
      slot.element.style.setProperty(
        "--keyword-size",
        `${randomBetween(0.92, 1.12).toFixed(2)}rem`
      );
      placeKeyword(slot);

      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          if (!stopped) slot.element.classList.add("is-visible");
        });
      });

      const visibleFor = randomBetween(2200, 3200);
      window.setTimeout(function () {
        slot.element.classList.remove("is-visible");
        schedule(slot, 1150 + randomBetween(slot.minPause, slot.maxPause));
      }, visibleFor);
    }, delay);
  }

  function makeSlot(minPause, maxPause, initialDelay) {
    const element = document.createElement("span");
    const slot = { element, minPause, maxPause, previousPosition: null };
    element.className = "bee-research-banner__keyword";
    stage.appendChild(element);
    slots.push(slot);
    schedule(slot, initialDelay);
  }

  makeSlot(900, 1700, 250);
  makeSlot(4800, 7200, 3600);

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
