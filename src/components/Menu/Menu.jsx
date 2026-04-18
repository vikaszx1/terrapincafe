import { useState } from 'react'
import { useSiteData } from '../../context/SiteDataContext'
import './Menu.scss'

function MenuCard({ name, price, desc, tags, image, allTags }) {
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
      {tags?.length > 0 && (
        <div className="menu-card__tags">
          {tags.map(tid => {
            const t = allTags.find(x => x.id === tid)
            return t ? (
              <span key={tid} className="tag" style={{ background: t.bg, color: t.color }}>
                {t.shortLabel}
              </span>
            ) : null
          })}
        </div>
      )}
    </article>
  )
}

export default function Menu() {
  const { menu: menuItems, tags: allTags, categories, hiddenCategories } = useSiteData()
  const visibleCategories = categories.filter(c => !hiddenCategories.includes(c.id))
  const [active, setActive] = useState(() => visibleCategories[0]?.id || '')

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
          {visibleCategories.map(({ id, label }) => (
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
          {(menuItems[active] || []).map(item => (
            <MenuCard key={item.id || item.name} {...item} allTags={allTags} />
          ))}
        </div>

        {/* ── Legend: driven by context tags ── */}
        <div className="menu__legend">
          {allTags.map(t => (
            <span key={t.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <span className="tag" style={{ background: t.bg, color: t.color }}>{t.shortLabel}</span>
              {t.fullLabel}
              &nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
