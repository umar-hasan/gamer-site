import { render, screen } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react';
import { useUserContext } from '../hooks/UserContext';
import App from '../App'


jest.mock('../hooks/UserContext', () => ({
  useUserContext: () => ({
      loggedIn: true,
      user: {
          id: 1,
          username: "user"
      }
  })
}))


test('renders main React app', () => {
  render(<App />);
});
