import React from 'react';

export default class TeamSection extends React.Component {
  state = { showDetails: false };

  handleShowHide = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  render() {
    return (
      <div>
        <h2 onClick={this.handleShowHide}>{this.props.team}</h2>
        <hr />
        {this.state.showDetails && (
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Name</th>
                <th scope="col">Team</th>
                <th scope="col">Paid</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {this.props.teamEntries.map(entry => (
                <tr key={entry.id} className="HistoricalEntry">
                  <th scope="row">{entry.timestamp}</th>
                  <td>{entry.name}</td>
                  <td>{entry.team}</td>
                  <td>
                    {process.env.REACT_APP_TEAM_CURRENCY_SYMBOL}
                    {entry.paid}
                  </td>
                  <td>
                    <button
                      onClick={() => this.props.handleEditEntry(entry.id)}
                      className="btn btn-sm btn-danger ml-1 edit-button"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => this.props.handleDeleteEntry(entry.id)}
                      className="btn btn-sm btn-info delete-button"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
