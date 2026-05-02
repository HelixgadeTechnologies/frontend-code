import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface EntryDashboardHeaderProps {
  /** Called when "Aggregated Dashboard" is clicked. If omitted, the link is a plain anchor. */
  onAggregatedClick?: () => void;
  /** Called when "Trust Dashboard" is clicked. If omitted, the link is a plain anchor. */
  onTrustClick?: () => void;
  /** Highlights the matching nav item ('aggregated' | 'trust') regardless of URL. */
  activeNavKey?: "aggregated" | "trust";
}

const ACTIVE_CLS = "text-[#003B99] font-bold text-lg lg:text-xl transition-colors";
const INACTIVE_CLS = "text-gray-600 hover:text-[#003B99] font-bold text-lg lg:text-xl transition-colors";
const MOBILE_ACTIVE_CLS = "block text-[#003B99] font-bold text-lg";
const MOBILE_INACTIVE_CLS = "block text-gray-600 font-bold text-lg";

const EntryDashboardHeader = ({
  onAggregatedClick,
  onTrustClick,
  activeNavKey,
}: EntryDashboardHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getLinkClasses = (path: string, navKey?: string) => {
    if (navKey && activeNavKey) return navKey === activeNavKey ? ACTIVE_CLS : INACTIVE_CLS;
    return isActive(path) ? ACTIVE_CLS : INACTIVE_CLS;
  };

  const getMobileLinkClasses = (path: string, navKey?: string) => {
    if (navKey && activeNavKey) return navKey === activeNavKey ? MOBILE_ACTIVE_CLS : MOBILE_INACTIVE_CLS;
    return isActive(path) ? MOBILE_ACTIVE_CLS : MOBILE_INACTIVE_CLS;
  };

  interface LinkItem {
    href: string;
    title: string;
    external?: boolean;
    navKey?: string;
    onClick?: () => void;
  }

  const links: LinkItem[] = [
    { href: "https://hcdtmonitor.org/", title: "Home" },
    { href: "https://hcdtmonitor.org/about", title: "About" },
    {
      href: "/",
      title: "Aggregated Dashboard",
      navKey: "aggregated",
      onClick: onAggregatedClick,
      external: !onAggregatedClick,
    },
    {
      href: "/",
      title: "Trust Dashboard",
      navKey: "trust",
      onClick: onTrustClick,
      external: !onTrustClick,
    },
    { href: "https://hcdtmonitor.org/contact", title: "Contact" },
  ];

  const renderNavLink = (link: LinkItem, idx: number, mobile = false) => {
    const cls = mobile
      ? getMobileLinkClasses(link.href, link.navKey)
      : getLinkClasses(link.href, link.navKey);

    const handleClick = () => {
      if (link.onClick) link.onClick();
      if (mobile) setIsMenuOpen(false);
    };

    // State-switching button (Aggregated / Trust Dashboard when callbacks provided)
    if (link.onClick) {
      return (
        <button key={idx} onClick={handleClick} className={cls}>
          {link.title}
        </button>
      );
    }

    // External anchor
    if (link.external) {
      return (
        <a
          key={idx}
          href={link.href}
          className={cls}
          target="_blank"
          rel="noopener noreferrer"
          onClick={mobile ? () => setIsMenuOpen(false) : undefined}
        >
          {link.title}
        </a>
      );
    }

    // Internal router link
    return (
      <Link
        key={idx}
        to={link.href}
        className={cls}
        onClick={mobile ? () => setIsMenuOpen(false) : undefined}
      >
        {link.title}
      </Link>
    );
  };

  return (
    <>
      <header className="w-full flex flex-col">
        {/* Top Bar */}
        <div className="bg-[#002060] py-2 lg:py-3">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-center gap-y-2 lg:gap-y-4">
            <div className="flex-1 flex justify-center lg:justify-start">
              <h2 className="text-white text-xs lg:text-lg font-bold tracking-wider text-center lg:text-left">
                INDEPENDENT HOST COMMUNITY DEVELOPMENT TRUST MONITORING AND
                EVALUATION PLATFORM
              </h2>
            </div>

            <div className="flex items-center gap-x-2 lg:gap-x-3 mt-2 lg:mt-0">
              <Link to="/auth/1">
                <button className="px-4 lg:px-6 py-1.5 lg:py-3 text-xs lg:text-sm font-bold text-white bg-white/20 hover:bg-white/30 rounded transition-all">
                  Login
                </button>
              </Link>
              <Link to="/auth/2">
                <button className="px-4 lg:px-6 py-1.5 lg:py-3 text-xs lg:text-sm font-bold text-white bg-[#1671D9] hover:bg-blue-600 rounded transition-all">
                  Sign Up Free
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-[#E5E7EB] border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex flex-col">
                <span className="text-2xl lg:text-3xl font-black text-black leading-none">
                  I-HCDT
                </span>
                <span className="text-xs lg:text-sm font-bold text-[#003B99] tracking-[0.2em] uppercase">
                  Monitor
                </span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <ul className="hidden md:flex items-center space-x-8">
              {links.map((link, idx) => renderNavLink(link, idx))}
            </ul>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 p-2">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {links.map((link, idx) => renderNavLink(link, idx, true))}
          </div>
        </div>
      )}
    </>
  );
};

export default EntryDashboardHeader;
