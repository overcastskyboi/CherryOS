# CherryOS Visual Improvement Plan

This document outlines proposed UI/UX enhancements to elevate the CherryOS desktop experience to a modern, pixel-perfect, and cohesive aesthetic.

## 1. Global & Core Systems

### High Priority
- **Theme Unification**: [IMPLEMENTED] Transition from scattered color palettes (`green-500` in Boot, `yellow-500` in Lock, `blue-950` in Desktop) to a core "Cherry" brand identity using a primary palette of Deep Crimson, Electric Pink, and Cyber Cyan.
- **Dynamic Backgrounds**: [IMPLEMENTED] Enhance `RainBackground` to react to the current app's theme color (e.g., red rain in Pokédex, emerald in Game Center).
- **Glassmorphism Refinement**: [IMPLEMENTED] Standardize `glass-card` and `glass-header` with consistent `backdrop-filter` (blur/saturate), border-widths, and `box-shadow` depth.

### Medium Priority
- **Custom Cursor**: Implement a custom hardware-accelerated pointer that changes state on hover/active.
- **Global Typography**: [IMPLEMENTED] Ensure `Inter` is properly weighted across all components; use `tabular-nums` for all stats and counters to prevent layout shift during updates.

---

## 2. Components

### High Priority
- **Desktop Grid**: [IMPLEMENTED] Improve responsive behavior for the app grid. On ultra-wide screens, use a more balanced layout; on mobile, ensure touch targets are optimal.
- **Boot & Lock Screens**: [IMPLEMENTED] Redesign the `BootScreen` and `LockScreen` to feel more like an integrated OS part rather than static pages. Add subtle glitch effects or scanning lines to the mascot image.

### Medium Priority
- **LazyImage Transitions**: Standardize the "pop-in" effect. Use a consistent scale-up and fade-in animation across all apps (Songs, Games, Pokedex).
- **PixelIcons**: Audit all `PixelIcon` usage to ensure they match the stroke weight of Lucide icons when used in the same context.

---

## 3. Application Specifics

### My Music (Pink/Yellow Theme)
- **Visualizer**: Add a subtle CSS-based frequency visualizer in the bottom player bar when music is playing.
- **Album Art Glow**: [IMPLEMENTED] Apply a dynamic colored drop-shadow to the currently playing album art that matches its primary color.

### Game Center (Emerald/Cyan Theme)
- **Neural Mastery Bars**: [IMPLEMENTED] Enhance the progress bars with a "pulse" animation when they reach 100%.
- **Hover States**: [IMPLEMENTED] Add a "holographic" overlay effect on game cards during hover.

### Pokédex (Red/Bio Theme)
- **Bio-Archive Aesthetics**: [IMPLEMENTED] Replace the flat red background with a bio-mechanical textured pattern or a scanline overlay.
- **Stat Bars**: Animate the "Neural Matrix" bars on entry with a staggered delay for a "loading" feel.

### OCI Console (Cyan Theme)
- **Chart Realism**: [IMPLEMENTED] Enhance Recharts with custom `dot` components that look like glowing nodes and smoother `monotone` curves.
- **Status Indicators**: [IMPLEMENTED] Improve the "Neural Sync" pulse to feel more organic.

### Studio Rack (Brutalist/Industrial Theme)
- **Consistency Check**: [IMPLEMENTED] This app uses a "box-shadow" based brutalist style which differs from the "glass-card" style. Align the borders and shadows to be more consistent with the rest of the OS while keeping the "hardware" feel.

---

## 4. Animations & Transitions

### High Priority
- **Page Transitions**: [IMPLEMENTED] Implement `framer-motion` or standard CSS view transitions for moving between the Desktop and Apps to eliminate "flash of black" or abrupt cuts. (Implemented via `RainBackground` persistence and CSS view-transition prep).
- **Interactive Feedback**: Add a global "click ripple" or "button depress" animation to all primary interactive elements.

### Medium Priority
- **Staggered Entry**: Use staggered animation for lists (DataGrid, Pokedex gallery, Game cards) so they don't all appear at once.
- **Layout Morphing**: If possible, animate the "expanding" of cards when opening details (e.g., in Studio Rack or Pokedex).

---

## 5. Responsive & Accessibility

- **Safe Areas**: Ensure padding accounts for mobile notches and home indicators.
- **Contrast Audit**: Verify that `gray-500` text on `black/40` backgrounds meets WCAG AA standards in all apps.
- **Focus States**: Add high-visibility focus rings for keyboard navigation to satisfy the "Desktop OS" feel.
