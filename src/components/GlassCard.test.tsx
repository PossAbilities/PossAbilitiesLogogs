import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlassCard } from './GlassCard';
import React from 'react';

describe('GlassCard Component', () => {
  it('renders children correctly', () => {
    render(<GlassCard>Test Content</GlassCard>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(<GlassCard>Content</GlassCard>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('glass-card', 'p-6', 'md:p-8');
  });

  it('merges custom classes correctly', () => {
    const { container } = render(<GlassCard className="custom-class p-4">Content</GlassCard>);
    const element = container.firstChild as HTMLElement;
    // tailwind-merge should replace p-6 with p-4
    expect(element).toHaveClass('glass-card', 'md:p-8', 'custom-class', 'p-4');
    expect(element).not.toHaveClass('p-6');
  });

  it('renders as a different HTML element', () => {
    const { container } = render(<GlassCard as="section">Content</GlassCard>);
    const element = container.firstChild as HTMLElement;
    expect(element.tagName).toBe('SECTION');
  });

  it('passes through additional HTML attributes', () => {
    const { container } = render(<GlassCard id="test-id" data-testid="test-card">Content</GlassCard>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute('id', 'test-id');
    expect(screen.getByTestId('test-card')).toBeInTheDocument();
  });
});
