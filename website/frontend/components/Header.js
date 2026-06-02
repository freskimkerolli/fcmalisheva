import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <img
            src="/assets/MalishevaLogo.png"
            alt="FC Malisheva"
            className="logo"
          />
          <div className="brand-text">
            <span className="site-title">FC Malisheva</span>
          </div>
        </div>
        <ThemeToggle />
      </div>
      <nav className="nav-menu">
        <Link href="/">Ballina</Link>
        <Link href="/team">Ekipi</Link>
        <Link href="/staff">Stafi</Link>
        <Link href="/results">Rezultatet</Link>
        <Link href="/history">Historiku</Link>
        <Link href="/gallery">Galeria</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/admin">Admin</Link>
      </nav>
    </header>
  );
}
