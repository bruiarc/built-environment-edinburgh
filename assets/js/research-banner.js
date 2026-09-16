(function () {
  "use strict";

  const banner = document.querySelector("[data-bee-banner]");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!banner) return;

  const stage = banner.querySelector(".bee-research-banner__animation");

  if (!stage) return;

  const reducedMotion = motionQuery.matches;

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
    "Energy Modelling": {
      side: "left",
      offset: "1%",
      top: "1%",
      size: "clamp(0.9rem, 3vw, 1.7rem)",
      opacity: 0.81
    },
    "Digital Twins": {
      side: "right",
      offset: "5%",
      top: "5%",
      size: "clamp(1rem, 3.2vw, 1.8rem)",
      opacity: 0.6
    },
    "Smart Grid": {
      side: "left",
      offset: "20%",
      top: "25%",
      size: "clamp(0.82rem, 2.6vw, 1.45rem)",
      opacity: 0.9
    },
    "AI": {
      side: "right",
      offset: "13%",
      top: "28%",
      size: "clamp(1.05rem, 3.4vw, 1.9rem)",
      opacity: 0.81
    },
    "Net Zero": {
      side: "left",
      offset: "35%",
      top: "41%",
      size: "clamp(1.05rem, 3.4vw, 1.9rem)",
      opacity: 0.9
    },
    "Heat Pumps": {
      side: "right",
      offset: "12%",
      top: "49%",
      size: "clamp(0.82rem, 2.6vw, 1.45rem)",
      opacity: 0.81
    },
    "Energy Systems": {
      side: "left",
      offset: "10%",
      top: "61%",
      size: "clamp(0.82rem, 2.6vw, 1.45rem)",
      opacity: 0.9
    },
    "Urban Environment": {
      side: "right",
      offset: "1%",
      top: "73%",
      size: "clamp(0.9rem, 2.8vw, 1.55rem)",
      opacity: 0.81
    },
    "EV": {
      side: "left",
      offset: "5%",
      top: "77%",
      size: "clamp(0.9rem, 2.9vw, 1.65rem)",
      opacity: 0.81
    },
    "Indoor Environment": {
      side: "right",
      offset: "25%",
      top: "85%",
      size: "clamp(0.82rem, 2.6vw, 1.45rem)",
      opacity: 0.81
    }
  };

  const slots = [];
  const activeKeywords = new Set();
  const recentKeywords = [];
  const cooldownLength = reducedMotion ? 5 : 6;
  const timing = reducedMotion
  ? {
      visibleMin: 1250,
      visibleMax: 1750,
      fadeOut: 550
    }
  : {
      visibleMin: 900,
      visibleMax: 1463,
      fadeOut: 490
    };

  let keywordBag = [];
  let stopped = false;

  banner.classList.add("bee-research-banner--animated");

  if (reducedMotion) {
    banner.classList.add("bee-research-banner--reduced-motion");
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function refillKeywordBag() {
    const existingIndexes = new Set(keywordBag);
    const refill = keywords.map(function (_, index) {
      return index;
    }).filter(function (index) {
      return !existingIndexes.has(index);
    });

    for (let index = refill.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));

      [refill[index], refill[swapIndex]] =
        [refill[swapIndex], refill[index]];
    }

    keywordBag = keywordBag.concat(refill);
  }

  function nextKeywordIndex() {
    if (keywordBag.length === 0) {
      refillKeywordBag();
    }

    let bagPosition = keywordBag.findIndex(function (index) {
      return !activeKeywords.has(index) &&
        !recentKeywords.includes(index);
    });

    /* Only relax the cooldown if the current bag has no valid choice. */
    if (bagPosition < 0) {
      bagPosition = keywordBag.findIndex(function (index) {
        return !activeKeywords.has(index);
      });
    }

    /* A nearly exhausted bag can contain only terms active in other slots. */
    if (bagPosition < 0) {
      refillKeywordBag();
      bagPosition = keywordBag.findIndex(function (index) {
        return !activeKeywords.has(index) &&
          !recentKeywords.includes(index);
      });
    }

    return bagPosition < 0 ? -1 : keywordBag.splice(bagPosition, 1)[0];
  }

  function rememberKeyword(index) {
    recentKeywords.push(index);

    if (recentKeywords.length > cooldownLength) {
      recentKeywords.shift();
    }
  }

  function placeKeyword(slot) {
    const keyword = keywords[slot.keywordIndex];
    const layout = keywordLayouts[keyword] || {
      side: slot.keywordIndex % 2 === 0 ? "left" : "right",
      offset: "10%",
      top: "45%",
      size: "clamp(0.9rem, 2.8vw, 1.55rem)",
      opacity: 0.82
    };

    slot.element.style.left =
      layout.side === "left" ? layout.offset : "auto";

    slot.element.style.right =
      layout.side === "right" ? layout.offset : "auto";

    slot.element.style.top = layout.top;

    slot.element.style.setProperty(
      "--keyword-size",
      layout.size
    );

    slot.element.style.setProperty(
      "--keyword-opacity",
      layout.opacity
    );
  }

  function schedule(slot, delay) {
    window.setTimeout(function () {
      if (stopped) return;

      slot.keywordIndex = nextKeywordIndex();

      if (slot.keywordIndex < 0) return;

      activeKeywords.add(slot.keywordIndex);

      slot.element.textContent =
        keywords[slot.keywordIndex];

      placeKeyword(slot);

      slot.active = true;

      rememberKeyword(slot.keywordIndex);

      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          if (!stopped) {
            slot.element.classList.add("is-visible");
          }
        });
      });

      const visibleFor = randomBetween(
        timing.visibleMin,
        timing.visibleMax
      );

      window.setTimeout(function () {
        slot.element.classList.remove("is-visible");

        window.setTimeout(function () {
          slot.active = false;

          activeKeywords.delete(slot.keywordIndex);

          schedule(
            slot,
            randomBetween(slot.minPause, slot.maxPause)
          );
        }, timing.fadeOut);
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
  
    element.className =
      "bee-research-banner__keyword";
  
    stage.appendChild(element);
  
    slots.push(slot);
  
    schedule(slot, initialDelay);
  }

  if (reducedMotion) {
    /*
     * Reduced-motion compromise:
     * two slots, slightly slower changes, but still close
     * to the original visual character.
     */
    makeSlot(450, 750, 150);
    makeSlot(650, 950, 650);
  } else {
    /*
     * Preserve the original normal animation timing.
     */
    makeSlot(188, 525, 113);
    makeSlot(338, 675, 525);
    makeSlot(488, 825, 1013);
  }
}());
