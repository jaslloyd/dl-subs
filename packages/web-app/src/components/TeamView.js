import React from 'react';
import TeamDetailsContainer from '../containers/TeamDetailsContainer';
import networkHelper from '../services/network-helper';

export default class TeamView extends React.Component {
  state = {
    teams: ['D1', 'D2', 'D3'],
    dataToDisplay: [],
  };

  async componentDidMount() {
    const allEntries = await networkHelper.fetchHelper(`${process.env.REACT_APP_BACKEND_URI}/api/entry`);
    const teamsSorted = allEntries.map(entry => entry.team).sort((a, b) => (a < b ? -1 : 1));
    const uniqueTeams = [...new Set(teamsSorted)];
    this.setState({ teams: uniqueTeams });
  }

  getTeamData = async team => {
    // todo: change to team only api
    const teamData = await networkHelper.fetchHelper(
      `${process.env.REACT_APP_BACKEND_URI}/api/summed/entry/team/${team}`
    );
    this.setState({ dataToDisplay: teamData });
  };

  setEditMode = (id, index) => {
    console.log(`Editing ${id}`);
    // const existingEntries = this.state.dataToDisplay;
    // // const entryToEditEntryIndex = existingEntries.findIndex(entry => entry.id === id);
    // existingEntries[index].isEditMode = true;

    // this.setState({
    //   dataToDisplay: existingEntries,
    // });
  };

  setDeleteMode = (id, index) => {
    const existingEntries = this.state.dataToDisplay;
    console.log(existingEntries[index]);
    existingEntries[index].isDeleteMode = !existingEntries[index].isDeleteMode;

    console.log(existingEntries[index]);
    this.setState({
      dataToDisplay: existingEntries,
    });
  };

  render() {
    return (
      <div className="container2 mt-3">
        <div className="row">
          <div className="col-12">
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
              {this.state.teams.map(team => (
                <a
                  className="nav-link"
                  id={`v-pills-${team}-tab`}
                  data-toggle="pill"
                  href="#v-pills-main"
                  role="tab"
                  aria-controls="v-pills-main"
                  aria-selected="true"
                  key={team}
                  onClick={() => this.getTeamData(team)}
                >
                  {team}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="tab-content" id="v-pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="v-pills-main"
                role="tabpanel"
                aria-labelledby="v-pills-main-tab"
              >
                {this.state.dataToDisplay.length > 0 ? (
                  <TeamDetailsContainer
                    dataToDisplay={this.state.dataToDisplay}
                    updateTeamData={this.getTeamData}
                    setEditMode={this.setEditMode}
                    setDeleteMode={this.setDeleteMode}
                  />
                ) : (
                  <h3 className="text-center">Please Select a Team</h3>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
