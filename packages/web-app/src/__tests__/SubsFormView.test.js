import React from 'react';
import { render } from 'react-testing-library';
import SubsFormView from '../components/SubsFormView';

const createProps = props => ({
  autocomplete: [],
  filteredHistory: [],
  showMessage: false,
  msgClass: '',
  msg: '',
  name: 'Jason',
  team: 'D2',
  paid: 100,
  handleSubmit: jest.fn(),
  handleInputChange: jest.fn(),
  getData: jest.fn(),
  setEditMode: jest.fn(),
  setDeleteMode: jest.fn(),
  ...props,
});
describe('SubsFormView', () => {
  it('renders sub form', () => {
    const props = createProps();
    const { queryByText } = render(<SubsFormView {...props} />);
    expect(queryByText('Player name').innerHTML).toBe('Player name');
  });
});
