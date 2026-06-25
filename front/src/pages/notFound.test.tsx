import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './notFound';

describe('NotFound', () => {
  it('affiche le message 404', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: '404' })).toBeDefined();
    expect(screen.getByText('Cette page n\'existe pas.')).toBeDefined();
    expect(screen.getByRole('link', { name: 'Retour à l\'accueil' }).getAttribute('href')).toBe('/');
  });
});
