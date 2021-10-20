import { render, screen } from '@testing-library/react';
import axios from 'axios';
import Home from '../../routes/Home';

jest.mock('axios', () => ({
    data: {}
}))


test('should render properly', () => {
    render(<Home/>)
    const heading1 = screen.getByText("Newest Releases")
    const heading2 = screen.getByText("Recently Reviewed")
    const heading3 = screen.getByText("Coming Soon")

    expect(heading1).not.toBe(null)
    expect(heading2).not.toBe(null)
    expect(heading3).not.toBe(null)

})
