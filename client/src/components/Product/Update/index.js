import React, { Component } from "react";
import "./Update.css";
class Products extends Component {
  state = {
    data: {
      title: "",
      description: "",
      shortDescription: "",
      thumbnail: "",
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

  init = () => {
    let id = this.props.match.params.id;
    fetch("http://localhost:4000/product/" + id)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        res.variants.forEach((variant) => {
          if (!variant.priceCompare) variant.priceCompare = "";
        });

        this.setState({ data: res });
      })
      .catch((err) => console.log(err));
  };
  componentDidMount = () => {
    this.init();
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

  updateProduct = (e) => {
    let id = this.props.match.params.id;

    e.preventDefault();
    let productForm = document.querySelector("#product");
    let inputs = productForm.querySelectorAll("input");
    for (const input of inputs) {
      input.reportValidity();
      if (!input.checkValidity()) return;
    }

    fetch("http://localhost:4000/product/update/" + id, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        this.init();
      })
      .catch((err) => console.log("err"));
  };

  addImage = (variantIndex) => {
    return (e) => {
      let form = e.target.parentNode;
      const formData = new FormData(form);

      fetch("http://localhost:4000/tempImage", {
        method: "post",
        body: formData,
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.success) {
            this.setValueImg(variantIndex, res.data);
          } else {
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  setValueImg = (variantIndex, imgData) => {
    const data = { ...this.state.data };
    if (variantIndex || variantIndex === 0) {
      data.variants[variantIndex]["images"].push(imgData);
    } else {
      data["thumbnail"] = imgData;
    }
    this.setState({ data });
  };

  removeImg(path, variantIndex, imgIndex) {
    return () => {
      fetch("http://localhost:4000/tempImage/remove", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            if (variantIndex || variantIndex === 0) {
              let data = { ...this.state.data };
              data.variants[variantIndex].images.splice(imgIndex, 1);
              this.setState({ data });
            } else {
              let data = { ...this.state.data };
              data.thumbnail = "";
              this.setState({ data });
            }
          }
        })
        .catch((err) => console.log(err));
    };
  }

  ThumbnailTemp = () => {
    if (!this.state.data.thumbnail) return null;

    return (
      <div
        className="tempImg"
        style={
          this.state.data.thumbnail.public_id
            ? {
                backgroundImage:
                  "url(https://res.cloudinary.com/kuko/image/upload/w_400/" +
                  this.state.data.thumbnail.public_id +
                  ")",
              }
            : {
                backgroundImage:
                  "url(http://localhost:4000/uploads/" +
                  this.state.data.thumbnail.filename +
                  ")",
              }
        }
      >
        <p onClick={this.removeImg(this.state.data.thumbnail.path)}>
          Remove image
        </p>
      </div>
    );
  };

  VariantImgTemp = () => {
    if (!this.state.data.thumbnail) return null;

    return (
      <div
        className="tempImg"
        style={
          this.state.data.thumbnail.public_id
            ? {
                backgroundImage:
                  "url(https://res.cloudinary.com/kuko/image/upload/" +
                  this.state.data.thumbnail.public_id +
                  ")",
              }
            : {
                backgroundImage:
                  "url(http://localhost:4000/uploads/" +
                  this.state.data.thumbnail.filename +
                  ")",
              }
        }
      >
        <p onClick={this.removeImg(this.state.data.thumbnail.path)}>
          Remove image
        </p>
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <div id="product">
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
          <form>
            <div className="tempImgWrap">
              <this.ThumbnailTemp />
            </div>
            <input type="file" name="image" onChange={this.addImage()} />
          </form>

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
                <form>
                  <div className="tempImgWrap">
                    {this.state.data.variants[index].images.map(
                      (image, imgIndex) => {
                        return (
                          <div
                            className="tempImg"
                            key={"tempImg" + imgIndex}
                            style={
                              image.public_id
                                ? {
                                    backgroundImage:
                                      "url(https://res.cloudinary.com/kuko/image/upload/w_400/" +
                                      image.public_id +
                                      ")",
                                  }
                                : {
                                    backgroundImage:
                                      "url(http://localhost:4000/uploads/" +
                                      image.filename +
                                      ")",
                                  }
                            }
                          >
                            <p
                              onClick={this.removeImg(
                                image.path,
                                index,
                                imgIndex
                              )}
                            >
                              Remove image
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                  <input
                    type="file"
                    name="image"
                    onChange={this.addImage(index)}
                  />
                </form>
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

          <button onClick={this.updateProduct}>Update Product</button>
        </div>
      </React.Fragment>
    );
  }
}

export default Products;

// class Products extends Component {
//   state = {
//     imagePicker: false,
//     data: {
//       title: "",
//       description: "",
//       shortDescription: "",
//       thumbnail: null,
//       variants: [
//         {
//           quantity: 0,
//           variantType: "",
//           variantValue: "",
//           images: [],
//           price: 0,
//           priceCompare: "",
//           weight: 0,
//         },
//       ],
//     },
//   };

//   componentDidMount = () => {
//     let id = this.props.match.params.id;
//     fetch("http://localhost:4000/product/" + id)
//       .then((res) => {
//         return res.json();
//       })
//       .then((res) => {
//         res.variants.forEach((variant) => {
//           if (!variant.priceCompare) variant.priceCompare = "";
//         });

//         this.setState({ data: res });
//       })
//       .catch((err) => console.log(err));
//   };

//   setValue = (variantIndex) => {
//     return (e) => {
//       const data = { ...this.state.data };
//       const value = e.target.value;
//       const name = e.target.name;
//       if (variantIndex || variantIndex === 0) {
//         data.variants[variantIndex][name] = value;
//       } else {
//         data[name] = value;
//       }
//       this.setState({ data });
//     };
//   };
//   addVariant = (e) => {
//     e.preventDefault();
//     let data = { ...this.state.data };
//     data.variants.push({
//       quantity: 0,
//       variantType: "",
//       variantValue: "",
//       images: [],
//       price: 0,
//       priceCompare: "",
//       weight: 0,
//     });

//     this.setState({ data });
//   };
//   imagePicker = (variantIndex) => {
//     return (e) => {
//       e.preventDefault();
//       let name = e.target.name;
//       let gallery;
//       if (variantIndex || variantIndex === 0) {
//         gallery = this.state.data.variants[variantIndex].images;
//       } else {
//         gallery = this.state.data.thumbnail;
//       }
//       let multi = e.target.dataset.multi === "true" ? true : false;
//       let imagePicker =
//         this.state.imagePicker[0] === e.target.name
//           ? false
//           : [name, gallery, multi, variantIndex];
//       this.setState({ imagePicker });
//     };
//   };
//   saveGallery = (nameID) => {
//     return (gallery, variantIndex) => {
//       let data = { ...this.state.data };
//       if (variantIndex || variantIndex === 0) {
//         data.variants[variantIndex][nameID] = gallery;
//       } else {
//         data[nameID] = gallery;
//       }
//       let imagePicker = false;
//       this.setState({ data, imagePicker });
//     };
//   };

//   updateProduct = (e) => {
//     e.preventDefault();
//     let id = this.props.match.params.id;

//     let productForm = document.querySelector("form#product");
//     let inputs = productForm.querySelectorAll("input");
//     for (const input of inputs) {
//       input.reportValidity();
//       if (!input.checkValidity()) return;
//     }

//     fetch("http://localhost:4000/product/update/" + id, {
//       method: "post",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(this.state.data),
//     })
//       .then((res) => res.json())
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => console.log("err"));
//   };

//   render() {
//     return (
//       <React.Fragment>
//         <form id="product">
//           <label>Title</label>
//           <input
//             type="text"
//             name="title"
//             value={this.state.data.title}
//             onChange={this.setValue()}
//           />
//           <label>Description</label>
//           <input
//             type="text"
//             name="description"
//             value={this.state.data.description}
//             onChange={this.setValue()}
//           />
//           <label>Short Description</label>
//           <input
//             type="text"
//             name="shortDescription"
//             value={this.state.data.shortDescription}
//             onChange={this.setValue()}
//           />
//           <label>Thumbnail</label>

//           <button
//             name="thumbnail"
//             data-multi={false}
//             onClick={this.imagePicker()}
//             file={this.state.data.thumbnail}
//           >
//             add image
//           </button>

//           {this.state.data.variants.map((variant, index) => {
//             return (
//               <React.Fragment key={`variant${index}`}>
//                 <label>quantity</label>
//                 <input
//                   name="quantity"
//                   value={this.state.data.variants[index].quantity}
//                   onChange={this.setValue(index)}
//                 />
//                 <label>variantType</label>
//                 <input
//                   name="variantType"
//                   value={this.state.data.variants[index].variantType}
//                   onChange={this.setValue(index)}
//                 />
//                 <label>variantValue</label>
//                 <input
//                   name="variantValue"
//                   value={this.state.data.variants[index].variantValue}
//                   onChange={this.setValue(index)}
//                 />
//                 <label>images</label>
//                 <button
//                   name="images"
//                   data-multi={true}
//                   onClick={this.imagePicker(index)}
//                   file={this.state.data.variants[index].images}
//                 >
//                   add image
//                 </button>
//                 <label>price</label>
//                 <input
//                   name="price"
//                   value={this.state.data.variants[index].price}
//                   onChange={this.setValue(index)}
//                 />
//                 <label>priceCompare</label>
//                 <input
//                   name="priceCompare"
//                   value={this.state.data.variants[index].priceCompare}
//                   onChange={this.setValue(index)}
//                 />
//                 <label>weight</label>
//                 <input
//                   name="weight"
//                   value={this.state.data.variants[index].weight}
//                   onChange={this.setValue(index)}
//                 />
//               </React.Fragment>
//             );
//           })}
//           <button onClick={this.addVariant}>Add variant</button>

//           <button onClick={this.updateProduct}>Update Product</button>
//         </form>

//         {this.state.imagePicker ? (
//           <ImagePicker
//             saveGallery={this.saveGallery(this.state.imagePicker[0])}
//             gallery={this.state.imagePicker[1]}
//             multi={this.state.imagePicker[2]}
//             variantIndex={this.state.imagePicker[3]}
//           />
//         ) : null}
//       </React.Fragment>
//     );
//   }
// }

// export default Products;
