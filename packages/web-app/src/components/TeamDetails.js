import React from "react";

const getEuropeanDate = () => {
  const d = new Date();
  return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
};

const renderReadTableRow = (props, entry, index) => (
  <tr className="TeamEntry" data-testid="team-entry">
    <th scope="row">{getEuropeanDate()}</th>
    <td>
      {entry.isEditMode ? (
        <h1>Edit!!</h1>
      ) : (
        <a
          href={entry.payment_reference}
          target="_blank"
          rel="noopener noreferrer"
        >
          {entry.name}
        </a>
      )}
    </td>
    <td>{entry.team}</td>
    <td>
      {process.env.REACT_APP_TEAM_CURRENCY_SYMBOL}
      {entry.paid}
    </td>
    <td>
      <button
        onClick={() => props.onEdit(entry.id, index)}
        className="btn btn-sm btn-info edit-button"
      >
        ✎
      </button>
    </td>
    <td>
      <button
        onClick={() => props.onDelete(entry.id, index)}
        className="btn btn-sm btn-danger delete-button"
      >
        X
      </button>
    </td>
  </tr>
);

const renderEditTableRow = (props, entry, index) => (
  <tr className="TeamEntry">
    <th scope="row">
      {new Date(entry.timestamp).toLocaleString().slice(0, 10)}
    </th>
    <td>
      <input value={entry.name} onChange={() => console.log("changing...")} />
    </td>
    <td>{entry.team}</td>
    <td>
      {process.env.REACT_APP_TEAM_CURRENCY_SYMBOL}
      {entry.paid}
    </td>
    <td>
      {/* <button onClick={() => props.onEdit(entry.id, index)} className="btn btn-sm btn-info edit-button">
        ✎
      </button> */}
      <button className="btn btn-sm btn-success">Save</button>
    </td>
    <td>
      <button
        onClick={() => props.onDelete(entry.team, entry.id)}
        className="btn btn-sm btn-danger delete-button"
      >
        X
      </button>
    </td>
  </tr>
);

const renderDeleteTableRow = (props, entry, index) => (
  <tr className="TeamEntry">
    <th className="text-center" colSpan="6">
      Confirm delete?
      <button
        onClick={() => props.onDeleteConfirmed(entry.team, entry.id)}
        className="btn btn-sm btn-success ml-2 mr-2"
      >
        Confirm
      </button>
      <button
        onClick={() => props.onDelete(entry.id, index)}
        className="btn btn-sm btn-info"
      >
        Cancel
      </button>
    </th>
  </tr>
);

export default props => (
  <table className="table table-hover table-sm" data-testid="team-entries">
    <thead className="thead-custom">
      <tr>
        <th scope="col">Time</th>
        <th scope="col">Name</th>
        <th scope="col">Team</th>
        <th scope="col">Paid</th>
        <th scope="col">Edit</th>
        <th scope="col">Delete</th>
      </tr>
    </thead>
    <tbody>
      {props.teamEntries.map((entry, index) => (
        <React.Fragment key={index}>
          {entry.isEditMode && renderEditTableRow(props, entry, index)}
          {entry.isDeleteMode && renderDeleteTableRow(props, entry, index)}
          {!entry.isEditMode &&
            !entry.isDeleteMode &&
            renderReadTableRow(props, entry, index)}
        </React.Fragment>
      ))}
    </tbody>
  </table>
);
