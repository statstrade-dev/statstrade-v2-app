import React from 'react';

type DatePickerProps = {
  value?: Date;
  type?: 'date' | 'time' | 'datetime';
  onChange?: (date: Date) => void;
  [key: string]: unknown;
};

const DatePicker = React.forwardRef<{ showPicker: () => void }, DatePickerProps>(
  function DatePicker({ value, type = 'date', onChange, ...props }, ref) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => ({
      showPicker: () => inputRef.current?.showPicker?.(),
    }));

    const inputType = type === 'time' ? 'time' : 'date';
    const inputValue = value
      ? type === 'time'
        ? value.toTimeString().slice(0, 5)
        : value.toISOString().slice(0, 10)
      : '';

    return (
      <input
        {...props}
        ref={inputRef}
        type={inputType}
        value={inputValue}
        onChange={(event) => {
          const nextValue = event.currentTarget.value;
          if (nextValue) onChange?.(new Date(nextValue));
        }}
      />
    );
  },
);

export default { DatePicker };
