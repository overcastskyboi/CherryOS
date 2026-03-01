# CherryOS Visual & Documentation Improvement Plan

This document outlines proposed UI/UX enhancements and documentation updates to elevate the CherryOS desktop experience to a modern, pixel-perfect, and cohesive aesthetic.

## 1. Global & Core Systems

### High Priority
- **Theme Unification**: [IMPLEMENTED] Transition from scattered color palettes to a core "Cherry" brand identity.
- **Dynamic Backgrounds**: [IMPLEMENTED] Enhance `RainBackground` to react to the current app's theme color.
- **Glassmorphism Refinement**: [IMPLEMENTED] Standardize `glass-card` and `glass-header` with consistent effects.

### Medium Priority
- **Custom Cursor**: [IMPLEMENTED] Implement a hardware-accelerated "Cyber-Pointer" that reacts to interactive elements.
- **Global Typography**: [IMPLEMENTED] Ensure `Inter` is properly weighted; use `tabular-nums` for data.
- **Interactive Feedback**: [IMPLEMENTED] Add a subtle "click ripple" and "button depress" effect to all primary glass buttons.

---

## 2. Components

### High Priority
- **Desktop Grid**: [IMPLEMENTED] Improve responsive behavior for the app grid.
- **Boot & Lock Screens**: [IMPLEMENTED] Redesign for integrated OS feel.

### Medium Priority
- **Staggered Entry Animations**: [IMPLEMENTED] Use staggered motion for gallery items (Pokedex, Game Center, Activity Log) to create a premium "loading" feel.
- **LazyImage Transitions**: [IMPLEMENTED] Standardized scale-up and fade-in.
- **PixelIcons Stroke Weight**: [IMPLEMENTED] Audit `PixelIcons` to match Lucide stroke weights (1.5 - 2.0).

---

## 3. Application Specifics

### My Music
- **Visualizer**: Add a subtle CSS-based frequency visualizer in the player bar.
- **Album Art Glow**: [IMPLEMENTED] Apply dynamic colored glow to playing art.

### Game Center
- **Neural Mastery Bars**: [IMPLEMENTED] Enhanced progress bars with dual-color gradients.
- **Hover States**: [IMPLEMENTED] Added holographic overlay effects.

---

## 4. Documentation (High Priority)

- **GEMINI.md Update**: [IMPLEMENTED]
    - Sync application list with reality (remove CodeFlow/Scratchpad).
    - Update versioning to v2.5.1.
    - Document new `time_utils.js` logic and dynamic `themeColor` system.
- **README.md Update**: [IMPLEMENTED]
    - Update versioning to v2.5.1.
    - Refresh application descriptions to match current "Cyber-Glass" naming and features.
    - Update "Cloud Strategy" section if needed.

---

## 5. Responsive & Accessibility

- **Safe Areas**: [IMPLEMENTED] Ensured padding for mobile notches.
- **Contrast Audit**: [IMPLEMENTED] Verified text legibility on glass backgrounds.
- **Focus States**: Add high-visibility cyan/pink focus rings for keyboard navigation.
