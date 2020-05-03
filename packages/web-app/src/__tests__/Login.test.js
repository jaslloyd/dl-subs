import React from 'react';
import { render } from 'react-testing-library';
import Login from '../components/Login';

describe('Login', () => {
  it('Should render login', () => {
    const props = {
      location: {
        state: 'blah',
      },
    };
    const { queryByText } = render(<Login {...props} />);
    expect(queryByText('Login').innerHTML).toBe('Login');
  });
});
