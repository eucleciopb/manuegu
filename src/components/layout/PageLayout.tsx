import type { ReactNode } from 'react';
import { BotanicalCorner, BotanicalDivider, BotanicalGarland } from '../decor/BotanicalDecor';
import { BotanicalBackground } from '../decor/BotanicalBackground';
import { brand } from '../../lib/brand';

interface PageLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  centered?: boolean;
}

export function PageLayout({ children, showHeader = true, centered = true }: PageLayoutProps) {
  return (
    <div className="page-layout">
      <BotanicalBackground />
      <BotanicalCorner className="botanical-corner-tl" />
      <BotanicalCorner className="botanical-corner-tr" />

      {showHeader && (
        <header className="page-header">
          <BotanicalGarland className="page-header-garland" />
          <p className="header-subtitle">{brand.eventName}</p>
          <h1 className="header-title">{brand.coupleDisplay}</h1>
          <BotanicalDivider />
        </header>
      )}

      <main className={`page-main ${centered ? 'page-main-centered' : ''}`}>{children}</main>

      <footer className="page-footer">
        <BotanicalDivider className="page-footer-divider" />
        <p>{brand.footerLine}</p>
      </footer>
    </div>
  );
}
