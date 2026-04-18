import './Location.scss'

const MAPS_URL = 'https://maps.google.com/?q=Terrapin+Creek+Cafe+Bodega+Bay'
const MAPS_EMBED = 'https://maps.google.com/maps?q=1580+Eastshore+Rd,+Bodega+Bay,+CA+94923&t=&z=15&ie=UTF8&iwloc=&output=embed'

export default function Location() {
  return (
    <section id="location" className="location">
      <div className="location__container">
        <div className="location__grid">

          {/* ── Info column ── */}
          <div className="location__info">
            <p className="location__label reveal">Find Us</p>
            <h2 className="location__title reveal delay-1">
              On the Edge of<br /><em>Bodega Bay</em>
            </h2>
            <p className="location__desc reveal delay-2">
              We're tucked into the eastern shore of Bodega Bay, about 65 miles north of
              San Francisco on the Sonoma Coast. The drive is half the experience.
            </p>

            <ul className="location__list reveal delay-2">
              <li className="location__item">
                <div className="location__icon" aria-hidden="true">📍</div>
                <div className="location__item-content">
                  <span className="location__item-title">Address</span>
                  <span className="location__item-value">
                    <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                      1580 Eastshore Rd, Bodega Bay, CA 94923
                    </a>
                  </span>
                </div>
              </li>
              <li className="location__item">
                <div className="location__icon" aria-hidden="true">📞</div>
                <div className="location__item-content">
                  <span className="location__item-title">Phone</span>
                  <span className="location__item-value">
                    <a href="tel:+17078752700">(707) 875-2700</a>
                  </span>
                </div>
              </li>
              <li className="location__item">
                <div className="location__icon" aria-hidden="true">🕐</div>
                <div className="location__item-content">
                  <span className="location__item-title">Hours</span>
                  <div className="location__hours">
                    <span>Tuesday – Friday</span>  <span>5:00 – 9:00 PM</span>
                    <span>Saturday – Sunday</span> <span>4:30 – 9:30 PM</span>
                    <span>Monday</span>             <span>Closed</span>
                  </div>
                </div>
              </li>
              <li className="location__item">
                <div className="location__icon" aria-hidden="true">🚗</div>
                <div className="location__item-content">
                  <span className="location__item-title">Getting Here</span>
                  <span className="location__item-value location__item-value--small">
                    65 miles north of SF via Hwy 1. Free parking on site.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* ── Map column ── */}
          <div className="location__map-col reveal delay-2">
            <div className="location__map">
              <iframe
                title="Terrapin Creek Cafe location"
                src={MAPS_EMBED}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="location__map-link"
              >
                Open in Google Maps ↗
              </a>
            </div>

            <blockquote className="location__quote">
              <p>
                "One of the most memorable meals of our trip. The halibut was extraordinary
                and the setting absolutely magical."
              </p>
              <cite>— MICHELIN GUIDE CALIFORNIA</cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
