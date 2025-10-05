# BarNode Design Guidelines

## Design Approach
**Selected Approach:** Custom Design System with Material Design influences
**Justification:** Utility-focused application requiring clean, efficient interface with modular structure. The natural color palette (cream, mint, green) suggests a fresh, approachable brand identity that balances professionalism with accessibility.

## Core Design Elements

### A. Color Palette

**Primary Colors:**
- **Verde Primary:** 145 96% 16% (brand identity, primary actions)
- **Menta Accent:** 108 64% 76% (secondary actions, highlights)
- **Crema Background:** 51 90% 94% (main background, cards)

**Supporting Colors:**
- **Verde Dark:** 145 96% 12% (hover states, emphasis)
- **Verde Light:** 145 60% 35% (borders, subtle elements)
- **Menta Dark:** 108 50% 65% (hover on secondary)
- **Neutral Gray:** 0 0% 45% (text secondary, icons)
- **Text Primary:** 0 0% 15% (body text)
- **White:** 0 0% 100% (cards on colored backgrounds)

**Dark Mode:**
- Background: 145 20% 8%
- Surface: 145 15% 12%
- Text Primary: 51 90% 94%
- Verde adjusted to: 145 80% 35%

### B. Typography

**Font Families:**
- Primary: 'Inter', system-ui, sans-serif (for UI, buttons, headings)
- Secondary: 'Source Sans Pro', sans-serif (for body text, descriptions)

**Type Scale:**
- Headline Large: 3rem (48px), font-weight 700, line-height 1.1
- Headline Medium: 2.25rem (36px), font-weight 600, line-height 1.2
- Title: 1.5rem (24px), font-weight 600, line-height 1.3
- Body Large: 1.125rem (18px), font-weight 400, line-height 1.6
- Body: 1rem (16px), font-weight 400, line-height 1.6
- Caption: 0.875rem (14px), font-weight 400, line-height 1.5

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing: p-2, gap-2 (component internals)
- Standard spacing: p-4, m-4, gap-4 (between elements)
- Section spacing: py-8, px-6 (mobile), py-12, px-8 (desktop)
- Large sections: py-16 (major page divisions)

**Container Widths:**
- Maximum content: max-w-6xl
- Centered content: mx-auto
- Full-width sections: w-full with inner max-w-6xl

**Grid System:**
- Mobile: Single column (grid-cols-1)
- Tablet: 2 columns (md:grid-cols-2)
- Desktop: Maintain 2-col or use 3-col for card grids (lg:grid-cols-3)

### D. Component Library

**Navigation:**
- Top navbar with BarNode logo (left), navigation links (center/right)
- Height: h-16, background: Crema, subtle shadow
- Mobile: Hamburger menu transforming to full-screen overlay

**Buttons:**
- Primary: Verde background, white text, rounded-lg, px-6 py-3, font-weight 600
- Secondary: Menta background, Verde text, same padding/radius
- Outline: border-2 border-Verde, Verde text, hover fills with Verde
- Text: No background, Verde text, underline on hover

**Cards:**
- Background: White on Crema, Crema on Verde sections
- Border: 1px solid Verde Light or none with shadow-md
- Radius: rounded-xl
- Padding: p-6

**Forms:**
- Input fields: border-2 border-Verde Light, rounded-lg, px-4 py-3
- Focus state: border-Verde, outline-none, ring-2 ring-Verde/20
- Labels: text-sm font-semibold text-Verde, mb-2
- Placeholder: text-Neutral Gray

**HomePage Structure:**
- Hero section: py-16 md:py-24, centered content, max-w-4xl
- Logo: Display at top of hero, size: h-16 md:h-20
- Title "BarNode": Headline Large, text-Verde, mb-4
- Subtitle: Body Large, text-Neutral Gray, max-w-2xl, mb-8
- CTA "Inizia": Primary button, prominent placement

**Data Display:**
- Lists: divide-y divide-Verde Light
- Tables: Clean borders, alternating row backgrounds (Crema/White)
- Stats: Large numbers in Verde, labels in Gray

**Overlays:**
- Modals: White background, rounded-2xl, shadow-2xl, max-w-lg
- Toasts: Fixed bottom-right, Verde/Menta backgrounds, slide-in animation

### E. Visual Enhancements

**Shadows:**
- Subtle: shadow-sm (cards at rest)
- Medium: shadow-md (interactive elements)
- Large: shadow-xl (modals, dropdowns)

**Transitions:**
- Duration: 200ms for micro-interactions, 300ms for larger movements
- Easing: ease-in-out
- Apply to: colors, transforms, shadows only

**Borders & Dividers:**
- Standard: 1px solid Verde Light
- Emphasis: 2px solid Verde
- Radius: rounded-lg (8px) standard, rounded-xl (12px) for cards

## Images

**Logo Placement:**
- Location: Top of HomePage hero section, navbar left side
- Size: h-16 (64px) on mobile, h-20 (80px) on desktop
- Format: PNG with transparency
- Alternative: If logo unavailable, use stylized "BN" monogram in Verde

**Hero Image:** No large hero image for initial version - focus on clean typography and color blocks. Future iterations may include subtle background patterns or illustrations in Menta/Verde.

## Key Design Principles

1. **Clarity First:** Every element serves a purpose, no decorative clutter
2. **Natural Hierarchy:** Size, weight, and color guide user attention intentionally
3. **Breathing Room:** Generous whitespace using consistent spacing primitives
4. **Touch-Friendly:** Minimum 44px tap targets, adequate spacing between interactive elements
5. **Color Confidence:** Verde dominates as primary brand color, Menta provides refreshing contrast, Crema creates calm foundation