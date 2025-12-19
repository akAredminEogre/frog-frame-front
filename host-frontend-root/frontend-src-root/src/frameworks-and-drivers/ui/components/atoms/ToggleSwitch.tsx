import React from 'react';

/**
 * ToggleSwitchコンポーネントのProps
 */
export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * ルールの有効/無効を切り替えるToggleSwitchコンポーネント（スケルトン実装）
 */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled }) => {
  throw new Error(`Not implemented: ToggleSwitch with checked=${checked}, onChange=${typeof onChange}, disabled=${disabled}`);
};
