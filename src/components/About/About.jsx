import { useSiteData } from '../../context/SiteDataContext'
import './About.scss'

const stats = [
  { num: '2008', label: 'Founded' },
  { num: '5mi',  label: 'From the Pacific' },
  { num: '100%', label: 'Seasonal Menu' },
  { num: '★',    label: 'Michelin Recommended' },
]

export default function About() {
  const { about } = useSiteData()
  return (
    <section id="about" className="about">
      <div className="about__container">
        <div className="about__grid">

          {/* ── Visual column ── */}
          <div className="about__visual reveal">
            <div className="about__accent" />
            <div className="about__img-frame">
              <img
                src={about.image || '/images/about_us_img.jpg'}
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
            <p className="about__desc">{about.para1}</p>
            <p className="about__desc about__desc--spaced">{about.para2}</p>
            <p className="about__desc about__desc--spaced">{about.para3}</p>
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
