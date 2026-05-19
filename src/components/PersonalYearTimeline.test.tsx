import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PersonalYearTimeline } from './PersonalYearTimeline';

describe('PersonalYearTimeline', () => {
  it('renders the section heading', () => {
    render(<PersonalYearTimeline birthDay={30} birthMonth={8} birthYear={1979} />);
    expect(screen.getByText(/Personal Year cycle/i)).toBeInTheDocument();
  });

  it('renders 11 year rows by default (5 back + current + 5 ahead)', () => {
    const { container } = render(
      <PersonalYearTimeline birthDay={30} birthMonth={8} birthYear={1979} />
    );
    // Count row containers (each year is a motion.div with the year text inside)
    const yearRows = container.querySelectorAll('div.flex.items-center.gap-3');
    expect(yearRows.length).toBe(11);
  });

  it('marks exactly one row as current (border-2)', () => {
    const { container } = render(
      <PersonalYearTimeline birthDay={30} birthMonth={8} birthYear={1979} />
    );
    // The current year has a border-2 highlight; other rows use border (1).
    const current = container.querySelectorAll('.border-2.border-indigo-500');
    expect(current.length).toBe(1);
  });
});
