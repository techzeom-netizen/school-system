import type { AnchorHTMLAttributes, MouseEvent } from 'react';

interface HomeSectionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  sectionId: string;
}

const HomeSectionLink = ({
  sectionId,
  onClick,
  ...props
}: HomeSectionLinkProps) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onClick?.(event);

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    if (window.location.hash) {
      window.history.replaceState(null, '', '/');
    }
  };

  return <a href="/" onClick={handleClick} {...props} />;
};

export default HomeSectionLink;
