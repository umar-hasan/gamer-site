import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { useUserContext } from '../../hooks/UserContext';
import Login  from '../../routes/Login'


jest.mock('../../hooks/UserContext', () => ({
    
    useUserContext: () => ({
        
        loggedIn: false,
        user: null
    })
}))


test('renders login page', async () => {
    render(<Login />)
    expect(await screen.findByLabelText("Username")).not.toBe(null)
    expect(await screen.findByLabelText("Password")).not.toBe(null)

})
