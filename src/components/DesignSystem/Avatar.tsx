import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name?: string) => {
    if (!name) return 'bg-[#6366F1]';
    const colors = [
      'bg-[#6366F1]',
      'bg-[#10B981]',
      'bg-[#F59E0B]',
      'bg-[#EF4444]',
      'bg-[#8B5CF6]',
      'bg-[#06B6D4]',
      'bg-[#EC4899]',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`${sizeStyles[size]} rounded-full object-cover border border-[#222] ${className}`}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeStyles[size]} ${getAvatarColor(name)} rounded-full flex items-center justify-center font-bold text-white border border-[#222] ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
