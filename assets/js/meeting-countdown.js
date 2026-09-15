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
}

updateMeetingDate();
