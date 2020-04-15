import React, { Component } from "react";
import "./ImageUploader.css";
import loadingGif from "./../../loading.gif";
// import LazyLoadBG from "./../../LazyLoadBG";

class Products extends Component {
  state = {
    loading: false,
  };

  addImage = (variantIndex) => {
    return (e) => {
      let form = e.target.parentNode;
      const formData = new FormData(form);

      e.target.value = "";

      this.setImgLoader(true, variantIndex);

      fetch("http://localhost:4000/tempimageCloudinary", {
        method: "post",
        body: formData,
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.success) {
            let src =
              "https://res.cloudinary.com/kuko/image/upload/w_400/" +
              res.public_id;

            const imageLoader = new Image();
            imageLoader.src = src;
            imageLoader.onload = () => {
              this.setImgLoader(false, variantIndex);

              this.setValueImg(variantIndex, res.public_id);
            };
          } else {
            this.setImgLoader(false, variantIndex);

            console.log(res);
          }
        })
        .catch((err) => {
          this.setImgLoader(false, variantIndex);
          console.log(err);
        });
    };
  };

  setValueImg = (variantIndex, public_id) => {
    const data = { ...this.state.data };
    if (variantIndex || variantIndex === 0) {
      data.variants[variantIndex]["images"].push({ public_id });
    } else {
      data["thumbnail"] = { public_id };
    }
    this.setState({ data });
  };

  setImgLoader = (boolean, variantIndex) => {
    const data = { ...this.state.data };

    if (variantIndex || variantIndex === 0) {
      data.variants[variantIndex]["imagesLoader"] = boolean;
    } else {
      data["thumbnailLoader"] = boolean;
    }
    this.setState({ data });
  };

  render() {
    return (
      <React.Fragment>
        <form id="thumb">
          <input type="file" name="image" />
          <div className="tempImgWrap">
            <p>ss</p>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default Products;
