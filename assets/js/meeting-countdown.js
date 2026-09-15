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
  const rawOffset = new Intl.DateTimeFormat("en-GB", {
    timeZone: meetingTimeZone,
    timeZoneName: "longOffset"
  }).formatToParts(nextMeeting)
    .find(part => part.type === "timeZoneName").value;
  const offsetName = rawOffset === "GMT"
    ? "UTC+0"
    : rawOffset.replace(/^GMT([+-])0?(\d+):00$/, "UTC$1$2");

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
