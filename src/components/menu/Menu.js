import React, { Component } from "react";
import "./Menu.css";
import { fetchMenu } from "../../resources";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      items: []
    };
  }

  async componentDidMount() {
    this.setState({ isFetching: true });
    try {
      this.setState({
        items: await fetchMenu()
      });
    } catch (error) {
      console.log("Error componentDidMount/fetchMenu : ", error);
    } finally {
      this.setState({ isFetching: false });
    }
  }

  render() {
    const { items } = this.state;
    return (
      <div className="menu">
        {items.map(({ name, id } = {}) => {
          return <div key={id} className="menu-item">{name}</div>;
        })}
      </div>
    );
  }
}

export default App;
