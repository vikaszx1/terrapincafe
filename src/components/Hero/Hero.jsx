import './Hero.scss'

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero__bg" />

      <div className="hero__wave-layer">
        <div className="hero__wave hero__wave--1" />
        <div className="hero__wave hero__wave--2" />
        <div className="hero__wave hero__wave--3" />
      </div>

      <div className="hero__content">
        <div className="hero__badge">
          <span>✦</span> Michelin Recognized · Bodega Bay, California
        </div>

        <h1 className="hero__title">
          Where the Coast<br />
          <em>Comes to Table</em>
        </h1>

        <p className="hero__sub">
          Fresh, seasonal, soulful — a neighborhood gem on the edge of the Pacific
        </p>

        <div className="hero__ctas">
          <a href="#reserve" className="btn-primary">Reserve a Table</a>
          <a href="#menu" className="btn-outline">Explore the Menu</a>
        </div>
      </div>
    </section>
  )
}
