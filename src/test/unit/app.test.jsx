import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../../App';

// Mock lucide-react to avoid issues with icon rendering in tests
vi.mock('lucide-react', () => ({
  Terminal: () => <div data-testid="icon-terminal" />,
  Activity: () => <div data-testid="icon-activity" />,
  User: () => <div data-testid="icon-user" />,
  Disc: () => <div data-testid="icon-disc" />,
  LayoutGrid: () => <div data-testid="icon-layoutgrid" />,
  X: () => <div data-testid="icon-x" />,
  Minus: () => <div data-testid="icon-minus" />,
  Battery: () => <div data-testid="icon-battery" />,
  Wifi: () => <div data-testid="icon-wifi" />,
  Search: () => <div data-testid="icon-search" />,
  Sliders: () => <div data-testid="icon-sliders" />,
  Power: () => <div data-testid="icon-power" />,
  Gamepad2: () => <div data-testid="icon-gamepad2" />,
  Tv: () => <div data-testid="icon-tv" />,
  Headphones: () => <div data-testid="icon-headphones" />,
  Play: () => <div data-testid="icon-play" />,
  Pause: () => <div data-testid="icon-pause" />,
  SkipForward: () => <div data-testid="icon-skipforward" />,
  Star: () => <div data-testid="icon-star" />,
  BookOpen: () => <div data-testid="icon-bookopen" />,
  Clapperboard: () => <div data-testid="icon-clapperboard" />,
}));

describe('App Component', () => {
  it('renders boot screen initially', () => {
    render(<App />);
    expect(screen.getByText(/BOOT_LOADER/i)).toBeInTheDocument();
  });
});
