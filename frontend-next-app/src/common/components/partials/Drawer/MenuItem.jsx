import { useState } from 'react';
import clsx from 'clsx';
import { BsArrowRightShort as ExternalLinkIcon } from 'react-icons/bs';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MenuItem({
  title,
  href,
  icon,
  onClick,
  children,
  hideIcon = false,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const isActiveRoute = router.pathname === href;

  const activeClasses = clsx(
    'flex items-center gap-2 px-2.5 py-2 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 hover:dark:text-zinc-300 rounded-lg group',
    {
      'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:!text-zinc-200 gap-3':
        isActiveRoute,
      'hover:dark:bg-zinc-800 hover:gap-3 hover:dark:!text-zinc-300 hover:bg-zinc-200 hover:rounded-lg transition-all duration-300':
        !isActiveRoute,
    },
  );

  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const itemComponent = () => {
    return (
      <Link href={href} passHref>
        <div
          className={activeClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {!hideIcon && (
            <div
              className={clsx(
                'transition-transform duration-300 group-hover:-rotate-12',
                isActiveRoute && '-rotate-12 animate-pulse',
              )}
            >
              {icon}
            </div>
          )}
          <div className='ml-0.5 flex-grow'>{title}</div>
          {children && <>{children}</>}
          {isActiveRoute && (
            <ExternalLinkIcon
              size={22}
              className='animate-pulse text-default-500'
            />
          )}
        </div>
      </Link>
    );
  };

  return itemComponent();
}
