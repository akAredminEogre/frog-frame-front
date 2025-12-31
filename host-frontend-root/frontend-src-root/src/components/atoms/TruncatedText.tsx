import React from 'react';

interface TruncatedTextProps {
  text: string | null | undefined;
  maxLength?: number;
  fallback?: string;
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLength = 30,
  fallback = '-'
}) => {
  if (!text) {
    return <>{fallback}</>;
  }

  const displayText = text.length > maxLength
    ? text.substring(0, maxLength) + '...'
    : text;

  return <>{displayText}</>;
};
