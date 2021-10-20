import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { useUserContext } from '../../hooks/UserContext';
import Register  from '../../routes/Register'


jest.mock('../../hooks/UserContext', () => ({
    
    useUserContext: () => ({
        
        loggedIn: false,
        user: null
    })
}))

test('renders registration page', async () => {
    render(<Register/>)
    expect(await screen.findByLabelText("Username")).not.toBe(null)
    expect(await screen.findByLabelText("Password")).not.toBe(null)
    expect(await screen.findByLabelText("First Name")).not.toBe(null)
    expect(await screen.findByLabelText("Last Name")).not.toBe(null)
    expect(await screen.findByLabelText("Confirm Password")).not.toBe(null)
})
