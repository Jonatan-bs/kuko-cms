import React, { Component } from "react";

class ImageLibrary extends Component {
  state = { images: [], menu: {}, activeIndex: null };
  loadImgs = () => {
    fetch("http://localhost:4000/imageLibrary", {
      method: "post",
    })
      .then((response) => response.json())
      .then((response) => {
        let images = [];
        images.push(...response);
        this.setState({ images });
      });
  };

  componentDidMount() {
    this.loadImgs();
  }
  Images = () => {
    return this.state.images.map((image, index) => {
      return (
        <div
          key={index}
          className={
            this.state.activeIndex === index ? "libImg active" : "libImg"
          }
          onClick={this.setActiveImg(index)}
        >
          <img
            src={"http://localhost:4000/uploads/" + image.filename}
            alt={image.alt}
          />
        </div>
      );
    });
  };

  setActiveImg = (index) => {
    return (event) => {
      let activeIndex = null;
      if (index !== this.state.activeIndex) {
        activeIndex = index;
      }
      this.setState({ activeIndex });
    };
  };
  setValue = (name) => {
    let images = [...this.state.images];
    return (event) => {
      images[this.state.activeIndex][name] = event.target.value;
      this.setState({ images });
    };
  };
  updateImgData = () => {
    let images = [...this.state.images];
    let image = images[this.state.activeIndex];
    const id = image._id;

    image = {
      name: image.name,
      alt: image.alt,
      description: image.description,
      caption: image.caption,
    };
    fetch("http://localhost:4000/imageLibrary/update/" + id, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(image),
    })
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };
  addImage = (event) => {
    let form = document.getElementById("addImage");
    const formData = new FormData(form);
    fetch("http://localhost:4000/imageLibrary/create", {
      method: "post",
      body: formData,
    })
      .then((response) => {
        this.loadImgs();
      })
      .catch((err) => console.log(err));
  };
  Menu = () => {
    let imgInfo = this.state.images[this.state.activeIndex];
    if (!imgInfo) return <p>Select image to update</p>;

    return (
      <React.Fragment>
        <input
          type="text"
          value={imgInfo.name}
          onChange={this.setValue("name")}
        />
        <input
          type="text"
          value={imgInfo.alt}
          onChange={this.setValue("alt")}
        />
        <input
          type="text"
          value={imgInfo.caption}
          onChange={this.setValue("caption")}
        />
        <input
          type="text"
          value={imgInfo.description}
          onChange={this.setValue("description")}
        />
        <button type="text" onClick={this.updateImgData}>
          Update
        </button>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div id="libWrap">
        <form id="addImage">
          <input type="file" name="image" onChange={this.addImage} />
        </form>
        <div className="libImages">
          <this.Images />
        </div>
        <div className="libMenu">
          <this.Menu />
        </div>
      </div>
    );
  }
}

export default ImageLibrary;
