import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95';

  const variants = {
    primary:
      'bg-[#195D9B] text-white hover:bg-[#154E83] focus:ring-[#195D9B] shadow-baticleanBlue-500/20',
    secondary:
      'bg-[#EF9437] text-white hover:bg-[#D67E25] focus:ring-[#EF9437] shadow-baticleanOrange-500/25',
    outline:
      'border-2 border-[#195D9B] text-[#195D9B] hover:bg-[#195D9B] hover:text-white focus:ring-[#195D9B]',
    ghost:
      'text-slate-700 hover:bg-slate-100 focus:ring-slate-400 border border-transparent shadow-none',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5 font-bold',
  };

  return (
    <button
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
