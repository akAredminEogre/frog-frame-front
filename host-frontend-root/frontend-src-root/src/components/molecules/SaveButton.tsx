import React from 'react';
import { Button } from 'src/components/atoms/Button';

interface SaveButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  isLoading = false
}) => {
  return (
    <Button onClick={onClick} disabled={isLoading}>
      {isLoading ? '保存中...' : '保存'}
    </Button>
  );
};

export default SaveButton;
