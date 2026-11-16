import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Knot Spot home page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Knot Spot/i })).toBeInTheDocument();
});
