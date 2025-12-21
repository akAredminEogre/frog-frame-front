import React from 'react';

import styles from 'src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch.module.css';

/**
 * ToggleSwitchコンポーネントのProps
 */
export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * ルールの有効/無効を切り替えるToggleSwitchコンポーネント
 */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!disabled) {
        onChange(!checked);
      }
    }
  };

  return (
    <div className={styles.toggleContainer}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={styles.toggle}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
