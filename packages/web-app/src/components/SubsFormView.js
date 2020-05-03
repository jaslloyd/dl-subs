import React from "react";
import PropTypes from "prop-types";
import TeamDetailsContainer from "../containers/TeamDetailsContainer";

const SubsFormView = props => (
  <React.Fragment>
    <form onSubmit={props.handleSubmit} className="p-3">
      <div className="form-group">
        <label htmlFor="inputName">Player name</label>
        <input
          type="text"
          className="form-input"
          id="inputName"
          name="name"
          placeholder="Enter player name"
          value={props.name}
          onChange={props.handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="inputTeam">Player Team</label>
        <input
          type="text"
          className="form-input"
          autoComplete="off"
          id="inputTeam"
          name="team"
          placeholder="Enter players club e.g. D2"
          value={props.team}
          onChange={props.handleInputChange}
          required
        />
        <ul className="list-group">
          {props.autocomplete.map(team => (
            <li
              className="list-group-item"
              key={team}
              onClick={() => props.handleSelectedAutocomplete(team)}
            >
              {team}
            </li>
          ))}
        </ul>
      </div>
      <div className="form-group">
        <label htmlFor="inputPaid">Player Paid (€)</label>
        <div className="input-group">
          <input
            type="number"
            className="form-input"
            id="inputPaid"
            name="paid"
            placeholder="100"
            min="10"
            max="500"
            value={props.paid}
            onChange={props.handleInputChange}
            required
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary btn-block ">
        Add Subs
      </button>
    </form>

    {props.filteredHistory && (
      <React.Fragment>
        <h5>Last 10 Transactions:</h5>
        <TeamDetailsContainer
          dataToDisplay={props.filteredHistory}
          updateTeamData={props.getData}
          setEditMode={props.setEditMode}
          setDeleteMode={props.setDeleteMode}
        />
      </React.Fragment>
    )}
  </React.Fragment>
);

SubsFormView.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  showMessage: PropTypes.bool.isRequired,
  msgClass: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  team: PropTypes.string.isRequired,
  paid: PropTypes.number.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  filteredHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  getData: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
  setDeleteMode: PropTypes.func.isRequired
};
export default SubsFormView;
