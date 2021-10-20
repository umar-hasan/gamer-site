import { render, screen } from '@testing-library/react';
import { useParams, useHistory, useLocation } from 'react-router';
import axios from 'axios';
import SearchResults from '../../routes/SearchResults';

jest.mock('axios', () => ({
    get: (url) => ({
        data: {
            consoles: [
                {
                    name: "Nintendo Switch",
                    slug: "switch",
                    versions: [
                        {
                            platform_logo: {
                                image_id: "12345"
                            }
                        }
                    ]
                }
            ],
            games: [
                {
                    id: 1,
                    name: "Game 1",
                    cover: {
                        image_id: 1
                    },
                    first_release_date: 1631030400
                }
            ]
        }

    })
}))

jest.mock('react-router', () => ({
    useParams: () => ({
        list_id: "1"
    }),
    useHistory: () => ({
        push: jest.fn(),
        goBack: jest.fn()
    }),
    useLocation: () => ({
        search: jest.fn()
    })
}))

test('renders search results', async () => {
    render(<SearchResults />)
    expect(await screen.findByText("Games")).not.toBe(null)
})
