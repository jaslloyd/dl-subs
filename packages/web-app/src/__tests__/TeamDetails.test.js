import React from 'react';
import { render, Simulate } from 'react-testing-library';
import TeamDetails from '../components/TeamDetails';

const createProps = props => ({
  teamEntries: [
    {
      id: '1234',
      timestamp: 'Mon, 21 May 2018 16:59:36 GMT',
      name: 'Jason',
      team: 'D2',
      paid: '€100',
    },
  ],
  deleteEntry: jest.fn(),
  editEntry: jest.fn(),
  handleFilter: jest.fn(),
  ...props,
});
describe('TeamDetails', () => {
  it('renders historical view', () => {
    const props = createProps();
    const { queryByTestId } = render(<TeamDetails {...props} />);
    expect(queryByTestId('team-entries')).not.toBeNull();
  });

  it('renders list of team details entries', () => {
    const props = createProps();
    const { container } = render(<TeamDetails {...props} />);
    const entries = container.getElementsByTagName('tr');
    // -1 to exclude the title tr
    expect(entries.length - 1).toBe(props.teamEntries.length);
  });

  it('renders first entry in team details', () => {
    const props = createProps();
    const { queryByText } = render(<TeamDetails {...props} />);
    const name = queryByText(props.teamEntries[0].name);
    const team = queryByText(props.teamEntries[0].team);
    expect(name.innerHTML).toBe(props.teamEntries[0].name);
    expect(team.innerHTML).toBe(props.teamEntries[0].team);
  });

  it('allows users to to delete an entry', () => {
    const props = createProps();
    const { container } = render(<TeamDetails {...props} onDelete={props.deleteEntry} />);

    const deleteButton = container.querySelector('.delete-button');
    Simulate.click(deleteButton);

    expect(props.deleteEntry).toHaveBeenCalledTimes(1);
    expect(props.deleteEntry).toHaveBeenCalledWith(props.teamEntries[0].id, 0);
  });

  it('allows users to edit an entry', () => {
    const props = createProps();
    const { container } = render(<TeamDetails {...props} onDelete={props.deleteEntry} onEdit={props.editEntry} />);

    const editButton = container.querySelector('.edit-button');
    Simulate.click(editButton);
    expect(props.editEntry).toHaveBeenCalledTimes(1);
    expect(props.editEntry).toHaveBeenCalledWith(props.teamEntries[0].id, 0);
  });
});
