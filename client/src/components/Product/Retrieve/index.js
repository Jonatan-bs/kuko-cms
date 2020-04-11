import React, { Component } from "react";
import { Link } from "react-router-dom";

class Products extends Component {
  state = { products: [] };

  componentDidMount = () => {
    fetch("http://localhost:4000/product")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState({ products: res });
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <React.Fragment>
        {this.state.products.map((product, index) => {
          return (
            <Link key={"product" + index} to={"/product/" + product._id}>
              <p>{product.title}</p>
            </Link>
          );
        })}
      </React.Fragment>
    );
  }
}

export default Products;
