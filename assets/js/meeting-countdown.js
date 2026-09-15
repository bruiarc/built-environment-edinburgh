/* The default layout does not load css/style.css, so keep this component's
   presentation self-contained. */
(function addCountdownStyles() {
  if (document.getElementById("countdown-style")) return;

  const style = document.createElement("style");
  style.id = "countdown-style";
  style.textContent = `
    .countdown-grid {
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      gap: clamp(6px, 2vw, 18px);
      margin: 12px 0;
      font-family: system-ui, -apple-system, Arial, sans-serif;
    }
    .countdown-item {
      min-width: 0;
      text-align: center;
    }
    .countdown-number {
      align-items: center;
      background: #000 !important;
      border-radius: 8px;
      color: #fff !important;
      display: flex;
      font-size: clamp(1.5rem, 6vw, 2.6rem);
      font-weight: 700;
      height: clamp(58px, 18vw, 80px);
      justify-content: center;
      line-height: 1;
      width: clamp(58px, 18vw, 80px);
    }
    .time-label {
      color: #555;
      display: block;
      font-size: clamp(0.62rem, 2vw, 0.8rem);
      letter-spacing: 1px;
      margin-top: 6px;
      text-transform: uppercase;
    }
  `;
  document.head.appendChild(style);
})();

const meetingTimeZone = "Europe/London";

function getUKDateParts(date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: meetingTimeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    hourCycle: "h23"
  }).formatToParts(date);

  return Object.fromEntries(
    parts.filter(part => part.type !== "literal")
      .map(part => [part.type, Number(part.value)])
  );
}

function makeUKDate(year, month, day, hour) {
  const utcGuess = new Date(Date.UTC(year, month, day, hour));
  const rendered = getUKDateParts(utcGuess);
  const offset = Date.UTC(
    rendered.year,
    rendered.month - 1,
    rendered.day,
    rendered.hour
  ) - utcGuess.getTime();

  return new Date(utcGuess.getTime() - offset);
}

function getNextMeetingDate(now = new Date()) {
  const ukNow = getUKDateParts(now);
  let year = ukNow.year;
  let month = ukNow.month - 1;
  let lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  let nextMeeting = makeUKDate(year, month, lastDay, 13);
  let meetingEnd = makeUKDate(year, month, lastDay, 14);

  if (now >= meetingEnd) {
    month += 1;
    if (month === 12) {
      month = 0;
      year += 1;
    }
    lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    nextMeeting = makeUKDate(year, month, lastDay, 13);
  }

  return nextMeeting;
}

function updateMeetingDate() {
  const now = new Date();
  const nextMeeting = getNextMeetingDate();
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: meetingTimeZone
  };
  const meetingParts = getUKDateParts(nextMeeting);
  const offsetHours = Math.round((Date.UTC(
    meetingParts.year,
    meetingParts.month - 1,
    meetingParts.day,
    meetingParts.hour
  ) - nextMeeting.getTime()) / 3600000);
  const offsetName = `UTC${offsetHours >= 0 ? "+" : ""}${offsetHours}`;

  document.getElementById("next-meeting-date").textContent =
    `on ${nextMeeting.toLocaleString("en-GB", dateOptions)} (${offsetName})`;

  const difference = Math.max(0, nextMeeting - now);
  const days = Math.floor(difference / 86400000);
  const hours = Math.floor(difference % 86400000 / 3600000);
  const minutes = Math.floor(difference % 3600000 / 60000);
  const seconds = Math.floor(difference % 60000 / 1000);
  const pad = value => String(value).padStart(2, "0");

  document.getElementById("meeting-countdown").innerHTML = `
    <div class="countdown-grid">
      <div class="countdown-item">
        <span class="countdown-number">${days}</span>
        <span class="time-label">Days</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${pad(hours)}</span>
        <span class="time-label">Hours</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${pad(minutes)}</span>
        <span class="time-label">Minutes</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${pad(seconds)}</span>
        <span class="time-label">Seconds</span>
      </div>
    </div>`;
}

updateMeetingDate();
setInterval(updateMeetingDate, 1000);
