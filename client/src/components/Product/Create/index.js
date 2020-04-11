import React, { Component } from "react";
import ImagePicker from "./../../ImageLibraryPicker";
import ImgLibContext from "./../../ImageLibraryPicker/ImageLibraryPickerContext";

class Products extends Component {
  state = {
    imagePicker: {
      active: false,
      path: "",
      multi: false,
      gallery: {},
    },

    data: {
      title: "",
      description: "",
      shortDescription: "",
      thumbnail: null,
      variants: [
        {
          quantity: 0,
          variantType: "",
          variantValue: "",
          images: [],
          price: 0,
          priceCompare: "",
          weight: 0,
        },
      ],
    },
  };
  setValue = (variantIndex) => {
    return (e) => {
      const data = { ...this.state.data };
      const value = e.target.value;
      const name = e.target.name;
      if (variantIndex || variantIndex === 0) {
        data.variants[variantIndex][name] = value;
      } else {
        data[name] = value;
      }
      this.setState({ data });
    };
  };
  addVariant = (e) => {
    e.preventDefault();
    let data = { ...this.state.data };
    data.variants.push({
      quantity: 0,
      variantType: "",
      variantValue: "",
      images: [],
      price: 0,
      priceCompare: "",
      weight: 0,
    });

    this.setState({ data });
  };
  imagePicker = (path, gallery, multi, context) => {
    return (e) => {
      e.preventDefault();
      let imagePicker = { ...this.state.imagePicker };
      imagePicker.active = true;
      imagePicker.gallery = gallery;
      imagePicker.multi = multi;
      imagePicker.path = path;
      this.setState({ imagePicker });
    };
  };
  saveGallery = (context) => {
    return (gallery) => {
      console.log(context);
      console.log(gallery);
    };
    // return (gallery, variantIndex) => {
    //   let data = { ...this.state.data };
    //   if (variantIndex || variantIndex === 0) {
    //     data.variants[variantIndex][nameID] = gallery;
    //   } else {
    //     data[nameID] = gallery;
    //   }
    //   let imagePicker = false;
    //   this.setState({ data, imagePicker });
    // };
  };

  saveProduct = (e) => {
    e.preventDefault();

    let productForm = document.querySelector("form#product");
    let inputs = productForm.querySelectorAll("input");
    for (const input of inputs) {
      input.reportValidity();
      if (!input.checkValidity()) return;
    }

    fetch("http://localhost:4000/product", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log("err"));
  };
  closeImagePicker = () => {
    this.setState({ imagePicker: false });
  };
  render() {
    return (
      <React.Fragment>
        <form id="product">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={this.state.data.title}
            onChange={this.setValue()}
          />
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={this.state.data.description}
            onChange={this.setValue()}
          />
          <label>Short Description</label>
          <input
            type="text"
            name="shortDescription"
            value={this.state.data.shortDescription}
            onChange={this.setValue()}
          />
          <label>Thumbnail</label>
          <ImgLibContext.Context.Consumer>
            {(context) => {
              return (
                <button
                  onClick={context.openImgPicker(
                    ["data", "thumbnail"],
                    this.state.data.thumbnail,
                    false,
                    this,
                    (gallery) => {
                      let data = { ...this.state.data };
                      data.thumbnail = gallery;
                      this.setState({ data });
                    }
                  )}
                >
                  add image
                </button>
              );
            }}
          </ImgLibContext.Context.Consumer>
          {/* <button
            name="thumbnail"
            data-multi={false}
            onClick={this.imagePicker(
              ["data", "thumbnail"],
              this.state.data.thumbnail,
              false,
              this
            )}
          >
            add image
          </button> */}

          {this.state.data.variants.map((variant, index) => {
            return (
              <React.Fragment key={`variant${index}`}>
                <label>quantity</label>
                <input
                  name="quantity"
                  value={this.state.data.variants[index].quantity}
                  onChange={this.setValue(index)}
                />
                <label>variantType</label>
                <input
                  name="variantType"
                  value={this.state.data.variants[index].variantType}
                  onChange={this.setValue(index)}
                />
                <label>variantValue</label>
                <input
                  name="variantValue"
                  value={this.state.data.variants[index].variantValue}
                  onChange={this.setValue(index)}
                />
                <label>images</label>
                <ImgLibContext.Context.Consumer>
                  {(context) => {
                    return (
                      <button
                        onClick={context.openImgPicker(
                          ["data", "thumbnail", index, "images"],
                          this.state.data.variants[index].images,
                          true,
                          this,
                          (gallery) => {
                            let data = { ...this.state.data };
                            data.variants[index].images = gallery;
                            this.setState({ data });
                          }
                        )}
                      >
                        add image
                      </button>
                    );
                  }}
                </ImgLibContext.Context.Consumer>
                {/* <button
                  name="images"
                  data-multi={true}
                  onClick={this.imagePicker(
                    ["data", "variants", index, "images"],
                    this.state.data.variants[index].images,
                    true,
                    this
                  )}
                >
                  add image
                </button> */}
                <label>price</label>
                <input
                  name="price"
                  value={this.state.data.variants[index].price}
                  onChange={this.setValue(index)}
                />
                <label>priceCompare</label>
                <input
                  name="priceCompare"
                  value={this.state.data.variants[index].priceCompare}
                  onChange={this.setValue(index)}
                />
                <label>weight</label>
                <input
                  name="weight"
                  value={this.state.data.variants[index].weight}
                  onChange={this.setValue(index)}
                />
              </React.Fragment>
            );
          })}
          <button onClick={this.addVariant}>Add variant</button>

          <button onClick={this.saveProduct}>Save Product</button>
        </form>

        {/* {this.state.imagePicker.active ? (
          <ImagePicker
            data={this.state.imagePicker}
            saveGallery={this.saveGallery(this)}
            gallery={this.state.imagePicker[1]}
            multi={this.state.imagePicker[2]}
            variantIndex={this.state.imagePicker[3]}
            closeImagePicker={this.closeImagePicker}
          />
        ) : null} */}
      </React.Fragment>
    );
  }
}

export default Products;
