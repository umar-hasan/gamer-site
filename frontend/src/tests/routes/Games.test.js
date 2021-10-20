import { render, screen } from '@testing-library/react';
import axios from 'axios';
import Games from '../../routes/Games';

jest.mock('axios', () => ({
    get: (url) => ({
        data: {
            info:
                [
                    {
                        name: "game 1",
                        versions: [{
                            platform_logo: {
                                image_id: ""
                            },
                            platform_version_release_dates: [
                                {
                                    date: 12345678
                                }
                            ],
                            summary: "",
                            company: "N/A"
                        }]
                    }, "game 2", "game 3"
                ]
        }

    })
}))

test('renders new releases', async () => {
    render(<Games type={"new-releases"} />)
    const releases = await screen.findByText("Newest Releases")

    expect(releases).not.toBe(null)
})

test('renders top rated', async () => {
    render(<Games type={"top-rated"} />)
    const top = await screen.findByText("Top Rated")

    expect(top).not.toBe(null)
})

test('renders upcoming page', async () => {
    render(<Games type={"upcoming"} />)
    const upcoming = await screen.findByText("Coming Soon")

    expect(upcoming).not.toBe(null)
})
