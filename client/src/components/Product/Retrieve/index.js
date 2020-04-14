import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Image, Transformation } from "cloudinary-react";

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
        <Link to="/product/create">
          <li>Add product</li>
        </Link>
        {this.state.products.map((product, index) => {
          return (
            <Link key={"product" + index} to={"/product/update/" + product._id}>
              <p>{product.title}</p>
              <Image
                cloudName="kuko"
                publicId={product.thumbnail.public_id}
                urlSuffix={
                  product.thumbnail.SEOname ? product.thumbnail.SEOname : null
                }
              >
                <Transformation width="200" crop="scale" />
              </Image>
            </Link>
          );
        })}
      </React.Fragment>
    );
  }
}

export default Products;
