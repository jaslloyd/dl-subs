import React, { Component } from "react";
import SubsFormView from "../components/SubsFormView";
import networkHelper from "../services/network-helper";
import authHelper from "../services/auth-helper";

// const SubsFormContainerHooks = props => {
//   const [formData, setFormData] = useState({
//     name: "",
//     team: "",
//     paid: null
//   });

//   const [alertMsg, setAlertMsg] = useState({
//     msg: "",
//     msgClass: ""
//   });

//   const [history, setHistoryState] = useState({
//     history: [],
//     filteredHistory: []
//   });

//   const onSubmit = async e => {
//     e.preventDefault();

//     const { name, team, paid } = formData;

//     const json = await networkHelper.fetchHelper(
//       `${process.env.REACT_APP_BACKEND_URI}/api/entry`,
//       {
//         method: "POST",
//         body: JSON.stringify({
//           name,
//           team,
//           paid
//         })
//       }
//     );

//     setAlertMsg({
//       msg: `${json.message}`,
//       msgClass: "alert-success"
//     });

//     setInterval(() => {
//       setAlertMsg({
//         msg: ""
//       });
//     }, 2500);

//     getData();
//   };

//   const getData = async () => {
//     try {
//       const resultsJson = await networkHelper.fetchHelper(
//         `${process.env.REACT_APP_BACKEND_URI}/api/entry`
//       );
//       setHistoryState({
//         history: resultsJson.slice(0, 10),
//         filteredHistory: resultsJson.slice(0, 10)
//       });
//     } catch (err) {
//       console.log(err);
//       authHelper.signout();
//       props.history.push("/");
//     }
//   };

//   const setDeleteMode = (id, index) => {
//     const existingEntries = this.state.filteredHistory;
//     existingEntries[index].isDeleteMode = !existingEntries[index].isDeleteMode;
//     setHistoryState({
//       filteredHistory: existingEntries
//     });
//   };

//   return (
//     <React.Fragment>
//       {alertMsg.msg && (
//         <div className={`alert ${alertMsg.msgClass}`} role="alert">
//           {alertMsg.msg}
//         </div>
//       )}
//       <SubsFormView
//         {...this.state}
//         handleSubmit={onSubmit}
//         handleInputChange={handleInputChange}
//         handleSelectedAutocomplete={this.handleSelectedAutocomplete}
//         getData={getData}
//         setEditMode={this.setEditMode}
//         setDeleteMode={setDeleteMode}
//       />
//     </React.Fragment>
//   );
// };

export default class SubsFormContainer extends Component {
  state = {
    name: "",
    team: "",
    paid: null,
    teams: ["National League", "D1", "D2", "D3", "D4", "U18", "U16", "U14"],
    autocomplete: [],
    msg: "",
    showMessage: false,
    msgClass: "",
    history: [],
    filteredHistory: []
  };

  componentDidMount() {
    this.getData();
  }

  onSubmit = async e => {
    e.preventDefault();

    const { name, team, paid } = this.state;

    const newEntry = {
      name,
      team,
      paid
    };

    const json = await networkHelper.fetchHelper(
      `${process.env.REACT_APP_BACKEND_URI}/api/entry`,
      {
        method: "POST",
        body: JSON.stringify(newEntry)
      }
    );

    this.setState({
      msg: `${json.message}`,
      showMessage: true,
      msgClass: "alert-success"
    });

    setInterval(() => {
      this.setState({ showMessage: false });
    }, 2500);

    this.getData();
  };

  setEditMode = (id, index) => {
    console.log(`Editing ${id}`);
    // const existingEntries = this.state.filteredHistory;
    // existingEntries[index].isEditMode = true;

    // this.setState({
    //   filteredHistory: existingEntries,
    // });
  };

  getData = async () => {
    try {
      const resultsJson = await networkHelper.fetchHelper(
        `${process.env.REACT_APP_BACKEND_URI}/api/entry`
      );
      this.setState({
        history: resultsJson.slice(0, 10),
        filteredHistory: resultsJson.slice(0, 10)
      });
    } catch (err) {
      console.log(err);
      authHelper.signout();
      this.props.history.push("/");
    }
  };

  setDeleteMode = (id, index) => {
    const existingEntries = this.state.filteredHistory;
    existingEntries[index].isDeleteMode = !existingEntries[index].isDeleteMode;
    this.setState({
      filteredHistory: existingEntries
    });
  };

  handleError = err => {
    // todo: handle errors later...
    console.log(err);
  };

  deleteEntry = id => {
    // this.setState({
    //     history: this.state.history.filter(his => his.id !== id)
    // })
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => {
      if (name === "team") {
        this.filterAutocomplete();
      }
    });
  };

  filterAutocomplete = () => {
    this.setState({
      autocomplete: this.state.teams.filter(team =>
        team.toLowerCase().includes(this.state.team.toLowerCase())
      )
    });
  };

  handleSelectedAutocomplete = name => {
    this.setState({ team: name, autocomplete: [] });
  };

  handleFilter = e => {
    const { value } = e.target;
    const formattedValue = value.toLowerCase();
    this.setState({
      filteredHistory: this.state.history.filter(
        his =>
          his.name.toLowerCase().includes(formattedValue) ||
          his.team.toLowerCase().includes(formattedValue)
      )
    });
  };
  render() {
    return (
      <React.Fragment>
        {this.state.msg && (
          <div className={`alert ${this.state.msgClass}`} role="alert">
            {this.state.msg}
          </div>
        )}
        <SubsFormView
          {...this.state}
          handleSubmit={this.onSubmit}
          handleInputChange={this.handleInputChange}
          handleSelectedAutocomplete={this.handleSelectedAutocomplete}
          getData={this.getData}
          setEditMode={this.setEditMode}
          setDeleteMode={this.setDeleteMode}
        />
      </React.Fragment>
    );
  }
}
