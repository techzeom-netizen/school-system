# UI Components Guide

This guide explains the new reusable UI component system built with **Radix UI** and **Lucide React** icons.

## 🎨 **Design System Overview**

### **Technology Stack:**

- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful, customizable SVG icons
- **Tailwind CSS** - Utility-first CSS framework
- **Class Variance Authority** - Component variant management
- **Tailwind Merge** - Intelligent class merging

---

## 📁 **Component Structure**

```
src/
├── components/
│   └── ui/                    # 🆕 Reusable UI components
│       ├── button.tsx         # Button with variants
│       ├── card.tsx           # Card components
│       ├── input.tsx          # Input field
│       ├── dropdown-menu.tsx  # Dropdown menu
│       ├── avatar.tsx         # User avatar
│       ├── navigation-menu.tsx # Navigation menu
│       ├── tooltip.tsx        # Tooltips
│       ├── badge.tsx          # Status badges
│       ├── separator.tsx      # Visual separators
│       └── index.ts           # Component exports
├── lib/
│   └── utils.ts               # Utility functions
└── styles/
    └── globals.css            # Design system CSS
```

---

## 🧩 **Available Components**

### **1. Button Component**

```typescript
import { Button } from '../components/ui/button';

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon Only</Button>

// With icon
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Item
</Button>
```

### **2. Card Components**

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### **3. Input Component**

```typescript
import { Input } from '../components/ui/input';

<Input type="email" placeholder="Enter your email" />
<Input type="password" placeholder="Password" />
<Input disabled placeholder="Disabled input" />
```

### **4. Dropdown Menu**

```typescript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### **5. Avatar Component**

```typescript
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

<Avatar>
  <AvatarImage src="/path/to/image.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### **6. Navigation Menu**

```typescript
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../components/ui/navigation-menu';

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink asChild>
          <Link to="/products">All Products</Link>
        </NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### **7. Tooltip Component**

```typescript
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>This is a tooltip</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### **8. Badge Component**

```typescript
import { Badge } from '../components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

---

## 🎨 **Design System Variables**

### **Color Palette:**

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  --muted: 210 40% 96%;
  --accent: 210 40% 96%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
}
```

### **Dark Mode:**

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --secondary: 217.2 32.6% 17.5%;
  --muted: 217.2 32.6% 17.5%;
  --accent: 217.2 32.6% 17.5%;
  --destructive: 0 62.8% 30.6%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 94.1%;
}
```

---

## 🎯 **Lucide React Icons**

### **Usage:**

```typescript
import {
  Home,
  User,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

// Basic usage
<Home className="w-4 h-4" />

// With custom styling
<Settings className="w-5 h-5 text-blue-500" />

// In buttons
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Item
</Button>
```

### **Common Icons Used:**

- **Navigation**: `Home`, `User`, `Settings`, `Search`
- **Actions**: `Plus`, `Edit`, `Trash2`, `Save`, `Cancel`
- **Status**: `Check`, `X`, `AlertCircle`, `Info`
- **Direction**: `ChevronDown`, `ChevronUp`, `ArrowRight`, `ArrowLeft`
- **Communication**: `Bell`, `MessageCircle`, `Mail`

---

## 🛠️ **Utility Functions**

### **cn() Function:**

```typescript
import { cn } from '../lib/utils';

// Merge Tailwind classes with conflict resolution
cn('px-2 py-1', 'px-4'); // Returns 'py-1 px-4'

// Conditional classes
cn('base-class', condition && 'conditional-class');

// Multiple conditions
cn(
  'base-class',
  variant === 'primary' && 'bg-primary',
  size === 'lg' && 'text-lg'
);
```

### **Other Utilities:**

```typescript
import { formatCurrency, formatDate, debounce } from '../lib/utils';

// Format currency
formatCurrency(1234.56); // "$1,234.56"

// Format date
formatDate(new Date()); // "December 25, 2023"

// Debounce function
const debouncedSearch = debounce((query: string) => {
  // Search logic
}, 300);
```

---

## 🚀 **Best Practices**

### **1. Component Composition:**

```typescript
// ✅ Good - Compose components
<Card>
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <Input placeholder="Name" />
      <Input placeholder="Email" />
    </div>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>

// ❌ Avoid - Monolithic components
<ComplexUserForm />
```

### **2. Consistent Spacing:**

```typescript
// ✅ Good - Use consistent spacing
<div className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// ✅ Good - Use gap for flex
<div className="flex gap-4">
  <Button>Cancel</Button>
  <Button>Save</Button>
</div>
```

### **3. Icon Usage:**

```typescript
// ✅ Good - Consistent icon sizes
<Button size="sm">
  <Plus className="mr-2 h-4 w-4" />
  Add
</Button>

// ✅ Good - Semantic icons
<Button variant="destructive">
  <Trash2 className="mr-2 h-4 w-4" />
  Delete
</Button>
```

### **4. Accessibility:**

```typescript
// ✅ Good - Proper ARIA labels
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// ✅ Good - Semantic HTML
<Button asChild>
  <Link to="/dashboard">Dashboard</Link>
</Button>
```

---

## 📱 **Responsive Design**

### **Breakpoints:**

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### **Mobile-First Approach:**

```typescript
// ✅ Good - Mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>
```

---

## 🎨 **Customization**

### **Adding New Variants:**

```typescript
// In button.tsx
const buttonVariants = cva('inline-flex items-center justify-center...', {
  variants: {
    variant: {
      default: 'bg-primary...',
      // Add new variant
      success: 'bg-green-500 text-white hover:bg-green-600',
    },
  },
});
```

### **Custom CSS Variables:**

```css
:root {
  --custom-primary: 142 76% 36%;
  --custom-secondary: 210 40% 96%;
}
```

---

## 🔧 **Development Workflow**

### **Adding New Components:**

1. Create component in `src/components/ui/`
2. Follow Radix UI patterns for accessibility
3. Use `cn()` utility for class merging
4. Export from `src/components/ui/index.ts`
5. Document usage in this guide

### **Testing Components:**

```typescript
// Test component variants
<Button variant="default">Test</Button>
<Button variant="destructive">Test</Button>
<Button variant="outline">Test</Button>
```

---

## 📚 **Resources**

- **Radix UI Docs**: https://www.radix-ui.com/
- **Lucide Icons**: https://lucide.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Class Variance Authority**: https://cva.style/

---

## 🎉 **Conclusion**

This UI component system provides:

- ✅ **Accessible** components built on Radix UI
- ✅ **Consistent** design with Tailwind CSS
- ✅ **Flexible** variants with CVA
- ✅ **Beautiful** icons with Lucide React
- ✅ **Type-safe** TypeScript implementation
- ✅ **Reusable** across the entire application

The system is designed to scale with your application while maintaining consistency and accessibility.
