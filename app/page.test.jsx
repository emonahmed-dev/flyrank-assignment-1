import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import Page from './page';

test('renders page without crashing', () => {
  render(<Page />);
  expect(true).toBe(true);
});