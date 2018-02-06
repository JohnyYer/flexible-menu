import React, { Component } from "react";
import "./Menu.css";
import { fetchMenu } from "../../resources";
import SubMenu from "../sub-menu";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItemId: null,
      activeItemElement: null,
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

  onMenuItemClick(e, activeItemId) {
    this.setState({ activeItemId, activeItemElement: e.target });
  }

  render() {
    const { items, isFetching, activeItemId, activeItemElement } = this.state;
    const { subItems } = items.find(({ id } = {}) => id === activeItemId) || {};

    return (
      <div className="menu">
        {isFetching ? <div className="menu-is-fetching">Loading...</div> : null}
        {items.map(({ name, id } = {}) => {
          return (
            <div key={id} className="menu-item">
              <span className="menu-item-name" title={name} onClick={e => this.onMenuItemClick(e, id)}>
                {name}
              </span>
            </div>
          );
        })}
        <SubMenu {...{ items: subItems, element: activeItemElement }} />
      </div>
    );
  }
}

SubMenu.displayName = "Menu";
export default Menu;
