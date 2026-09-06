import { useState, useEffect, useRef } from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import navLinks from '../../assets/data/navLinks.json';
import * as styles from '../../styles/components/Navbar.styles';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout(); // clean context + localStorage
    navigate('/');
    setOpen(false);
  };

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close when clicking outside the mobile drawer
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <styles.Nav aria-label="Main navigation">
      <styles.Logo to="/">EventLife</styles.Logo>

      <styles.RightSide>
        {/* Desktop links */}
        <styles.NavLinks role="menubar">
          {navLinks.map(({ to, label, authRequired, guestOnly }) => {
            if (authRequired && !user) return null;
            if (guestOnly && user) return null;

            return (
              <styles.NavItem key={to} to={to} role="menuitem">
                {label}
              </styles.NavItem>
            );
          })}

          {user && (
            <styles.LogoutButton onClick={handleLogout} aria-label="Logout">
              Logout
            </styles.LogoutButton>
          )}
        </styles.NavLinks>

        {/* Desktop & Mobile theme toggle (visible on desktop here) */}
        <ThemeToggle />

        {/* Mobile hamburger (hidden on desktop).
            Hidden when drawer is open to avoid double “X”. */}
        <styles.Hamburger
          $open={open}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </styles.Hamburger>
      </styles.RightSide>

      {/* Dark overlay behind the drawer */}
      <styles.Overlay
        data-open={open ? 'true' : 'false'}
        onClick={() => setOpen(false)}
      />

      {/* Mobile drawer */}
      <styles.MobileMenu
        id="mobile-menu"
        ref={menuRef}
        data-open={open ? 'true' : 'false'}
        aria-hidden={!open}
      >
        <styles.MobileHeader>
          <styles.MobileTitle>Menu</styles.MobileTitle>
          <styles.CloseBtn
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            ✕
          </styles.CloseBtn>
        </styles.MobileHeader>

        <styles.MobileLinks role="menu">
          {navLinks.map(({ to, label, authRequired, guestOnly }) => {
            if (authRequired && !user) return null;
            if (guestOnly && user) return null;

            return (
              <styles.MobileItem
                key={to}
                to={to}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                {label}
              </styles.MobileItem>
            );
          })}

          {user && (
            <styles.MobileLogout onClick={handleLogout}>Logout</styles.MobileLogout>
          )}

          <styles.MobileExtras>
            <ThemeToggle />
          </styles.MobileExtras>
        </styles.MobileLinks>
      </styles.MobileMenu>
    </styles.Nav>
  );
};

export default Navbar;
