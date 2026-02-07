# Components

This directory contains reusable UI components organized by purpose.

## Structure

```
components/
  common/       # Shared, reusable components (buttons, inputs, cards, etc.)
  layout/       # Layout components (header, footer, sidebar, navigation)
```

## Component Organization

### common/
Generic, reusable components that can be used throughout the application.

**Examples:**
- Button, Input, Select, Modal
- Card, Badge, Avatar
- LoadingSpinner, ErrorMessage
- DataTable, Pagination

**Guidelines:**
- Should be highly reusable and context-agnostic
- Accept props for customization
- Use Tailwind CSS for styling
- Should not directly access Redux state (receive data via props)

### layout/
Components that define the application structure and navigation.

**Examples:**
- Header, Footer, Navbar
- Sidebar, MainLayout
- PageContainer, Section

**Guidelines:**
- May connect to Redux for navigation state or user info
- Define consistent page structure
- Handle responsive layout patterns

## Component Patterns

### Presentational Component Example
```javascript
export default function Button({ onClick, children, variant = 'primary' }) {
  const baseClasses = 'px-4 py-2 rounded font-medium';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}
```

### Container Component Example
```javascript
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectUser } from '@/features/user/userSlice';

export default function UserProfile() {
  const user = useAppSelector(selectUser);
  
  return <UserProfileView user={user} />;
}
```

## Best Practices

- Keep components small and focused
- Separate presentation from business logic (container/presentational pattern)
- Use custom hooks for complex logic
- Feature-specific components should live in `features/` directory
- Export one component per file (except for closely related sub-components)
