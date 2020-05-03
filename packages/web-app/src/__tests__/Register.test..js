import React from 'react';
import { render } from 'react-testing-library';
import Register from '../components/Register';

describe('Register', () => {
  it('Should render register', () => {
    const props = {};
    const { queryByText } = render(<Register {...props} />);
    expect(queryByText('Register').innerHTML).toBe('Register');
  });
});
