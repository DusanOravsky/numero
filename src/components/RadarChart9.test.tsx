import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RadarChart9 } from './RadarChart9';

describe('RadarChart9', () => {
  it('renders all 9 axis labels', () => {
    render(<RadarChart9 counts={{ 1: 1, 3: 2, 7: 1, 8: 2, 9: 2 }} />);
    // Axis labels 1..9 appear at outer ring
    for (let n = 1; n <= 9; n++) {
      // each digit appears at least once (in legend grid + on axis)
      const matches = screen.getAllByText(String(n));
      expect(matches.length).toBeGreaterThan(0);
    }
  });

  it('renders the configurable title', () => {
    render(
      <RadarChart9
        counts={{}}
        title="Test radar"
        subtitle="Some subtitle"
      />
    );
    expect(screen.getByText('Test radar')).toBeInTheDocument();
    expect(screen.getByText('Some subtitle')).toBeInTheDocument();
  });

  it('shows ×count for each number in the legend', () => {
    render(<RadarChart9 counts={{ 3: 5 }} />);
    expect(screen.getByText('×5')).toBeInTheDocument();
  });

  it('accepts both Map and Record inputs', () => {
    const map = new Map<number, number>([[1, 3]]);
    render(<RadarChart9 counts={map} title="map version" />);
    expect(screen.getByText('×3')).toBeInTheDocument();
  });
});
