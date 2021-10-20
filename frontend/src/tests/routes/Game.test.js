import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { useParams } from 'react-router';
import { useUserContext } from '../../hooks/UserContext';
import Game from '../../routes/Game';

jest.mock('axios', () => ({
    get: (url) => ({
        data: {
            game: {
                name: "Sonic Colors: Ultimate",
                first_release_date: 1631030400,
                platforms: [
                    { name: "PS4" },
                    { name: "Nintendo Switch" }, 
                    { name: "Xbox Series S" }, 
                    { name: "PC" }
                ],
                involved_companies: [
                    {
                        company: {
                            name: "Sega"
                        }
                    },
                    {
                        company: {
                            name: "Blind Squirrel Entertainment"
                        }
                    }
                ],
                screenshots: [],
                summary: "This is a game developed by Sega."
            },
            lists: [
                "list 1"
            ]
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
        game_id: "12345"
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




test('should properly render game page', async () => {
    render(<Game />)
    expect(await screen.findByText("Description")).not.toBe(null)
    expect(await screen.findByText("Sep 07 2021")).not.toBe(null)
    expect(await screen.findByText("(PS4, Nintendo Switch, Xbox Series S, PC)")).not.toBe(null)
    expect(await screen.findByText("Publishers")).not.toBe(null)
    expect(await screen.findByText("This is a game developed by Sega.")).not.toBe(null)
    expect(await screen.findByText("Sega, Blind Squirrel Entertainment")).not.toBe(null)
    expect(await screen.findByText("Screenshots")).not.toBe(null)
    expect(await screen.findByText("Score")).not.toBe(null)
})
