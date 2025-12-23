import { useFocusRing } from '@react-aria/focus';
import { useSwitch } from '@react-aria/switch';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { useToggleState } from '@react-stately/toggle';
import React, { useRef } from 'react';

import styles from 'src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch.module.css';

/**
 * ToggleSwitchコンポーネントのProps
 */
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel: string;
}

/**
 * ルールの有効/無効を切り替えるToggleSwitchコンポーネント
 * React Ariaを使用してWAI-ARIA準拠のアクセシビリティを実現
 */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  ariaLabel
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const state = useToggleState({
    isSelected: checked,
    onChange
  });

  const { inputProps } = useSwitch(
    {
      'aria-label': ariaLabel,
      isDisabled: disabled
    },
    state,
    inputRef
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <label className={styles.toggleContainer}>
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={inputRef} />
      </VisuallyHidden>
      <div
        className={`${styles.toggle} ${isFocusVisible ? styles.focusVisible : ''}`}
        data-selected={state.isSelected}
        data-disabled={disabled}
      />
    </label>
  );
};
