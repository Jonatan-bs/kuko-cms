import React, { Component } from "react";
import "./ImageUploader.css";
import loadingGif from "./../../loading.gif";

class ImageUploader extends Component {
  state = {
    uploading: [],
    images: [],
  };

  addImage = (e) => {
    let form = e.target.parentNode;
    const formData = new FormData(form);

    e.target.value = "";

    let uploading = [...this.state.uploading];
    uploading.push(true);
    this.setState({ uploading });
    const index = uploading.length - 1;

    fetch("http://localhost:4000/tempimageCloudinary", {
      method: "post",
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.success) {
          let name = "";

          this.props.callback({
            success: true,
            public_id: res.public_id,
            name: name,
            index: index,
          });
        } else {
          uploading.splice(index, 1);
          this.setState({ uploading });
          this.props.callback({ success: false, message: res });
        }
      })
      .catch((err) => {
        uploading.splice(index, 1);
        this.setState({ uploading });
        this.props.callback({ success: false, message: err });
      });
  };
  setSrc = (images) => {
    let imagesSrc = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      imagesSrc[i] = {
        src:
          "https://res.cloudinary.com/kuko/image/upload/w_400/" +
          image.public_id,
      };

      const imageLoader = new Image();
      imageLoader.src = imagesSrc[i].src;

      imageLoader.onload = () => {
        const uploading = [...this.state.uploading];
        uploading[i] = false;
        this.setState({ images: imagesSrc, uploading });
      };
    }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps === this.props) return;

    if (this.props.images.length) {
      this.setSrc([...this.props.images]);
    }
  };

  setName = (index) => {
    return (e) => {
      const value = e.target.value;
      this.props.callback({ name: value, index: index, success: true });
    };
  };

  bgImgStyleObj = (index) => {
    if (this.state.uploading[index]) {
      return {
        backgroundColor: "#e7e7e7",
        backgroundImage: `URL(${loadingGif})`,
        backgroundSize: "50%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      };
    } else if (this.state.images[index].src) {
      return {
        backgroundColor: "#e7e7e7",
        backgroundImage: `URL(${this.state.images[index].src})`,
      };
    }
  };

  removeImg = () => {};

  render() {
    return (
      <React.Fragment>
        <form>
          <input type="file" name="image" onChange={this.addImage} />
          <div className="tempImages">
            {this.state.uploading.map((uploading, index) => {
              return (
                <div className="tempImgWrap" key={"image" + index}>
                  <div className="tempImg" style={this.bgImgStyleObj(index)}>
                    {this.state.images[index] ? (
                      <p className="removeImg" onClick={this.removeImg(index)}>
                        Remove image
                      </p>
                    ) : null}
                  </div>
                  {this.state.images[index] ? (
                    <input
                      type="text"
                      onChange={this.setName(index)}
                      value={this.props.images[index].name}
                      placeholder="SEO name"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default ImageUploader;
