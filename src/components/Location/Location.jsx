import './Location.scss'

const MAPS_URL = 'https://maps.google.com/?q=Terrapin+Creek+Cafe+Bodega+Bay'
const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3132.0!2d-123.0567!3d38.3324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808450c65cc1e7d9%3A0xc7a3c5d5a4b2e1f0!2sTerrapin%20Creek%20Cafe!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus'

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
