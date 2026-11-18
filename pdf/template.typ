// ─── CV Template ─────────────────────────────────────────────────────────────
// Jinja2 template — rendered by pdf/build.py before typst compilation.

#set document(
  title: {{ (person.name ~ " — CV") | t }},
  author: {{ person.name | t }},
  description: {{ person.title | t }},
  keywords: ({% for d in skills.domains %}{{ d | t }}, {% endfor %}{% for items in skills.technologies.values() %}{% for i in items %}{{ i | t }}, {% endfor %}{% endfor %}),
)

#set page(
  paper: "a4",
  margin: (x: 1.4cm, y: 1.1cm),
)

#set text(
  font: ("IBM Plex Sans", "Helvetica Neue", "Arial", "sans-serif"),
  size: 9pt,
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
  inset: (x: 4pt, y: 2pt),
  radius: 3pt,
  text(size: 7pt, fill: tag-fg, font: ("IBM Plex Mono", "Courier New", "monospace"), body),
)

#let section-title(body) = {
  v(2pt)
  text(size: 7pt, weight: "bold", fill: accent, upper(body))
  v(1pt)
  hrule()
  v(2pt)
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
{% set gh = person.links.github %}
{% set web = person.links.website %}
#grid(
  columns: (1fr, auto),
  gutter: 8pt,
  [
    #text(size: 18pt, weight: "bold", {{ person.name | t }})
    #linebreak()
    #text(size: 10pt, fill: muted, {{ person.title | t }})
  ],
  align(right + horizon)[
    #text(size: 7.5pt, fill: muted)[
      #{{ person.location | t }} \
      #link("mailto:{{ person.email }}")[#{{ person.email | t }}] \
      #link("https://linkedin.com/in/{{ person.links.linkedin }}")[LinkedIn]
      {% if gh and not gh.startswith("<") %}
      · #link("https://github.com/{{ gh }}")[GitHub]
      {% endif %}
      {% if web and not web.startswith("<") %}
      · #link("{{ web }}")[#{{ labels.website | t }}]
      {% endif %}
    ]
  ],
)

#v(4pt)
#hrule()

// ─── SUMMARY ─────────────────────────────────────────────────────────────────
#v(3pt)
#par(justify: false, text(size: 8.5pt, {{ summary | t }}))
#v(5pt)

// ─── TWO-COLUMN BODY ─────────────────────────────────────────────────────────
#grid(
  columns: (1fr, 0.6fr),
  gutter: 14pt,

  // ── LEFT: Experience ───────────────────────────────────────────────────────
  [
    #section-title({{ labels.experience | t }})

    {% for job in experience %}
    #grid(
      columns: (1fr, auto),
      [
        #text(weight: "semibold", {{ job.role | t }})
        #linebreak()
        #text(size: 8pt, fill: muted, {{ (job.company ~ ", " ~ job.location) | t }})
      ],
      align(right, text(size: 7.5pt, fill: muted, {{ job.period | period | t }})),
    )
    {% if job._bullets %}
    #list(
      indent: 5pt,
      body-indent: 4pt,
      {% for b in job._bullets %}
      [#{{ b | t }}],
      {% endfor %}
    )
    {% endif %}
    #v(3pt)
    {% endfor %}
  ],

  // ── RIGHT: Skills · Projects · Education · Languages ───────────────────────
  [
    #section-title({{ labels.skills | t }})

    {% for d in skills.domains %}#chip({{ d | t }}) {% endfor %}
    #v(4pt)

    {% for group, items in skills.technologies.items() %}
    #text(size: 7pt, weight: "semibold", upper({{ group | t }}))
    #linebreak()
    {% for item in items %}#chip({{ item | t }}) {% endfor %}
    #v(3pt)
    {% endfor %}

    #section-title({{ labels.projects | t }})

    {% for proj in projects %}
    {% if proj.url and not proj.url.startswith("<") %}
    #link({{ proj.url | t }})[#text(size: 7.5pt, weight: "semibold", fill: accent, {{ proj.name | t }})]
    {% else %}
    #text(size: 7.5pt, weight: "semibold", {{ proj.name | t }})
    {% endif %}
    #linebreak()
    #text(size: 7pt, {{ proj.description | t }})
    #v(3pt)
    {% endfor %}

    #section-title({{ labels.education | t }})

    {% for edu in education %}
    #text(size: 7.5pt, weight: "semibold", {{ edu.degree | t }})
    #linebreak()
    #text(size: 7pt, fill: muted)[#{{ edu.institution | t }} #h(1fr) #{{ ((edu.period | period) ~ (" · " ~ edu.grade if edu.grade is defined else "")) | t }}]
    #v(3pt)
    {% endfor %}

    #section-title({{ labels.languages | t }})

    #text(size: 7.5pt)[{% for lang in languages %}#{{ lang.name | t }} #text(fill: muted, {{ lang.level | t }}){% if not loop.last %} · {% endif %}{% endfor %}]
  ],
)

// ─── BEYOND WORK (full width, last) ──────────────────────────────────────────
{% if beyond_work %}
#section-title({{ labels.beyond | t }})
#grid(
  columns: (1fr,) * {{ [beyond_work | length, 3] | min }},
  gutter: 14pt,
  {% for item in beyond_work %}
  [
    {% if item.url and not item.url.startswith("<") %}
    #link({{ item.url | t }})[#text(size: 7.5pt, weight: "semibold", fill: accent, {{ item.title | t }})]
    {% else %}
    #text(size: 7.5pt, weight: "semibold", {{ item.title | t }})
    {% endif %}
    #linebreak()
    #text(size: 7pt, {{ item.description | t }})
  ],
  {% endfor %}
)
{% endif %}
