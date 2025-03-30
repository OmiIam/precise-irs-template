
import React from 'react';
import { Link as RouterDomLink } from 'react-router-dom';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// This component serves as a wrapper for React Router's Link component
export const Link = ({ href, children, className, onClick }: LinkProps) => {
  return (
    <RouterDomLink to={href} className={className} onClick={onClick}>
      {children}
    </RouterDomLink>
  );
};

export default Link;
