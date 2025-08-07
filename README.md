# solid-tiny-utils

Tiny utilities for SolidJS applications.

## Installation

```bash
pnpm add solid-tiny-utils
```

## Usage

```typescript
import { access, createWatch, CreateLoopExec, isFn, isArray } from 'solid-tiny-utils';
```

## API

### Reactive

#### `access(value)`
Safely access a value that might be an accessor function.

```typescript
const value = access(maybeAccessor); // Returns the value directly or calls the accessor
```

#### `createWatch(targets, fn, options?)`
Create a watcher that runs when dependencies change.

```typescript
createWatch(() => signal(), (value) => {
  console.log('Value changed:', value);
});
```

### Functions

#### `CreateLoopExec(fn, delay)`
Execute a function in a loop with cleanup support.

```typescript
CreateLoopExec(
  async () => {
    // Your async work here
  },
  1000 // Delay in milliseconds
);
```

### Type Guards

#### `isFn(value)`
Check if a value is a function.

```typescript
if (isFn(value)) {
  value(); // TypeScript knows it's a function
}
```

#### `isArray(value)`
Check if a value is an array.

```typescript
if (isArray(value)) {
  value.forEach(...); // TypeScript knows it's an array
}
```

### Types

```typescript
type MaybeArray<T> = T | T[];
type MaybePromise<T> = T | Promise<T>;
type MaybeAccessor<T> = T | Accessor<T>;
```
