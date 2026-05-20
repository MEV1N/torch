# 🎨 Torch — UI/UX Design System & Brand Guidelines

## 🎯 Brand Identity

### Core Values
- **Romantic** — Emotionally engaging, intimate
- **Minimal** — Clean, distraction-free interface
- **Premium** — High quality, polished feel
- **Intimate** — Personal, couple-focused
- **Modern** — Contemporary design patterns

### Brand Promise
"Keep your love glowing" — We help couples stay connected through daily moments of intimacy and engagement.

---

## 🎨 Color Palette

### Primary Colors
```
Rose Primary:        #ff6b9d (used in buttons, accents)
Romantic Pink:       #ff4757 (highlights, hover states)
Romantic Purple:     #a29bfe (secondary accent)
Lavender:            #dfe6e9 (subtle accents)
```

### Neutrals
```
Background (Dark):   #0a0a0f (primary background)
Surface:             #1a1a1f (cards, surfaces)
Border Light:        rgba(255, 255, 255, 0.1) (borders)
Text (Foreground):   #f0f1f5 (primary text)
Text (Muted):        #9ca3af (secondary text)
```

### Semantic Colors
```
Success:             #10b981 (emerald)
Error:               #ef4444 (red)
Warning:             #f59e0b (amber)
Info:                #3b82f6 (blue)
```

### Gradients
```
Rose Gradient:       from-rose-primary to-romantic-pink
Purple Gradient:     from-romantic-purple to-lavender
Fire Gradient:       from-orange-500 to-red-600
Gold Gradient:       from-yellow-400 to-yellow-600
```

---

## 🔤 Typography

### Font Family
- **Sans Serif:** Geist (primary)
- **Mono:** Geist Mono (code snippets)

### Font Sizes
```
H1 (Titles):         2.5rem (40px) - bold
H2 (Headings):       1.875rem (30px) - bold
H3 (Subheadings):    1.5rem (24px) - bold
Body (Large):        1.125rem (18px) - regular
Body (Default):      1rem (16px) - regular
Body (Small):        0.875rem (14px) - regular
Caption:             0.75rem (12px) - regular
```

### Font Weights
```
Light:               300
Regular:             400
Medium:              500
Bold:                700
Extrabold:           800
```

---

## 🧩 Component Library

### Buttons

**Primary Button**
- Background: Gradient (Rose → Pink)
- Text: White
- Padding: px-6 py-3
- Border Radius: rounded-2xl
- Hover: scale 1.02
- Active: scale 0.98

**Secondary Button**
- Background: Purple/20
- Text: Purple
- Hover: Purple/30

**Ghost Button**
- Background: Transparent
- Text: Rose Primary
- Hover: bg-white/5

**Outline Button**
- Border: Rose Primary/50
- Text: Rose Primary
- Hover: bg-rose-primary/5

### Cards

**Glass Card**
- Background: Glassmorphism effect
- Border: white/10
- Backdrop Filter: blur-xl
- Shadow: xl
- Border Radius: rounded-3xl
- Padding: p-6

### Inputs

**Text Input**
- Background: white/5
- Border: white/10
- Rounded: rounded-2xl
- Focus: ring-2 ring-rose-primary
- Padding: px-4 py-3

### Modals/Dialogs
- Background: Overlay (black/50)
- Backdrop Filter: blur-md
- Animation: Fade in/out
- Border Radius: rounded-3xl

---

## 🎬 Animation Principles

### Micro-Interactions
- **Duration:** 200-300ms for UI interactions
- **Easing:** ease-out for entrances, ease-in for exits
- **Stagger:** 50-100ms between staggered items

### Transitions
- **Page transitions:** 300-500ms fade + slide
- **Modal open:** 300ms fade + scale
- **Button press:** 150ms scale
- **Hover states:** 200ms all

### Animations
- **Loading spinners:** 1s rotate infinite
- **Pulsing elements:** 2-3s pulse infinite
- **Floating elements:** 3-4s y-movement infinite
- **Gradient shifts:** 5s color-change infinite

### Avoid
- ❌ Flashing or strobing effects
- ❌ Animations over 500ms (feel sluggish)
- ❌ Simultaneous animations on same element
- ❌ Animations that distract from content

---

## 📱 Responsive Breakpoints

```
Mobile:      320px - 640px
Tablet:      641px - 1024px
Desktop:     1025px+

Tailwind Breakpoints:
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile-First Design
- Design for 320px width first
- Use Tailwind's sm:, md:, lg: prefixes
- Test on actual mobile devices
- Touch targets minimum 48x48px

---

## 🎯 Layout Patterns

### Full-Screen Modals
```
Header (with close button)
Content (scrollable)
Footer (optional buttons)
```

### Card Grid
```
Responsive columns:
- 1 column on mobile
- 2 columns on tablet
- 3 columns on desktop
Gap: 4 (1rem)
```

### Bottom Navigation
```
Position: fixed bottom
Height: nav height
Icons + labels
Backdrop blur + semi-transparent background
5-6 main navigation items
```

### Glass Card Pattern
```
Glassmorphism:
- Background: rgba(255,255,255, 0.1)
- Backdrop: blur-xl
- Border: white/10
- Box shadow: lg
- Rounded: 3xl
```

---

## ♿ Accessibility Guidelines

### Color Contrast
- Minimum WCAG AA (4.5:1 for text)
- Test with WebAIM contrast checker
- Don't rely on color alone

### Interactive Elements
- Focus states visible (ring-2)
- Keyboard navigation supported
- Touch targets 48x48px minimum
- Proper ARIA labels

### Semantic HTML
```html
<button> for clickable elements
<nav> for navigation
<header> for page header
<section> for content sections
<article> for blog posts
<footer> for page footer
```

### Images
- Always include alt text
- Describe content, not "image of"
- For decorative images: alt=""

---

## 🌙 Dark Mode Implementation

The app uses dark mode as default:

```css
/* Background */
background: #0a0a0f

/* Surface */
surface: #1a1a1f

/* Text */
text-foreground: #f0f1f5
text-muted: #9ca3af

/* Accents remain same */
rose-primary: #ff6b9d
romantic-purple: #a29bfe
```

### Light Mode (Future)
Consider adding light mode with:
- Light backgrounds
- Dark text
- Adjusted accent colors
- Reduced glow effects

---

## 📐 Spacing System

```
0: 0
1: 0.25rem (4px)
2: 0.5rem (8px)
3: 0.75rem (12px)
4: 1rem (16px)
5: 1.25rem (20px)
6: 1.5rem (24px)
8: 2rem (32px)
12: 3rem (48px)
16: 4rem (64px)
```

### Padding Rules
- Buttons: px-6 py-3 (minimum)
- Cards: p-6 (standard)
- Page: px-5 (mobile), px-8 (desktop)
- Sections: py-12 (vertical sections)

---

## 🖼️ Icon Guidelines

Using React Icons (HeroIcons v2):

```typescript
import { HiHeart, HiChat, HiPhotograph } from "react-icons/hi2";

// Sizes
<HiHeart className="text-2xl" />     // 24px (buttons)
<HiHeart className="text-3xl" />     // 30px (navigation)
<HiHeart className="text-4xl" />     // 36px (empty states)
<HiHeart className="text-5xl" />     // 48px (hero icons)
<HiHeart className="text-6xl" />     // 60px (special)

// Colors
className="text-rose-primary"
className="text-romantic-purple"
className="text-muted"
```

---

## 📸 Image Guidelines

### Sizes
- Hero images: 1920x1080 (or 1:1 for square)
- Card images: 540x540
- Thumbnails: 240x240
- Avatars: 48x48 (min) to 256x256

### Optimization
- Use Next.js `<Image>` component
- Serve WebP format
- Compression: 70-80% quality
- Max file size: 200KB per image

### User Uploads
- Accept JPG, PNG, WebP
- Max 10MB
- Auto-resize to max 2000x2000
- Compress before storing

---

## 🎬 Loading States

### Skeleton Loaders
- Use SkeletonLoader component
- Pulse animation (opacity 0.5 → 1 → 0.5)
- Match final component dimensions
- 2-3 skeleton items in lists

### Loading Spinners
- Spinning ring or dot
- Color: Rose Primary
- Size: 24-32px typically
- Duration: 1s per rotation

### Loading Messages
- "Loading your memories..."
- "Connecting with partner..."
- "Sending message..."
- Keep empathetic and brief

---

## 🎁 Micro-Interactions

### Button Hover
```
Scale: 1.02
Duration: 200ms
Easing: ease-out
```

### Button Press
```
Scale: 0.98
Duration: 150ms
Easing: ease-in-out
```

### Card Hover
```
Y: -4px
Shadow: increase
Duration: 200ms
```

### Input Focus
```
Ring: 2px rose-primary
Background: slightly brighter
Duration: 150ms
```

### Message Sent
```
Slide in from bottom
Fade in
Duration: 300ms
```

---

## 📱 Mobile-Specific Considerations

### Touch Targets
- Minimum 48x48px
- Spacing: 8px between targets
- Rounded corners for larger targets

### Safe Areas
- iPhone notch: padding-top safe
- Android gesture areas: padding-bottom safe
- Use `viewport-fit=cover` in meta

### Bottom Navigation
- Always accessible
- Fixed positioning
- Height: 80px (including label)
- Icons: 32px, labels: 12px

### Performance
- Lazy load images
- Reduce animations on low-end devices
- Optimize bundle size
- Cache aggressively

---

## 🔄 State Management

### Button States
- Default
- Hover
- Active (pressed)
- Disabled
- Loading

### Form States
- Empty
- Filled
- Focused
- Error
- Success
- Disabled

### Card States
- Normal
- Hover
- Active
- Selected

---

## 📚 Component Exports

All components in `src/components/`:

```typescript
// Layout
BottomNav
PageTransition
LoadingScreen

// Inputs & Buttons
Button (AnimatedButton)
Toast
Avatar

// Cards & Display
GlassCard
MemoryCardComponent
LoveNoteCardComponent
QuestionCard
StreakBadge
ChatBubble
DaysCounter

// Interactive
ThumbKiss

// Content
EmptyState
SkeletonLoader
```

---

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.ts`:
```javascript
colors: {
  'rose-primary': '#ff6b9d',
  'romantic-pink': '#ff4757',
  // ... more colors
}
```

### Fonts
Edit `src/app/layout.tsx`:
```typescript
const geistSans = Geist({
  subsets: ["latin"],
});
```

### Animations
Edit component `transition` props:
```typescript
transition={{ duration: 0.3, ease: "easeOut" }}
```

---

## ✨ Premium Feel Checklist

- ✅ Smooth animations throughout
- ✅ Consistent spacing and rhythm
- ✅ Glassmorphism effects
- ✅ Subtle gradients
- ✅ Proper contrast ratios
- ✅ Responsive design
- ✅ Micro-interactions
- ✅ High-quality images
- ✅ Proper error handling
- ✅ Loading states everywhere
- ✅ Emotional, romantic tone
- ✅ Touch-friendly interface

---

**Version:** 1.0
**Last Updated:** May 19, 2026
