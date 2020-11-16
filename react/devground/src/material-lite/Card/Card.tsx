import React from 'react';
import './Card.scss';

export interface MatCardProps {
  className?: string;
  children?: any;
}

export const MatCard = ({ className, children }: MatCardProps) => {
  return (
    <div className={`Ml-card ` + className}>{children}</div>
  )
}

export default MatCard;
