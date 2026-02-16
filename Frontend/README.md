# Glide - Premium Gesture Control Dashboard

A sophisticated React + Next.js dashboard for real-time gesture recognition and control with a glassmorphism design system.

## 🎯 Project Structure

```
app/
├── layout.tsx                    # Root layout with providers
├── page.tsx                      # Dashboard page (main)
├── globals.css                   # Global styles & design tokens
├── context/
│   ├── GestureContext.tsx        # Gesture state & actions
│   └── ModalContext.tsx          # Modal state management
├── gestures/
│   └── page.tsx                  # Gesture library manager
├── live/
│   └── page.tsx                  # Live detection feed
└── activity/
    └── page.tsx                  # Activity log

components/
├── Navigation.tsx                # Top navigation bar
├── StatCard.tsx                  # Stat cards with hover effects
├── ConfidenceRing.tsx            # Circular progress for confidence
├── StatusBadge.tsx               # Status indicator badges
├── ActionButton.tsx              # Animated action buttons
├── ProgressBar.tsx               # Linear progress bars
├── SystemHealthBar.tsx           # System status indicators
├── ModalsWrapper.tsx             # Modal provider wrapper
└── modals/
    ├── AddGestureModal.tsx       # Multi-step gesture creation
    ├── DeleteGestureModal.tsx    # Deletion confirmation
    └── [Future modals]

lib/
└── gesture-utils.ts              # Utility functions & helpers

public/
└── [Assets, images, etc.]
```

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (#6366F1 → #4F46E5)
- **Secondary**: Cyan (#06B6D4)
- **Background**: Dark #0F0F14
- **Surface**: rgba(255,255,255,0.05)
- **Text**: #F8FAFC (primary), #94A3B8 (secondary)

### Typography
- **Headings**: Inter, bold/semibold
- **Body**: Inter, 14-16px
- **Monospace**: JetBrains Mono (for technical values)

### Components
- **Glassmorphism**: Semi-transparent background + backdrop blur
- **Glow Effects**: Shadow with primary/secondary colors
- **Animations**: Framer Motion for smooth transitions

## 🚀 Features Implemented

### Phase 1-3: Foundation ✅
- [x] Design system with custom colors & animations
- [x] Global styles with glassmorphism utilities
- [x] Framer Motion integration
- [x] Context-based state management
- [x] Multi-page navigation with active states

### Phase 4-6: Core Pages ✅
- [x] Dashboard with stats cards & activity feed
- [x] Gesture library manager with grid layout
- [x] Live feed with real-time detection panel
- [x] Activity log with event timeline

### Phase 7: Reusable Components ✅
- [x] Stat cards with color variants
- [x] Confidence rings with animated progress
- [x] Status badges with pulse animations
- [x] Action buttons with loading states
- [x] Progress bars with gradient fills
- [x] System health indicators

### Phase 8: Modals ✅
- [x] Add gesture modal with multi-step wizard
- [x] Delete confirmation modal
- [x] Modal context for state management

### Phase 9: Animations 🔄
- [x] Page transitions (fade + slide)
- [x] Card stagger animations on load
- [x] Hover effects (lift + glow)
- [x] Button feedback animations
- [x] Status pulse animations

### Phase 10: Responsive Design 🔄
- Mobile-first approach implemented
- Responsive grid layouts using Tailwind breakpoints
- Touch-friendly button sizes (44px+)

## 📦 Dependencies

**Core:**
- Next.js 16.1.6
- React 19.2.3
- TypeScript 5.7.3

**UI & Styling:**
- Tailwind CSS 3.4.17
- Framer Motion 11.0.8
- Lucide React Icons
- shadcn/ui Components

**Utilities:**
- React Hook Form
- Zod (validation)
- Sonner (notifications)

## 🎮 Usage

### State Management

```tsx
// Use gesture context
import { useGesture } from '@/app/context/GestureContext'

export function MyComponent() {
  const { gestures, addGesture, updateGesture, deleteGesture } = useGesture()
  
  // ... component logic
}
```

### Modals

```tsx
// Open modals from anywhere
import { useModal } from '@/app/context/ModalContext'

export function MyComponent() {
  const { openModal, closeModal } = useModal()
  
  const handleDelete = (gestureId) => {
    openModal('deleteGesture', { id: gestureId, name: 'Swipe Left' })
  }
}
```

### Animations

```tsx
import { motion } from 'framer-motion'

export function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card"
    >
      {/* Content */}
    </motion.div>
  )
}
```

## 🔧 Customization

### Colors
Edit `app/globals.css` to modify the CSS custom properties:

```css
:root {
  --primary: 239 84% 67%;      /* Indigo */
  --secondary: 186 92% 50%;    /* Cyan */
  --background: 240 10% 5%;    /* Dark */
}
```

### Animations
Tailwind animations are defined in `tailwind.config.ts`. Add new keyframes there.

### Layout
The dashboard uses CSS Flexbox for most layouts with responsive classes:
- `md:` for tablets
- `lg:` for desktops

## 🔌 Backend Integration (Coming)

When connecting to a real backend:

1. Replace mock data in `GestureContext` with API calls
2. Implement WebSocket connection for real-time updates
3. Add authentication with Supabase or similar
4. Connect camera feed from Python backend

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (single column)
- **Tablet**: 768-1024px (2 columns)
- **Desktop**: > 1024px (full multi-column)

## 🎯 Key Features

- **Real-time Updates**: Gesture detections update instantly
- **Premium Aesthetics**: Glassmorphism with smooth animations
- **Responsive Design**: Works on desktop, tablet, mobile
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Performance**: Optimized animations, lazy loading ready

## 🚦 Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run dev server:
   ```bash
   pnpm dev
   ```

3. Open `http://localhost:3000`

## 📝 Notes

- Framer Motion is used for all animations
- Tailwind CSS is the primary styling approach
- Custom hooks provide easy state access throughout the app
- Modal system is extensible for additional modals

## 🎓 Learning Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Documentation](https://react.dev/)
