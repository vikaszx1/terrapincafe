import './About.scss'

const stats = [
  { num: '2008', label: 'Founded' },
  { num: '5mi',  label: 'From the Pacific' },
  { num: '100%', label: 'Seasonal Menu' },
  { num: '★',    label: 'Michelin Recommended' },
]

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about__container">
        <div className="about__grid">

          {/* ── Visual column ── */}
          <div className="about__visual">
            <div className="about__accent" />
            <div className="about__img-frame">
              <p className="about__img-quote">
                "Food that tastes<br />like the ocean<br />remembers"
              </p>
            </div>
          </div>

          {/* ── Text column ── */}
          <div className="about__text">
            <p className="about__label reveal">Our Story</p>
            <h2 className="about__title reveal delay-1">
              Casual by Choice,<br /><em>Exceptional by Nature</em>
            </h2>
            <div className="about__michelin reveal delay-2">✦ Michelin Recognized</div>
            <p className="about__desc reveal delay-2">
              Nestled in a converted cottage on Bodega Bay's eastern shore, Terrapin Creek Cafe
              has been a beloved fixture since 2008. We believe extraordinary food doesn't require
              ceremony — just honest ingredients, thoughtful technique, and the kind of hospitality
              that makes strangers feel like regulars.
            </p>
            <p className="about__desc about__desc--spaced reveal delay-3">
              Our menu changes with the seasons and the tides. What arrives at your table was
              likely in the ocean or on the farm just days ago. This is coastal California cooking
              at its most genuine.
            </p>
            <div className="about__stats reveal">
              {stats.map(({ num, label }) => (
                <div className="about__stat" key={label}>
                  <div className="about__stat-num">{num}</div>
                  <div className="about__stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
