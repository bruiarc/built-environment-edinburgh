---
layout: default
title: Home
---
Welcome to `Built Environment Edinburgh` community, a PhD student-led group at the *[University of Edinburgh](https://www.ed.ac.uk/)*{:.HL}, promoting research exchange in *sustainable and resilient built environments*{:.HL}, open to both internal and external participants. 

<img src="image_logo.png" alt="alt text" style="width:100%;" />


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
**What's Next**

<div class="countdown-container">
    <div class="countdown-display" id="meeting-countdown">
        Loading countdown…
    </div>
    <div class="meeting-schedule" id="next-meeting-date">
        Loading next meeting date…
    </div>
</div>

<script defer src="{{ '/assets/js/meeting-countdown.js' | relative_url }}"></script>


---
**Key Updates**

- 2025-06-02: First meeting!
- 2026-05: A talk on ***occupancy-based control*** by *** from PSL.
- 2026-06: A talk on ***model complexity required for energy-saving estimates*** by Rui from the University of Edinburgh.
- 2026-07: A literature sharing session on *machine learning in the built environment*.
- 2026-08: A talk on ***model calibration technique*** by *** from Hong Kong PolyU.
  
*Geographic Distribution of Audience*
{% include map_audience.html %}

---
**Main Contacts**

Everyone is very welcome to join any knowledge-sharing session. Please [email](mailto:rui.bo@ed.ac.uk) for contact.
{% include institutions_logos.html %}
