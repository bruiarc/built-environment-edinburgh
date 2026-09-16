---
layout: default
title: Home
---
Welcome to **Built Environment Edinburg`h (BEE)** community, a PhD student-led group at the [University of Edinburgh](https://www.ed.ac.uk/), promoting research exchange in *sustainable and resilient built environments*, open to both internal and external participants. 

<div class="bee-research-banner" data-bee-banner>
  <div class="bee-research-banner__building">
    <img src="{{ '/assets/img/logo.svg' | relative_url }}" alt="Built Environment Edinburgh (BEE) building mark">
  </div>
  <div class="bee-research-banner__keywords" aria-hidden="true">
    <div class="bee-research-banner__static">
      Energy Modelling <span>·</span> Heat Pumps <span>·</span> EV <span>·</span> Renewables <span>·</span>
      AI <span>·</span> Digital Twins <span>·</span> Urban Environment <span>·</span>
      Smart Grid <span>·</span> Indoor Environment <span>·</span> Energy Systems
    </div>
    <div class="bee-research-banner__animation"></div>
    <p class="bee-research-banner__identity">Built Environment Edinburgh</p>
  </div>
</div>

<script defer src="{{ '/assets/js/research-banner.js' | relative_url }}"></script>

The [next BEE meeting](mailto:rui.bo@ed.ac.uk?subject=BEE%20Meeting%20Enquiry&body=Please%20send%20the%20link%20for%20the%20next%20BEE%20meeting%20.) will take place in:

<div class="countdown-container">
    <div class="countdown-display" id="meeting-countdown">
        Loading countdown…
    </div>
    <div class="meeting-schedule"><span id="next-meeting-date">Loading next meeting date…</span>.</div>
</div>

<script defer src="{{ '/assets/js/meeting-countdown.js' | relative_url }}"></script>

---
**Basic Statistics**
{% assign meeting_count = site.data.meeting | size %}
{% assign phd_work_count = 0 %}
{% for meeting in site.data.meeting %}
  {% assign topic = meeting.topic | default: "" | strip %}
  {% if topic != "" %}
    {% assign phd_work_count = phd_work_count | plus: 1 %}
  {% endif %}
{% endfor %}
{% assign participant_count = 0 %}
{% for row in site.data.participants %}
  {% assign participant_count = participant_count | plus: row.participants %}
{% endfor %}
{% assign institution_count = site.data.participants | map: "institution" | uniq | size %}
- **{{ meeting_count }}** meetings/workshops co-created,<br>
- **{{ phd_work_count }}** PhD works presented,<br>
- **{{ participant_count }}** participants from **{{ institution_count }}** institutions.<br>


---
**Key Updates**

- 2025-06-02: First meeting!
- 2026-05: A talk on ***model calibration technique*** by *** from PSL.
- 2026-06: A talk on ***model complexity required for energy-saving estimates*** by Rui from the University of Edinburgh.
- 2026-07: A literature sharing session on *machine learning in the built environment*.
- 2026-08: A talk on ***occupancy-based control*** by *** from Hong Kong PolyU.

*Geographic Distribution of Audience*
{% include map_audience.html %}

---
**Main Contacts**

Everyone is very welcome to join any knowledge-sharing session. Please [email](mailto:rui.bo@ed.ac.uk) for contact.
{% include institutions_logos.html %}
