import React, { Component } from 'react';
import TeamDetails from '../components/TeamDetails';
import networkHelper from '../services/network-helper';

export default class TeamDetailsContainer extends Component {
  state = {};

  editEntry = (id, index) => {
    console.log('Edit Edit...');
    console.log(index);
    this.props.setEditMode(id, index);
  };

  deleteEntry = (id, index) => {
    console.log('Delete Confirm Displayed now...');
    this.props.setDeleteMode(id, index);
  };

  confirmDeleteEntry = async (team, id) => {
    console.log('Delete Delete');
    console.log({ team, id });
    const response = await networkHelper.fetchHelper(`${process.env.REACT_APP_BACKEND_URI}/api/entry/${id}`, {
      method: 'DELETE',
    });
    console.log(response);
    this.props.updateTeamData(team);
  };

  render() {
    return (
      <TeamDetails
        teamEntries={this.props.dataToDisplay}
        onEdit={this.editEntry}
        onDelete={this.deleteEntry}
        onDeleteConfirmed={this.confirmDeleteEntry}
      />
    );
  }
}
