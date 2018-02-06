import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Sub-Menu.css";

const isElementInside = (startElement, rootElement) => {
  let parent = startElement.parentElement;
  if (!parent) {
    return false;
  }
  return parent === rootElement ? true : isElementInside(parent, rootElement);
};

const getPositionByElement = ({ element } = {}) => {
  const { top, height, left } = element.getBoundingClientRect();
  return { top: top + height, left };
};

class SubMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: null,
      top: null,
      right: null,
      bottom: null,
      items: null
    };
    this.removeItems = this.removeItems.bind(this);
    this.documentClick = this.documentClick.bind(this);
  }

  removeItems() {
    this.setState({ items: null });
  }

  documentClick(event) {
    const { element } = this.props;
    const { items } = this.state;

    if (!items) {
      return;
    }

    const insideMenuElement = isElementInside(event.target, ReactDOM.findDOMNode(this));
    const isClickOnMenuElement = event.target === element;

    if (!insideMenuElement && !isClickOnMenuElement) {
      this.removeItems();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.removeItems);
    window.removeEventListener("scroll", this.removeItems);
    window.removeEventListener("click", this.documentClick);
  }

  componentDidMount() {
    const { element, items } = this.props;
    window.addEventListener("resize", this.removeItems);
    window.addEventListener("scroll", this.removeItems);
    window.addEventListener("click", this.documentClick);

    if (element && items) {
      this.setState({ ...getPositionByElement({ element }), ...{ items } });
    }
  }

  componentWillReceiveProps({ element, items } = {}) {
    if (element && items) {
      this.setState({ ...getPositionByElement({ element }), ...{ items } });
    }
  }

  render() {
    const { left, top, right, bottom, items } = this.state;

    return (
      items &&
      ReactDOM.createPortal(
        <div className="sub-menu" style={{ left, top, right, bottom }}>
          {items.map((item, i) => (
            <div key={i} className="sub-menu-item">
              <span className="sub-menu-item-name" title={item}>
                {item}
              </span>
            </div>
          ))}
        </div>,
        document.getElementById("modal-root")
      )
    );
  }
}

SubMenu.displayName = "SubMenu";
SubMenu.propTypes = {
  items: PropTypes.array,
  element: PropTypes.object
};
export default SubMenu;
