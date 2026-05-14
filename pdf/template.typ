// ─── CV Template ─────────────────────────────────────────────────────────────
// Jinja2 template — rendered by pdf/build.py before typst compilation.

#set document(
  title: "{{ person.name }} — CV",
  author: "{{ person.name }}",
)

#set page(
  paper: "a4",
  margin: (x: 1.4cm, y: 1.2cm),
)

#set text(
  font: ("IBM Plex Sans", "Helvetica Neue", "Arial", "sans-serif"),
  size: 9.5pt,
  lang: "{{ meta.language }}",
  fallback: true,
)

#show heading: set text(font: ("IBM Plex Sans", "sans-serif"))

// ─── Colour palette ──────────────────────────────────────────────────────────
#let accent    = rgb("#1a56db")
#let muted     = rgb("#64748b")
#let divider   = rgb("#e2e8f0")
#let tag-bg    = rgb("#f1f5f9")
#let tag-fg    = rgb("#334155")

// ─── Helpers ─────────────────────────────────────────────────────────────────
#let hrule() = line(length: 100%, stroke: 0.5pt + divider)

#let chip(body) = box(
  fill: tag-bg,
  inset: (x: 5pt, y: 2pt),
  radius: 3pt,
  text(size: 7.5pt, fill: tag-fg, font: ("IBM Plex Mono", "Courier New", "monospace"), body),
)

#let section-title(body) = {
  v(5pt)
  text(size: 7.5pt, weight: "bold", fill: accent, upper(body))
  v(1pt)
  hrule()
  v(3pt)
}

#let period-label(p) = {
  let from = p.from
  let to   = if p.to == none { "present" } else { p.to }
  text(size: 8pt, fill: muted, from + " – " + to)
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
#grid(
  columns: (1fr, auto),
  gutter: 8pt,
  [
    #text(size: 20pt, weight: "bold", "{{ person.name }}")
    #linebreak()
    #text(size: 11pt, fill: muted, "{{ person.title }}")
  ],
  align(right + horizon)[
    #text(size: 8pt, fill: muted)[
      {{ person.location }} \
      #link("mailto:{{ person.email }}")[{{ person.email | replace("@", "\\@") }}] \
      #link("https://linkedin.com/in/{{ person.links.linkedin }}")[LinkedIn] ·
      #link("https://github.com/{{ person.links.github }}")[GitHub]
      {% if person.links.website and person.links.website != "<da_compilare>" %}
      · #link("{{ person.links.website }}")[Website]
      {% endif %}
    ]
  ],
)

#v(6pt)
#hrule()

// ─── SUMMARY ─────────────────────────────────────────────────────────────────
#v(4pt)
#text(size: 9pt, "{{ summary | trim }}")
#v(8pt)

// ─── TWO-COLUMN BODY (65% / 35%) ─────────────────────────────────────────────
#grid(
  columns: (1fr, 0.52fr),
  gutter: 16pt,

  // ── LEFT: Experience ───────────────────────────────────────────────────────
  [
    #section-title("Experience")

    {% for job in experience %}
    #grid(
      columns: (1fr, auto),
      [
        #text(weight: "semibold", "{{ job.role }}")
        #linebreak()
        #text(size: 8.5pt, fill: muted, "{{ job.company }}, {{ job.location }}")
      ],
      align(right)[#period-label((from: "{{ job.period.from }}", to: {{ "none" if job.period.to is none else '"' + job.period.to + '"' }}))]
    )
    {% set bullets = [] %}
    {% if emphasis == "leadership" %}
      {% set bullets = job.highlights.leadership %}
    {% elif emphasis == "engineering" %}
      {% set bullets = job.highlights.engineering %}
    {% else %}
      {% set bullets = (job.highlights.leadership + job.highlights.engineering) | unique %}
    {% endif %}
    {% if bullets %}
    #list(
      indent: 6pt,
      body-indent: 4pt,
      {% for b in bullets %}{% if b %}
      [{{ b }}],
      {% endif %}{% endfor %}
    )
    {% endif %}
    #v(4pt)
    {% endfor %}
  ],

  // ── RIGHT: Skills · Education · Projects · Languages · Beyond ─────────────
  [
    // Skills ─────────────────────────────────────────────────────────────────
    #section-title("Skills")

    {% for d in skills.domains %}#chip("{{ d }}") {% endfor %}
    #v(5pt)

    {% for group, items in skills.technologies.items() %}
    #text(size: 7.5pt, weight: "semibold", upper("{{ group }}"))
    #linebreak()
    {% for item in items %}#chip("{{ item }}") {% endfor %}
    #v(4pt)
    {% endfor %}

    // Education ──────────────────────────────────────────────────────────────
    #section-title("Education")

    {% for edu in education %}
    #text(size: 8pt, weight: "semibold", "{{ edu.degree }}")
    #linebreak()
    #text(size: 7.5pt, fill: muted, "{{ edu.institution }}")
    #h(1fr)
    #text(size: 7.5pt, fill: muted, "{{ edu.period.from }}–{{ edu.period.to }}")
    {% if edu.grade is defined %}
    #h(4pt) #text(size: 7.5pt, fill: muted, "{{ edu.grade }}")
    {% endif %}
    #v(4pt)
    {% endfor %}

    // Projects ───────────────────────────────────────────────────────────────
    #section-title("Projects")

    {% for proj in projects %}
    {% if proj.url is defined and proj.url and not proj.url.startswith("<") %}
    #link("{{ proj.url }}")[#text(size: 8pt, weight: "semibold", "{{ proj.name }}")]
    {% else %}
    #text(size: 8pt, weight: "semibold", "{{ proj.name }}")
    {% endif %}
    #linebreak()
    #text(size: 7.5pt, fill: muted, "{{ proj.role }}")
    #linebreak()
    #text(size: 7.5pt, "{{ proj.description | trim }}")
    #v(4pt)
    {% endfor %}

    // Languages ──────────────────────────────────────────────────────────────
    #section-title("Languages")

    {% for lang in languages %}
    #text(size: 8pt, "{{ lang.name }}") #h(4pt) #text(size: 7.5pt, fill: muted, "{{ lang.level }}")
    #linebreak()
    {% endfor %}

    // Beyond work ─────────────────────────────────────────────────────────────
    {% if beyond_work is defined and beyond_work %}
    #section-title("Beyond work")

    {% for item in beyond_work %}
    {% if item.url is defined and item.url and not item.url.startswith("<") %}
    #link("{{ item.url }}")[#text(size: 8pt, weight: "semibold", "{{ item.title }}")]
    {% else %}
    #text(size: 8pt, weight: "semibold", "{{ item.title }}")
    {% endif %}
    #linebreak()
    #text(size: 7.5pt, fill: muted, "{{ item.description | trim | replace('\n', ' ') }}")
    #v(3pt)
    {% endfor %}
    {% endif %}
  ],
)
