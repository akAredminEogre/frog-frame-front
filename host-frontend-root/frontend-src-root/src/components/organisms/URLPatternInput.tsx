import React from 'react';
import LabeledInput from 'src/components/molecules/LabeledInput';

interface URLPatternInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const URLPatternInput: React.FC<URLPatternInputProps> = ({
  value,
  onChange
}) => {
  return (
    <LabeledInput
      label="URLパターン (前方一致):"
      name="urlPattern"
      value={value}
      onChange={onChange}
      placeholder="例: https://qiita.com/"
      description="※ URLを指定することで任意のサイトで適用できます"
    />
  );
};

export default URLPatternInput;
