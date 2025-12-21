import React from 'react';

import styles from 'src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch.module.css';

/**
 * ToggleSwitchコンポーネントのProps
 */
export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * ルールの有効/無効を切り替えるToggleSwitchコンポーネント
 */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  ariaLabel
}) => {
  const handleClick = () => {
    onChange(!checked);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ') {
      event.preventDefault();
      onChange(!checked);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <div className={styles.toggleContainer}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        className={styles.toggle}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <span aria-hidden="true" />
      </button>
    </div>
  );
};
