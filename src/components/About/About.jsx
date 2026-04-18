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
          <div className="about__visual reveal">
            <div className="about__accent" />
            <div className="about__img-frame">
              <img
                src="/images/about_us_img.jpg"
                alt="Terrapin Creek Cafe chefs"
                className="about__img"
              />
            </div>
          </div>

          {/* ── Text column ── */}
          <div className="about__text reveal">
            <p className="about__label">Our Story</p>
            <h2 className="about__title">
              Casual by Choice,<br /><em>Exceptional by Nature</em>
            </h2>
            <div className="about__michelin">✦ Michelin Recognized</div>
            <p className="about__desc">
              TERRAPIN CREEK opened in 2008, envisioned as a casual neighborhood spot where friends
              and neighbors could enjoy the best ingredients our seasons have to offer.
            </p>
            <p className="about__desc about__desc--spaced">
              Most importantly, the kitchen is committed to using the highest quality local produce
              and meats in all of its dishes. Through a working friendship with Bay Area farmers,
              TERRAPIN CREEK is expanding the notion of comfort food to include dining that is
              casual, affordable, and responsible.
            </p>
            <p className="about__desc about__desc--spaced">
              TERRAPIN CREEK showcases both local and global cuisines using seasonal and locally
              sourced ingredients. Guests can select from a menu of raw treatments, such as oysters
              on a half shell and carpaccio from the raw bar, to a range of appetizers and entree
              plates as well as an assortment of artisan cheese and desserts.
            </p>
            <div className="about__stats">
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
