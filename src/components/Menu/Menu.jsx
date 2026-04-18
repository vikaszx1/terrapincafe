import { useState } from 'react'
import { menuCategories, tagLabels } from '../../data/menuData'
import { useSiteData } from '../../context/SiteDataContext'
import './Menu.scss'

function MenuCard({ name, price, desc, tags, image }) {
  return (
    <article className="menu-card">
      {image && (
        <img
          src={image}
          alt={name}
          className="menu-card__img"
          onError={e => { e.target.style.display = 'none' }}
        />
      )}
      <div className="menu-card__header">
        <span className="menu-card__name">{name}</span>
        <span className="menu-card__price">{price}</span>
      </div>
      <p className="menu-card__desc">{desc}</p>
      {tags.length > 0 && (
        <div className="menu-card__tags">
          {tags.map(tag => (
            <span key={tag} className={`tag ${tagLabels[tag].className}`}>
              {tagLabels[tag].label}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

export default function Menu() {
  const [active, setActive] = useState('starters')
  const { menu: menuItems } = useSiteData()

  return (
    <section id="menu" className="menu">
      <div className="menu__container">
        <div className="menu__header">
          <p className="menu__label reveal">Seasonal Menu</p>
          <h2 className="menu__title reveal delay-1">
            What the Sea &amp; <em>Land Offer Today</em>
          </h2>
          <p className="menu__desc reveal delay-2">
            Our menu reflects what's freshest. Prices and dishes change with the seasons — we update them weekly.
          </p>
        </div>

        {/* ── Tabs ── */}
        <div className="menu__tabs reveal" role="tablist">
          {menuCategories.map(({ id, label }) => (
            <button
              key={id}
              role="tab"
              aria-selected={active === id}
              className={`menu__tab ${active === id ? 'menu__tab--active' : ''}`}
              onClick={() => setActive(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Panel ── */}
        <div className="menu__grid" role="tabpanel">
          {menuItems[active].map(item => (
            <MenuCard key={item.name} {...item} />
          ))}
        </div>

        {/* ── Legend ── */}
        <div className="menu__legend">
          <span className="tag tag-gf">GF</span> Gluten-Free &nbsp;
          <span className="tag tag-vg">VG</span> Vegan &nbsp;
          <span className="tag tag-v">V</span> Vegetarian
        </div>
      </div>
    </section>
  )
}
