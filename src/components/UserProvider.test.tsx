import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { UserProvider, useUser } from './UserProvider';

function TestComponent() {
  const { user, isLoading, isAdmin } = useUser();

  if (isLoading) {
    return <div data-testid="loading">Loading...</div>;
  }

  return (
    <div>
      <div data-testid="user-id">{user ? user.id : 'null'}</div>
      <div data-testid="user-name">{user ? user.name : 'null'}</div>
      <div data-testid="user-role">{user ? user.role : 'null'}</div>
      <div data-testid="is-admin">{isAdmin ? 'true' : 'false'}</div>
    </div>
  );
}

describe('UserProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('simulates auth flow with loading state and eventual user state', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Initially, it should show the loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Fast-forward timers to simulate async auth flow
    // Need to wrap in act since advancing timers causes state update (setIsLoading)
    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.getByTestId('user-name').textContent).toBe('Alex');
    expect(screen.getByTestId('user-role').textContent).toBe('user');
    expect(screen.getByTestId('user-id').textContent).toBe('1');
    expect(screen.getByTestId('is-admin').textContent).toBe('false');
  });

  test('throws error when useUser is used outside UserProvider', () => {
    function ComponentWithoutProvider() {
      useUser();
      return null;
    }

    expect(() => render(<ComponentWithoutProvider />)).toThrow('useUser must be used within a UserProvider');
  });
});
