/* ---------- Inject countdown CSS automatically ---------- */
(function addCountdownStyles(){
    if(document.getElementById("countdown-style")) return;
  
    const style = document.createElement("style");
    style.id = "countdown-style";
    style.textContent = `
    .countdown-grid{
        display:flex;
        justify-content:center;
        gap:18px;
        flex-wrap:wrap;
        margin:12px 0;
        font-family: system-ui, -apple-system, Arial, sans-serif;
    }
  
    .countdown-item{
        text-align:center;
        min-width:85px;
    }
  
    .countdown-number{
        display:flex;
        align-items:center;
        justify-content:center;
        width:80px;
        height:80px;
        background:#000 !important;  /* Added !important to force */
        color:#fff !important;       /* Added !important to force */
        font-size:2.6rem;
        font-weight:700;
        border-radius:8px;
        line-height:1;
    }
  
    .time-label{
        display:block;
        margin-top:6px;
        font-size:0.8rem;
        color:#555;
        text-transform:uppercase;
        letter-spacing:1px;
    }
    `;
    document.head.appendChild(style);
    
    // Debug log
    console.log('Countdown styles injected. Check if .countdown-number background appears');
  })();

/* ---------- Calculate the next meeting in UK time ---------- */
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

// Convert a calendar time in Europe/London to a browser-independent Date.
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

function getNextMeetingDate() {
  const now = new Date();
  const ukNow = getUKDateParts(now);
  let year = ukNow.year;
  let month = ukNow.month - 1;
  let lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  let nextMeeting = makeUKDate(year, month, lastDay, 13);
  let meetingEnd = makeUKDate(year, month, lastDay, 14);

  // Keep the current meeting active until 14:00; afterwards use next month.
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

/* ---------- Countdown display ---------- */
function updateCountdown() {
  const now = new Date();
  const nextMeeting = getNextMeetingDate();
  const diff = nextMeeting - now;

  const options = {
      weekday:'long',
      year:'numeric',
      month:'long',
      day:'numeric',
      hour:'2-digit',
      minute:'2-digit',
      timeZone: meetingTimeZone,
      timeZoneName:'short'
  };

  document.getElementById("next-meeting-date").innerHTML =
      `on ${nextMeeting.toLocaleString("en-GB", options)}–14:00 UK time.`;

  if(diff <= 0){
      document.getElementById("meeting-countdown").innerHTML =
          `<span style="color:#27ae60;font-weight:600;">
          Meeting is happening now!
          </span>`;
      return;
  }

  const days = Math.floor(diff/(1000*60*60*24));
  const hours = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const minutes = Math.floor((diff%(1000*60*60))/(1000*60));
  const seconds = Math.floor((diff%(1000*60))/1000);

  const f = t => t.toString().padStart(2,"0");

  document.getElementById("meeting-countdown").innerHTML = `
      <div class="countdown-grid">
          <div class="countdown-item">
              <span class="countdown-number">${days}</span>
              <span class="time-label">Days</span>
          </div>
          <div class="countdown-item">
              <span class="countdown-number">${f(hours)}</span>
              <span class="time-label">Hours</span>
          </div>
          <div class="countdown-item">
              <span class="countdown-number">${f(minutes)}</span>
              <span class="time-label">Minutes</span>
          </div>
          <div class="countdown-item">
              <span class="countdown-number">${f(seconds)}</span>
              <span class="time-label">Seconds</span>
          </div>
      </div>
  `;

}

/* ---------- Start countdown ---------- */
setInterval(updateCountdown, 1000);
updateCountdown();
