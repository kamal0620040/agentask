"use client";
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

export type TaskDescriptionFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
};

export function TaskDescriptionField({
  value,
  onChange,
  onBlur,
  placeholder = 'Add a description...',
}: TaskDescriptionFieldProps) {
  const [buffer, setBuffer] = useState(value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBuffer(value);
  }, [value]);

  function handleBlur() {
    if (buffer !== value) {
      onChange(buffer);
    }

    onBlur?.();
  }

  return (
    <Textarea
      aria-label="Description"
      className="min-h-32"
      value={buffer}
      onChange={(e) => setBuffer(e.target.value)}
      onBlur={handleBlur}
      placeholder={placeholder}
    />
  );
}