import { shallow, configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router';
import { useUserContext } from '../../hooks/UserContext';
import List from '../../routes/List';

configure({ adapter: new Adapter() });

jest.mock('axios', () => ({
    get: (url) => ({
        data: {
            list: {
                id: 1,
                name: "List 1",
                description: "Test description."
            }
        }

    }),
    interceptors: {
        response: {
            use: jest.fn()
        }
    }
}))


jest.mock('react-router', () => ({
    useParams: () => ({
        list_id: "1"
    }),
    useHistory: () => ({
        push: jest.fn(),
        goBack: jest.fn()
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

test('renders a single list page', async () => {
    render(<List/>)
    expect(await screen.findByText("List 1")).not.toBe(null)
    expect(await screen.findByText("Test description.")).not.toBe(null)
})
