import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { cn } from '@/lib/utils'; // Предполагается утилита для объединения классов (clsx + tailwind-merge)

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: FC<ButtonProps> = ({
  children,
  className,
  disabled = false,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles =
    'px-6 py-2 rounded-[8px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center justify-center gap-2';
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white focus:ring-purple-500',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-white focus:ring-zinc-500',
    outline:
      'border border-purple-500 text-purple-500 hover:bg-purple-500/10 focus:ring-purple-500',
    ghost: 'text-purple-500 hover:bg-purple-500/10 focus:ring-purple-500',
  };
  const disabledStyles =
    'opacity-50 cursor-not-allowed hover:from-pink-500 hover:to-purple-600 hover:bg-zinc-800 hover:bg-purple-500/10';

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        disabled && disabledStyles,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      <span>{children}</span>
      {icon && iconPosition === 'right' && icon}
    </button>
  );
};

export default Button;
