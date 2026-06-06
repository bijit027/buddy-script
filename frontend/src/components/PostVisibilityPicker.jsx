import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../public/assets/css/PostVisibilityPicker.module.css';

const OPTIONS = [
  {
    value: true,
    label: 'Public',
    hint: 'Anyone can see this post',
    Icon: GlobeIcon,
  },
  {
    value: false,
    label: 'Private',
    hint: 'Only you can see this post',
    Icon: LockIcon,
  },
];

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 18 18" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9 16.5A7.5 7.5 0 109 1.5a7.5 7.5 0 000 15zM1.5 9h15M9 1.5c2.25 2.25 3.375 5.25 3.375 7.5S11.25 14.25 9 16.5 5.625 11.25 5.625 9 6.75 3.75 9 1.5z"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 18 18" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.25 7.5V5.25a3.75 3.75 0 117.5 0V7.5M3.75 7.5h10.5v7.5H3.75V7.5z"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12" aria-hidden="true">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 4.5L6 7.5 9 4.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.5 8.5l3 3 6-6" />
    </svg>
  );
}

export default function PostVisibilityPicker({ value, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const selected = OPTIONS.find((option) => option.value === value) ?? OPTIONS[0];
  const SelectedIcon = selected.Icon;

  const updateMenuPosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    setMenuStyle({
      '--menu-top': `${rect.bottom + 6}px`,
      '--menu-left': `${rect.left}px`,
    });
  };

  useEffect(() => {
    if (!open) return undefined;

    updateMenuPosition();

    const handleClickOutside = (event) => {
      const target = event.target;
      const insideTrigger = wrapperRef.current?.contains(target);
      const insideMenu = menuRef.current?.contains(target);

      if (!insideTrigger && !insideMenu) {
        setOpen(false);
      }
    };

    const handleReposition = () => updateMenuPosition();

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open]);

  const handleSelect = (nextValue) => {
    onChange(nextValue);
    setOpen(false);
  };

  const menu = open ? (
    <div
      ref={menuRef}
      className={styles.menu}
      role="listbox"
      aria-label="Choose post visibility"
      style={menuStyle}
    >
      {OPTIONS.map((option) => {
        const OptionIcon = option.Icon;
        const isSelected = option.value === value;

        return (
          <button
            key={option.label}
            type="button"
            role="option"
            aria-selected={isSelected}
            className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
            onClick={() => handleSelect(option.value)}
          >
            <span className={styles.optionIcon}>
              <OptionIcon />
            </span>
            <span className={styles.optionText}>
              <span className={styles.optionLabel}>{option.label}</span>
              <span className={styles.optionHint}>{option.hint}</span>
            </span>
            {isSelected && (
              <span className={styles.check}>
                <CheckIcon />
              </span>
            )}
          </button>
        );
      })}
    </div>
  ) : null;

  return (
    <div className={`${styles.wrapper} ${open ? styles.wrapperOpen : ''}`} ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Post visibility: ${selected.label}`}
      >
        <span className={`${styles.icon} ${!value ? styles.iconPrivate : ''}`}>
          <SelectedIcon />
        </span>
        <span className={styles.label}>{selected.label}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
          <ChevronIcon />
        </span>
      </button>

      {menu && createPortal(menu, document.body)}
    </div>
  );
}
