import { ArrowUpRight, Layers2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="site-footer site-footer-global">
      <Link to="/" className="brand">
        <span className="brand-mark">
          <Layers2 size={17} />
        </span>
        <span>
          boardflow<span className="brand-dot">.</span>
        </span>
      </Link>
      <span className="footer-tagline">Thoughtful work, together.</span>
      <nav className="footer-links" aria-label="Footer navigation">
        <Link to="/about">About</Link>
        <Link to="/features">Features</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/help">Help</Link>
        <Link to="/boards">
          Explore boards <ArrowUpRight size={12} />
        </Link>
      </nav>
    </footer>
  )
}
