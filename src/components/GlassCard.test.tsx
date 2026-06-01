import { render, screen } from '@testing-library/react';
import { GlassCard } from './GlassCard';

describe('GlassCard Component', () => {
  it('renders children correctly', () => {
    render(<GlassCard>Hello World</GlassCard>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(<GlassCard>Content</GlassCard>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('glass-card', 'p-6', 'md:p-8');
  });

  it('appends additional custom classes', () => {
    const { container } = render(<GlassCard className="my-custom-class">Content</GlassCard>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('glass-card', 'my-custom-class');
  });

  it('overrides default tailwind classes using tailwind-merge', () => {
    // p-4 should override p-6
    const { container } = render(<GlassCard className="p-4 md:p-2">Content</GlassCard>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('p-4', 'md:p-2');
    expect(element).not.toHaveClass('p-6');
    expect(element).not.toHaveClass('md:p-8');
  });

  it('renders as a custom element using the "as" prop', () => {
    const { container } = render(<GlassCard as="section">Content</GlassCard>);
    const element = container.firstChild as HTMLElement;
    expect(element.tagName).toBe('SECTION');
  });

  it('passes additional HTML attributes to the element', () => {
    render(
      <GlassCard id="my-glass-card" data-testid="glass-card" aria-label="A glass card">
        Content
      </GlassCard>
    );
    const element = screen.getByTestId('glass-card');
    expect(element).toHaveAttribute('id', 'my-glass-card');
    expect(element).toHaveAttribute('aria-label', 'A glass card');
  });
});
