# Custom Hooks

This directory contains reusable React hooks for the application.

## Included Hooks

### useAppDispatch.js
Typed hook for dispatching Redux actions.

**Usage:**
```javascript
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { increment } from '@/features/example/exampleSlice';

function Counter() {
  const dispatch = useAppDispatch();
  
  const handleClick = () => {
    dispatch(increment());
  };
  
  return <button onClick={handleClick}>Increment</button>;
}
```

### useAppSelector.js
Typed hook for selecting state from Redux store.

**Usage:**
```javascript
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectCounter } from '@/features/example/exampleSlice';

function CounterDisplay() {
  const counter = useAppSelector(selectCounter);
  
  return <div>Count: {counter}</div>;
}
```

## Creating Custom Hooks

Custom hooks should:
- Start with the `use` prefix
- Encapsulate reusable logic
- Follow React's Rules of Hooks
- Be well-documented

### Example Custom Hook

```javascript
import { useState, useEffect } from 'react';

/**
 * Hook for debouncing a value
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

## Best Practices

- Keep hooks focused on a single responsibility
- Document parameters and return values
- Add JSDoc comments for better IDE support
- Feature-specific hooks can live in `features/[feature]/hooks/`
- Test custom hooks thoroughly
- Avoid hooks that are only used once (inline the logic instead)
