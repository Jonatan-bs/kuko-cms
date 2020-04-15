import React, { Component } from "react";
import "./ImageUploader.css";
import loadingGif from "./../../loading.gif";

class ImageUploader extends Component {
  state = {
    uploading: false,
    src: "",
  };

  addImage = (e) => {
    let form = e.target.parentNode;
    const formData = new FormData(form);

    e.target.value = "";

    this.setState({ uploading: true });

    fetch("http://localhost:4000/tempimageCloudinary", {
      method: "post",
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.success) {
          let name = this.props.image.name ? this.props.image.name : "";
          this.props.callback({ public_id: res.public_id, name: name });
        } else {
          this.props.callback(res);
        }
      })
      .catch((err) => {
        this.setState({ uploading: false });

        this.props.callback(err);
      });
  };
  setSrc = (public_id) => {
    let src = "https://res.cloudinary.com/kuko/image/upload/w_400/" + public_id;

    const imageLoader = new Image();
    imageLoader.src = src;
    imageLoader.onload = () => {
      this.setState({ src });
      this.setState({ uploading: false });
    };
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps === this.props) return;

    if (this.props.image.public_id) {
      this.setSrc(this.props.image.public_id);
    }
  };

  setName = (e) => {
    const value = e.target.value;
    this.props.callback({ name: value });
  };

  bgImgStyleObj = () => {
    if (this.state.uploading) {
      return {
        backgroundColor: "#e7e7e7",
        backgroundImage: `URL(${loadingGif})`,
        backgroundSize: "50%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      };
    } else if (this.state.src) {
      return {
        backgroundColor: "#e7e7e7",
        backgroundImage: `URL(${this.state.src})`,
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
            <div className="tempImgWrap">
              {this.props.image.public_id || this.state.uploading ? (
                <div className="tempImg" style={this.bgImgStyleObj()}>
                  {this.state.src ? (
                    <p className="removeImg" onClick={this.removeImg()}>
                      Remove image
                    </p>
                  ) : null}
                </div>
              ) : null}
              {this.state.src ? (
                <input
                  type="text"
                  onChange={this.setName}
                  value={this.props.image.name}
                  placeholder="SEO name"
                />
              ) : null}
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default ImageUploader;
