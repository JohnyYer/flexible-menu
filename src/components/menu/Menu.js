import React, { Component } from "react";
import "./Menu.css";
import { fetchMenu } from "../../resources";

class Menu extends Component {
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
    const { items, isFetching } = this.state;
    return (
      <div className="menu">
        {isFetching ? <div className="menu-is-fetching">Loading...</div> : null}
        {items.map(({ name, id } = {}) => {
          return (
            <div key={id} className="menu-item">
              <span className="menu-item-name" title={name}>
                {name}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Menu;
