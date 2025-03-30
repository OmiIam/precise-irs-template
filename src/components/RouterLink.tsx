
import React from 'react';
import { Link as RouterDomLink } from 'react-router-dom';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// This component serves as a replacement for Next.js Link in a React Router environment
export const Link = ({ href, children, className, onClick }: LinkProps) => {
  return (
    <RouterDomLink to={href} className={className} onClick={onClick}>
      {children}
    </RouterDomLink>
  );
};

export default Link;
