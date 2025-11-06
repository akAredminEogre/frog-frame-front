import React from 'react';

import { Button } from 'src/components/atoms/Button';

interface CancelButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  disabled = false
}) => {
  return (
    <Button onClick={onClick} disabled={disabled} variant="secondary">
      キャンセル
    </Button>
  );
};

export default CancelButton;
