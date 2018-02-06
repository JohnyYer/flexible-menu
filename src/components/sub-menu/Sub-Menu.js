import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Sub-Menu.css";
const modalRoot = document.getElementById("modal-root");

const isElementInside = (startElement, rootElement) => {
  let parent = startElement.parentElement;
  if (!parent) {
    return false;
  }
  return parent === rootElement ? true : isElementInside(parent, rootElement);
};

const getPositionByElement = ({ element, rootElement } = {}) => {
  const elementBoundingClientRect = element.getBoundingClientRect();
  if (rootElement) {
    const rootElementBoundingClientRect = rootElement.getBoundingClientRect();
    const availableOnBottom = window.innerHeight >= rootElementBoundingClientRect.bottom;
    if (availableOnBottom) {
      return;
    }
    const availableOnTop = elementBoundingClientRect.top >= rootElementBoundingClientRect.height;
    if (availableOnTop) {
      return { top: elementBoundingClientRect.top - rootElementBoundingClientRect.height, left: elementBoundingClientRect.left };
    }

    const availableOnleft = elementBoundingClientRect.left >= rootElementBoundingClientRect.width;
    if (availableOnleft) {
      return { top: 0, left: elementBoundingClientRect.left-rootElementBoundingClientRect.width};
    }

    const availableOnRight = elementBoundingClientRect.right >= elementBoundingClientRect.width;
    if (availableOnRight) {
      return { top: 0, left: elementBoundingClientRect.left+elementBoundingClientRect.width};
    }


  }
  return { top: elementBoundingClientRect.top + elementBoundingClientRect.height, left: elementBoundingClientRect.left };
};

class SubMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: null,
      top: null,
      right: null,
      bottom: null,
      items: null,
      isSecondRender: false
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
    window.addEventListener("resize", this.removeItems);
    window.addEventListener("scroll", this.removeItems);
    window.addEventListener("click", this.documentClick);
  }

  componentDidUpdate() {
    const { element } = this.props;
    const { isSecondRender, items } = this.state;
    if (!isSecondRender && items && element) {
      this.setState({
        ...getPositionByElement({ element, rootElement: ReactDOM.findDOMNode(this) }),
        ...{ items },
        ...{ isSecondRender: true }
      });
    }
  }

  componentWillReceiveProps({ element, items } = {}) {
    if (element && items) {
      this.setState({ ...getPositionByElement({ element }), ...{ items }, ...{ isSecondRender: false } });
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
        modalRoot
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
