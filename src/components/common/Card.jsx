import React from 'react';

const Card = ({ children, className = '', hover = true, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-100 p-6 shadow-sm transition-all duration-300 ${
        hover ? 'hover:-translate-y-1 hover:shadow-xl hover:shadow-[#195D9B]/5 hover:border-slate-200' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
