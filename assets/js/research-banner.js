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
    "Indoor Environment",
    "HVAC",
    "Power Systems",
    "Smart Grid",
    "Building Controls",
    "Energy Storage",
    "Demand Response",
    "Electrification",
    "Energy Systems",
    "Building Physics",
    "Urban Energy"
  ];
  const slots = [];
  const activeKeywords = new Set();
  const recentKeywords = [];
  const recentPositions = new Map();
  const cooldownLength = 6;
  const positionHistoryLength = 3;
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

  function placeKeyword(slot, rememberPosition = true) {
    const bounds = stage.getBoundingClientRect();
    const wordBounds = slot.element.getBoundingClientRect();
    const identity = banner.querySelector(".bee-research-banner__identity");
    const identityTop = identity.offsetTop;
    const padding = Math.max(8, Math.min(16, bounds.width * 0.025));
    const maxX = Math.max(padding, bounds.width - wordBounds.width - padding);
    const maxY = Math.max(padding, identityTop - wordBounds.height - 12);
    const minX = Math.min(maxX, Math.max(padding, bounds.width * 0.24));
    const minY = Math.min(maxY, Math.max(padding, bounds.height * 0.32));
    let candidate = { x: minX, y: minY };
    let foundPosition = false;
    const keywordPositionHistory = recentPositions.get(slot.keywordIndex) || [];

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

      const normalizedCandidate = {
        x: candidate.x / Math.max(1, bounds.width),
        y: candidate.y / Math.max(1, bounds.height)
      };
      const differsFromKeywordHistory = keywordPositionHistory.every(function (previous, historyIndex) {
        const distance = Math.hypot(
          normalizedCandidate.x - previous.x,
          normalizedCandidate.y - previous.y
        );
        const isMostRecent = historyIndex === keywordPositionHistory.length - 1;
        return distance > (isMostRecent ? 0.18 : 0.11);
      });

      if ((movedEnough || attempt > 14) && differsFromKeywordHistory && !overlapsVisibleWord) {
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

    if (rememberPosition) {
      keywordPositionHistory.push({
        x: candidate.x / Math.max(1, bounds.width),
        y: candidate.y / Math.max(1, bounds.height)
      });
      if (keywordPositionHistory.length > positionHistoryLength) keywordPositionHistory.shift();
      recentPositions.set(slot.keywordIndex, keywordPositionHistory);
    }

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

    const rootSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    const renderedSize = parseFloat(window.getComputedStyle(slot.element).fontSize) / rootSize;
    const opacity = renderedSize < 2.15 ? 0.9 : renderedSize < 2.7 ? 0.81 : 0.73;
    slot.element.style.setProperty("--keyword-opacity", opacity);
  }

  function schedule(slot, delay) {
    window.setTimeout(function () {
      if (stopped) return;

      slot.keywordIndex = nextKeywordIndex();
      activeKeywords.add(slot.keywordIndex);
      slot.element.textContent = keywords[slot.keywordIndex];
      slot.desiredSize = randomBetween(1.65, 3.22);
      fitKeyword(slot, slot.desiredSize);

      if (!placeKeyword(slot)) {
        activeKeywords.delete(slot.keywordIndex);
        keywordBag.unshift(slot.keywordIndex);
        schedule(slot, randomBetween(188, 413));
        return;
      }

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
      previousPosition: null,
      bounds: null,
      active: false,
      desiredSize: 1.65
    };
    element.className = "bee-research-banner__keyword";
    stage.appendChild(element);
    slots.push(slot);
    schedule(slot, initialDelay);
  }

  makeSlot(188, 525, 113);
  makeSlot(338, 675, 525);
  makeSlot(488, 825, 1013);

  let resizeFrame;
  window.addEventListener("resize", function () {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(function () {
      slots.forEach(function (slot) {
        if (slot.element.textContent) {
          fitKeyword(slot, slot.desiredSize);
          placeKeyword(slot, false);
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
