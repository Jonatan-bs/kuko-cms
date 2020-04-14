import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./Nav-main.css";

class mainNav extends Component {
  render() {
    return (
      <nav className="Nav-main">
        <ul>
          <Link to="/product">
            <li>Products</li>
          </Link>
        </ul>
      </nav>
    );
  }
}

export default mainNav;
