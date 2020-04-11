import React, { Component } from "react";
const ImageLibraryPickerContext = React.createContext();
class ImageLibraryPickerProvider extends Component {
  state = {
    images: [],
    activeIndex: [],
    gallery: [],
    imagePicker: {
      caption: "",
      active: false,
      path: "",
      multi: false,
      gallery: {},
    },
  };
  render() {
    return (
      <ImageLibraryPickerContext.Provider
        value={{
          state: this.state,
          openImgPicker: this.openImgPicker,
          setImages: this.setImages,
          closeImgPicker: this.closeImgPicker,
          addToGallery: this.addToGallery,
          saveGallery: this.saveGallery,
          setActiveImg: this.setActiveImg,
          getValue: this.getValue,
          setValue: this.setValue,
          getValueCaption: this.getValueCaption,
          setValueCaption: this.setValueCaption,
          removeFromGallery: this.removeFromGallery,
        }}
      >
        {this.props.children}
      </ImageLibraryPickerContext.Provider>
    );
  }

  saveGallery;

  saveGalleryFunck = (callback) => {
    // Create gallery data
    return () => {
      let gallery;

      if (!this.state.imagePicker.multi) {
        gallery = {};
        let activeIndex = this.state.activeIndex;
        let image = this.state.images[activeIndex];
        let caption = this.state.imagePicker.caption;
        if (image) gallery = { caption, imageID: image._id };
      } else {
        gallery = [];
        this.state.gallery.forEach((image) => {
          let imageID = this.state.images[image.index]._id;
          gallery.push({ caption: image.caption, imageID: imageID });
        });
      }

      callback(gallery);
    };
  };

  openImgPicker = (path, gallery, multi, context, cb) => {
    return (e) => {
      e.preventDefault();
      let imagePicker = { ...this.state.imagePicker };
      imagePicker.active = true;
      imagePicker.path = path;
      imagePicker.multi = multi;
      imagePicker.gallery = gallery;
      this.saveGallery = () => {
        return this.saveGalleryFunck(cb);
      };
      this.setState({ imagePicker });
    };
  };

  setImages = (images) => {
    this.setState({ images });
  };

  closeImgPicker = () => {
    let state = {
      images: [],
      activeIndex: [],
      gallery: [],
      imagePicker: {
        active: false,
        path: "",
        multi: false,
        gallery: {},
        caption: "",
      },
    };
    this.setState(state);
  };

  addToGallery = () => {
    let activeIndex = [];
    let gallery = [...this.state.gallery];
    this.state.activeIndex.forEach((index) => {
      gallery.push({
        index: index,
        caption: "",
      });
    });
    this.setState({ gallery, activeIndex });
  };

  setActiveImg = (index) => {
    return (event) => {
      let activeIndex = [...this.state.activeIndex];

      const i = activeIndex.indexOf(index);
      if (i > -1) {
        activeIndex.splice(i, 1);
      } else {
        if (!this.state.imagePicker.multi) activeIndex = [];
        activeIndex.push(index);
      }

      this.setState({ activeIndex });
    };
  };

  removeFromGallery = (index) => {
    return () => {
      let gallery = this.state.gallery;

      gallery.splice(index, 1);

      this.setState({ gallery });
    };
  };

  getValue = (name, index) => {
    let gallery = this.state.gallery;
    return gallery[index][name];
  };

  setValue = (name, index) => {
    return (event) => {
      let gallery = [...this.state.gallery];
      gallery[index][name] = event.target.value;

      this.setState({ gallery });
    };
  };

  setValueCaption = () => {
    return (event) => {
      let state = { ...this.state };
      state.imagePicker.caption = event.target.value;

      this.setState({ state });
    };
  };
}

export default {
  Provider: ImageLibraryPickerProvider,
  Context: ImageLibraryPickerContext,
};
