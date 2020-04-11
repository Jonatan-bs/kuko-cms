import React, { Component } from "react";
import "./ImageLibraryPicker.css";
import ImgLibContext from "./../ImageLibraryPicker/ImageLibraryPickerContext";

// function assign(obj, keyPath, value) {
//   const lastKeyIndex = keyPath.length - 1;
//   for (var i = 0; i < lastKeyIndex; ++i) {
//     const key = keyPath[i];
//     if (!(key in obj)) {
//       obj[key] = {};
//     }
//     obj = obj[key];
//   }
//   obj[keyPath[lastKeyIndex]] = value;
// }

class ImgPicker extends Component {
  // state = {
  //   images: [],
  //   activeIndex: [],
  //   gallery: [],
  // };

  init = () => {
    fetch("http://localhost:4000/imageLibrary", {
      method: "post",
    })
      .then((response) => response.json())
      .then((response) => {
        let images = [];
        images.push(...response);
        // let prevGallery = this.props.data.gallery;
        // if (!this.props.data.multi && prevGallery) prevGallery = [prevGallery];
        // const gallery = [];
        // if (prevGallery) {
        //   if (this.props.data.multi) {
        //     prevGallery.forEach((image) => {
        //       let index = images.findIndex((img) => img._id === image.imageID);
        //       gallery.push({ index: index, caption: image.caption });
        //     });
        //   } else {
        //     let image = this.props.data.gallery;
        //     let index = images.findIndex((img) => img._id === image.imageID);
        //     gallery.push({ index: index, caption: image.caption });
        //   }
        // } else {
        //   prevGallery = [];
        // }
        // let activeIndex = [];
        // if (!this.props.data.multi && gallery.length > 0) {
        //   activeIndex.push(gallery[0].index);
        // }
        // this.setState({ images, gallery, activeIndex });
        this.context.setImages(images);
      });
  };

  componentDidMount() {
    this.init();
  }
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps !== this.props) {
  //     this.init();
  //   }
  // }
  Images = () => {
    return (
      <ImgLibContext.Context.Consumer>
        {(context) => {
          return context.state.images.map((image, index) => {
            let isActive = context.state.activeIndex.includes(index);
            let multi = context.state.imagePicker.multi;
            let isInGallery = context.state.gallery.find(
              (image) => image.index === index
            );

            if (!multi) {
              return (
                <div
                  key={index}
                  className={isActive ? "libImg active" : "libImg"}
                  onClick={context.setActiveImg(index)}
                >
                  <img
                    src={"http://localhost:4000/uploads/" + image.filename}
                    alt={image.alt}
                  />
                </div>
              );
            } else if (!isInGallery && multi) {
              return (
                <div
                  key={index}
                  className={isActive ? "libImg active" : "libImg"}
                  onClick={context.setActiveImg(index)}
                >
                  <img
                    src={"http://localhost:4000/uploads/" + image.filename}
                    alt={image.alt}
                  />
                </div>
              );
            }
            return null;
          });
        }}
      </ImgLibContext.Context.Consumer>
    );

    // return this.state.images.map((image, index) => {
    //   let isActive = this.state.activeIndex.includes(index);
    //   let multi = this.props.multi;
    //   let isInGallery = this.state.gallery.find(
    //     (image) => image.index === index
    //   );
    //   if (!multi) {
    //     return (
    //       <div
    //         key={index}
    //         className={isActive ? "libImg active" : "libImg"}
    //         onClick={this.setActiveImg(index)}
    //       >
    //         <img
    //           src={"http://localhost:4000/uploads/" + image.filename}
    //           alt={image.alt}
    //         />
    //       </div>
    //     );
    //   } else if (!isInGallery && multi) {
    //     return (
    //       <div
    //         key={index}
    //         className={isActive ? "libImg active" : "libImg"}
    //         onClick={this.setActiveImg(index)}
    //       >
    //         <img
    //           src={"http://localhost:4000/uploads/" + image.filename}
    //           alt={image.alt}
    //         />
    //       </div>
    //     );
    //   }
    //   return null;
    // });
  };

  // setActiveImg = (index) => {
  //   return (event) => {
  //     let activeIndex = [...this.state.activeIndex];

  //     const i = activeIndex.indexOf(index);
  //     if (i > -1) {
  //       activeIndex.splice(i, 1);
  //     } else {
  //       if (!this.props.data.multi) activeIndex = [];
  //       activeIndex.push(index);
  //     }

  //     this.setState({ activeIndex });
  //   };
  // };

  addImage = (event) => {
    let form = document.getElementById("addImage");
    const formData = new FormData(form);
    fetch("http://localhost:4000/imageLibrary/create", {
      method: "post",
      body: formData,
    })
      .then((response) => {
        this.init();
      })

      .catch((err) => console.log(err));
  };

  // addToGallery = () => {
  //   let activeIndex = [];
  //   let gallery = [...this.state.gallery];
  //   this.state.activeIndex.forEach((index) => {
  //     gallery.push({
  //       index: index,

  //       caption: "",
  //     });
  //   });
  //   this.setState({ gallery, activeIndex });
  // };

  ChosenGallery = () => {
    return (
      <ImgLibContext.Context.Consumer>
        {(context) => {
          return context.state.gallery.map((galleryImage, index) => {
            let image = context.state.images[galleryImage.index];
            return (
              <div key={index} className="galleryImg">
                <img
                  src={"http://localhost:4000/uploads/" + image.filename}
                  alt={image.alt}
                />
                <input
                  type="text"
                  value={context.getValue("caption", index)}
                  onChange={context.setValue("caption", index)}
                />

                <button type="text" onClick={context.removeFromGallery(index)}>
                  Remove from gallery
                </button>
              </div>
            );
          });
        }}
      </ImgLibContext.Context.Consumer>
    );
  };

  // removeFromGallery = (index) => {
  //   return () => {
  //     let gallery = this.state.gallery;

  //     gallery.splice(index, 1);

  //     this.setState({ gallery });
  //   };
  // };

  // getValue = (name, index) => {
  //   let gallery = this.state.gallery;
  //   return gallery[index][name];
  // };

  // setValue = (name, index) => {
  //   return (event) => {
  //     let gallery = [...this.state.gallery];
  //     gallery[index][name] = event.target.value;

  //     this.setState({ gallery });
  //   };
  // };

  // saveGallery = () => {
  //   // Create gallery data
  //   let gallery;

  //   if (!this.props.data.multi) {
  //     gallery = {};
  //     let activeIndex = this.state.activeIndex;
  //     let image = this.state.images[activeIndex];
  //     if (image) gallery = { caption: image.caption, imageID: image._id };
  //   } else {
  //     gallery = [];
  //     this.state.gallery.forEach((image) => {
  //       let imageID = this.state.images[image.index]._id;
  //       gallery.push({ caption: image.caption, imageID: imageID });
  //     });
  //   }
  //   this.props.saveGallery(gallery);
  // };

  render() {
    return (
      <React.Fragment>
        <ImgLibContext.Context.Consumer>
          {(context) => {
            return (
              <React.Fragment>
                <div className="overlay" onClick={context.closeImgPicker}></div>
                <div id="imageLibraryPicker">
                  <form id="addImage">
                    <input type="file" name="image" onChange={this.addImage} />
                  </form>
                  <div className="libImages">{<this.Images />}</div>
                  {context.state.imagePicker.multi ? (
                    <React.Fragment>
                      <button onClick={context.addToGallery}>
                        Add to gallery
                      </button>
                      <div className="chosenGallery">
                        <this.ChosenGallery />
                      </div>
                      <button onClick={context.saveGallery()}>
                        Save Gallery
                      </button>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <input
                        type="text"
                        value={context.state.imagePicker.caption}
                        onChange={context.setValueCaption("caption")}
                      />
                      <button onClick={context.saveGallery()}>
                        Choose Image
                      </button>
                    </React.Fragment>
                  )}
                </div>
              </React.Fragment>
            );
          }}
        </ImgLibContext.Context.Consumer>
        {/* <div className="overlay" onClick={this.props.closeImagePicker}></div>
        <div id="imageLibraryPicker">
          <form id="addImage">
            <input type="file" name="image" onChange={this.addImage} />
          </form>
          <div className="libImages">
            <this.Images />
          </div>
          {this.props.data.multi ? (
            <React.Fragment>
              <button onClick={this.addToGallery}>Add to gallery</button>
              <div className="chosenGallery">
                <this.ChosenGallery />
              </div>
              <button onClick={this.saveGallery}>Save Gallery</button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <button onClick={this.saveGallery}>Choose Image</button>
            </React.Fragment>
          )}
        </div> */}
      </React.Fragment>
    );
  }
}
ImgPicker.contextType = ImgLibContext.Context;

export default ImgPicker;
