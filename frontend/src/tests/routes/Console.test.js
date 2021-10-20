import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { useParams } from 'react-router';
import { useUserContext } from '../../hooks/UserContext';
import Console from '../../routes/Console';

jest.mock('axios', () => ({
    get: (url) => ({
        data: {
            console_data: {
                name: "Windows (PC)"
            },
            latestReleases: [],
            latestRated: [],
            comingSoon: []
        }

    }),
    interceptors: {
        response: {
            use: jest.fn()
        }
    }
}))


jest.mock('react-router-dom', () => ({
    useParams: () => ({
        console_slug: "pc"
    })
}))

jest.mock('../../hooks/UserContext', () => ({
    useUserContext: () => ({
        loggedIn: true,
        user: {
            id: 1,
            username: "user"
        }
    })
}))

test('renders console page', async () => {
    render(<Console/>)

    expect(await screen.findByText("Latest Releases")).not.toBe(null)
    expect(await screen.findByText("Recently Reviewed")).not.toBe(null)
    expect(await screen.findByText("Coming Soon")).not.toBe(null)
})
