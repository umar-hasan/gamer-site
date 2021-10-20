import { render, screen } from '@testing-library/react';
import { useUserContext } from '../../hooks/UserContext';
import { useParams, useHistory, useLocation } from 'react-router';
import axios from 'axios';
import SearchResults from '../../routes/SearchResults';
import Navbar from '../../components/Navbar';

jest.mock('react-router', () => ({
    useParams: () => ({
        list_id: "1"
    }),
    useHistory: () => ({
        push: jest.fn(),
        goBack: jest.fn()
    }),
    Link: () => jest.fn()
}))

jest.mock('../../hooks/UserContext', () => ({
    useUserContext: () => ({
        loggedIn: false,
        user: null
    })
}))

test('renders navbar', async () => {
    render(<Navbar/>)
    expect(await screen.findByText("Gmaes")).not.toBe(null)
    expect(await screen.findByText("Consoles")).not.toBe(null)
    expect(await screen.findByText("Login")).not.toBe(null)
})
