import React, { Component } from "react";
class LazyLoadBG extends Component {
  state = {
    src:
      "https://res.cloudinary.com/kuko/image/upload/e_blur:500,c_scale,h_10/" +
      this.props.public_id,
  };
  componentDidMount() {
    let src =
      "https://res.cloudinary.com/kuko/image/upload/" +
      this.props.transformations +
      "/" +
      this.props.public_id;

    const imageLoader = new Image();
    imageLoader.src = src;

    imageLoader.onload = () => {
      this.setState({ src });
    };
  }

  render() {
    return (
      <div
        style={{
          backgroundImage: `url(${this.state.src})`,
        }}
        className={this.props.className}
      >
        {this.props.children}
      </div>
    );
  }
}
export default LazyLoadBG;
