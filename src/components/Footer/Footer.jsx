import './Footer.scss'

const navigate = [
  { href: '#about',   label: 'Our Story' },
  { href: '#menu',    label: 'Menu' },
  { href: '#reserve', label: 'Reservations' },
  { href: '#location',label: 'Location' },
]

const visit = [
  { href: 'https://maps.google.com/?q=Terrapin+Creek+Cafe+Bodega+Bay', label: '1580 Eastshore Rd', external: true },
  { href: 'https://maps.google.com/?q=Terrapin+Creek+Cafe+Bodega+Bay', label: 'Bodega Bay, CA 94923', external: true },
  { href: 'tel:+17078752700',                     label: '(707) 875-2700' },
  { href: 'mailto:hello@terrapincreekcafe.com',   label: 'hello@terrapincreekcafe.com' },
]

const social = [
  { href: 'https://www.instagram.com/terrapincreekcafe', label: 'Instagram', external: true },
  { href: 'https://www.facebook.com/terrapincreekcafe',  label: 'Facebook',  external: true },
  { href: 'https://www.opentable.com/terrapin-creek-cafe', label: 'OpenTable Reviews', external: true },
  { href: '#',                                            label: 'Press & Media' },
]

function FooterLinks({ items }) {
  return (
    <ul>
      {items.map(({ href, label, external }) => (
        <li key={label}>
          <a
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <a href="#hero" className="footer__logo">
            Terrapin <span>Creek</span>
          </a>
          <p>
            A Michelin-recognized neighborhood cafe on the Sonoma Coast.
            Open Tuesday through Sunday for dinner.
          </p>
        </div>

        <div className="footer__col">
          <h4>Navigate</h4>
          <FooterLinks items={navigate} />
        </div>

        <div className="footer__col">
          <h4>Visit</h4>
          <FooterLinks items={visit} />
        </div>

        <div className="footer__col">
          <h4>Follow</h4>
          <FooterLinks items={social} />
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Terrapin Creek Cafe. All rights reserved.</span>
        <span>Bodega Bay · Sonoma Coast · California</span>
      </div>
    </footer>
  )
}
