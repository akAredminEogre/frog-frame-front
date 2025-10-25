import React from 'react';

import LabeledTextArea from 'src/components/molecules/LabeledTextArea';

interface NewStringTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const NewStringTextArea = ({
  value,
  onChange,
}: NewStringTextAreaProps) => {
  return (
    <LabeledTextArea
      label="置換後:"
      name="newString"
      value={value}
      onChange={onChange}
      placeholder="置換後のテキストを入力"
      rows={3}
    />
  );
};

export default NewStringTextArea;
