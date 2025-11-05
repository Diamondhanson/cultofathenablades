'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { navigation, routes } from '@/config/routes';
import Image from 'next/image';
import logo from '@/assets/images/logo.png';
import styles from './Navbar.module.css';
import { useCart } from '@/lib/cart/CartProvider';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href={routes.home} className={styles.logo}>
          <Image src={logo} alt="Cult of Athena Blades logo" width={90} height={90} style={{ objectFit: 'contain' }} />
        </Link>

        {/* Desktop Navigation */}
        <ul className={styles.navLinks}>
          {navigation.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className={styles.navLink}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Cart Icon */}
        <div className={styles.actions}>
          <Link href={routes.cart} className={styles.cartButton} aria-label="Shopping cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className={styles.cartCount}>{count}</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <ul className={styles.mobileNavLinks}>
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

