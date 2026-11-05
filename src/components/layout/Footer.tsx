import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navbar-bg full-width-container border-t border-border/50 py-2 mt-auto ">
      <div className="container-responsive">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-navbar-text">
          <div>
            Demo School &copy; {new Date().getFullYear()}. All rights reserved.
          </div>
          <div>
            Made By{' '}
            <a
              href="https://zeksta.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navbar-text hover:text-navbar-text-hover underline font-medium transition-colors"
            >
              Zeksta Technology
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
