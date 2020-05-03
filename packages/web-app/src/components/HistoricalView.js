import React from 'react';
import TeamDetails from './TeamDetails';

const HistoricalView = props => (
  <React.Fragment>
    <h4>Last 20 Entries</h4>
    <form>
      <div className="form-group">
        <label htmlFor="inputName">Search</label>
        <input
          type="text"
          className="form-control form-border"
          id="inputName"
          name="search"
          placeholder="Player name or Club"
          onChange={props.onFilter}
        />
      </div>
    </form>
    <TeamDetails teamEntries={props.histEntries} />
  </React.Fragment>
);

export default HistoricalView;
