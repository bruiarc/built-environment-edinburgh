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
    "Renewables",
    "Net Zero",
    "Building Performance",
    "Energy Efficiency",
    "Retrofit",
    "Digital Twins",
    "Urban Resilience",
    "Indoor Environment"
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
    const identity = banner.querySelector(".bee-research-banner__identity");
    const identityTop = identity.offsetTop;
    const padding = Math.max(8, Math.min(16, bounds.width * 0.025));
    const maxX = Math.max(padding, bounds.width - wordBounds.width - padding);
    const maxY = Math.max(padding, identityTop - wordBounds.height - 12);
    const minX = Math.min(maxX, Math.max(padding, bounds.width * 0.32));
    const minY = Math.min(maxY, Math.max(padding, bounds.height * 0.4));
    let candidate = { x: minX, y: minY };
    let foundPosition = false;

    for (let attempt = 0; attempt < 24; attempt += 1) {
      candidate = {
        x: randomBetween(minX, maxX),
        y: randomBetween(minY, maxY)
      };

      const overlapsVisibleWord = slots.some(function (otherSlot) {
        if (otherSlot === slot || !otherSlot.active || !otherSlot.bounds) {
          return false;
        }

        return candidate.x < otherSlot.bounds.x + otherSlot.bounds.width + 14 &&
          candidate.x + wordBounds.width + 14 > otherSlot.bounds.x &&
          candidate.y < otherSlot.bounds.y + otherSlot.bounds.height + 10 &&
          candidate.y + wordBounds.height + 10 > otherSlot.bounds.y;
      });

      const movedEnough = !slot.previousPosition || Math.hypot(
        Math.abs(candidate.x - slot.previousPosition.x) / Math.max(1, maxX),
        Math.abs(candidate.y - slot.previousPosition.y) / Math.max(1, maxY)
      ) > 0.24;

      if ((movedEnough || attempt > 14) && !overlapsVisibleWord) {
        foundPosition = true;
        break;
      }
    }

    if (!foundPosition) return false;

    slot.previousPosition = candidate;
    slot.bounds = {
      x: candidate.x,
      y: candidate.y,
      width: wordBounds.width,
      height: wordBounds.height
    };
    slot.element.style.transform = `translate(${candidate.x}px, ${candidate.y}px)`;
    return true;
  }

  function fitKeyword(slot, desiredSize) {
    slot.element.style.setProperty("--keyword-size", `${desiredSize.toFixed(2)}rem`);

    const stageWidth = stage.getBoundingClientRect().width;
    const wordWidth = slot.element.getBoundingClientRect().width;
    const availableWidth = Math.max(1, stageWidth - 16);

    if (wordWidth > availableWidth) {
      const computedSize = parseFloat(window.getComputedStyle(slot.element).fontSize);
      const fittedSize = Math.max(18, computedSize * availableWidth / wordWidth);
      slot.element.style.setProperty("--keyword-size", `${fittedSize.toFixed(1)}px`);
    }
  }

  function schedule(slot, delay) {
    window.setTimeout(function () {
      if (stopped) return;

      slot.keywordIndex = nextKeywordIndex();
      activeKeywords.add(slot.keywordIndex);
      slot.element.textContent = keywords[slot.keywordIndex];
      slot.desiredSize = randomBetween(2.35, 4.6);
      fitKeyword(slot, slot.desiredSize);

      if (!placeKeyword(slot)) {
        activeKeywords.delete(slot.keywordIndex);
        schedule(slot, randomBetween(125, 275));
        return;
      }

      slot.active = true;

      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          if (!stopped) slot.element.classList.add("is-visible");
        });
      });

      const visibleFor = randomBetween(600, 975);
      window.setTimeout(function () {
        slot.element.classList.remove("is-visible");
        window.setTimeout(function () {
          slot.active = false;
          activeKeywords.delete(slot.keywordIndex);
          schedule(slot, randomBetween(slot.minPause, slot.maxPause));
        }, 325);
      }, visibleFor);
    }, delay);
  }

  function makeSlot(minPause, maxPause, initialDelay) {
    const element = document.createElement("span");
    const slot = {
      element,
      minPause,
      maxPause,
      previousPosition: null,
      bounds: null,
      active: false,
      desiredSize: 2.35
    };
    element.className = "bee-research-banner__keyword";
    stage.appendChild(element);
    slots.push(slot);
    schedule(slot, initialDelay);
  }

  makeSlot(125, 350, 75);
  makeSlot(225, 450, 350);
  makeSlot(325, 550, 675);

  let resizeFrame;
  window.addEventListener("resize", function () {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(function () {
      slots.forEach(function (slot) {
        if (slot.element.textContent) {
          fitKeyword(slot, slot.desiredSize);
          placeKeyword(slot);
        }
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
