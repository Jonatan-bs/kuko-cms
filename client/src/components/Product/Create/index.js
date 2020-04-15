import React, { Component } from "react";
import "./Create.css";
// import loadingGif from "./../../../loading.gif";
// import LazyLoadBG from "./../../LazyLoadBG";
import ImageUploader from "./../../ImageUploader";

class Products extends Component {
  state = {
    data: {
      title: "",
      description: "",
      shortDescription: "",
      thumbnail: {},
      thumbnailLoader: false,
      variants: [
        {
          quantity: 0,
          variantType: "",
          variantValue: "",
          images: [],
          imagesLoader: false,
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

  saveProduct = (e) => {
    e.preventDefault();

    let productForm = document.querySelector("#product");
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
      .catch((err) => console.log(err));
  };

  // addImage = (variantIndex) => {
  //   return (e) => {
  //     let form = e.target.parentNode;
  //     const formData = new FormData(form);

  //     e.target.value = "";

  //     this.setImgLoader(true, variantIndex);

  //     fetch("http://localhost:4000/tempimageCloudinary", {
  //       method: "post",
  //       body: formData,
  //     })
  //       .then((res) => {
  //         return res.json();
  //       })
  //       .then((res) => {
  //         if (res.success) {
  //           let src =
  //             "https://res.cloudinary.com/kuko/image/upload/w_400/" +
  //             res.public_id;

  //           const imageLoader = new Image();
  //           imageLoader.src = src;
  //           imageLoader.onload = () => {
  //             this.setImgLoader(false, variantIndex);

  //             this.setValueImg(variantIndex, res.public_id);
  //           };
  //         } else {
  //           this.setImgLoader(false, variantIndex);

  //           console.log(res);
  //         }
  //       })
  //       .catch((err) => {
  //         this.setImgLoader(false, variantIndex);
  //         console.log(err);
  //       });
  //   };
  // };

  // setValueImg = (variantIndex, public_id) => {
  //   const data = { ...this.state.data };
  //   if (variantIndex || variantIndex === 0) {
  //     data.variants[variantIndex]["images"].push({ public_id });
  //   } else {
  //     data["thumbnail"] = { public_id };
  //   }
  //   this.setState({ data });
  // };

  // setImgLoader = (boolean, variantIndex) => {
  //   const data = { ...this.state.data };

  //   if (variantIndex || variantIndex === 0) {
  //     data.variants[variantIndex]["imagesLoader"] = boolean;
  //   } else {
  //     data["thumbnailLoader"] = boolean;
  //   }
  //   this.setState({ data });
  // };

  // removeImg(path, variantIndex, imgIndex) {
  //   return () => {
  //     fetch("http://localhost:4000/tempImage/remove", {
  //       method: "post",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ path }),
  //     })
  //       .then((res) => res.json())
  //       .then((res) => {
  //         if (res.success) {
  //           if (variantIndex || variantIndex === 0) {
  //             let data = { ...this.state.data };
  //             data.variants[variantIndex].images.splice(imgIndex, 1);
  //             this.setState({ data });
  //           } else {
  //             let data = { ...this.state.data };
  //             data.thumbnail = "";
  //             this.setState({ data });
  //           }
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   };
  // }

  handleImages = (variantIndex) => {
    return (res) => {
      if (res.success) {
        let data = { ...this.state.data };
        let variants = [...this.state.data.variants];

        if (res.public_id) {
          variants[variantIndex].images.push({ public_id: res.public_id });
        }

        variants[variantIndex].images[res.index].name = res.name;

        this.setState({ data });
      } else {
        console.log(res);
      }
    };
  };

  render() {
    return this.state.data.variants.map((variant, index) => {
      return (
        <ImageUploader
          key={index}
          images={this.state.data.variants[index].images}
          callback={this.handleImages(index)}
        />
      );
    });
    // <React.Fragment>
    //   <div id="product">
    //     <label>Title</label>
    //     <input
    //       type="text"
    //       name="title"
    //       value={this.state.data.title}
    //       onChange={this.setValue()}
    //       required
    //     />
    //     <label>Description</label>
    //     <input
    //       type="text"
    //       name="description"
    //       value={this.state.data.description}
    //       onChange={this.setValue()}
    //       required
    //     />
    //     <label>Short Description</label>
    //     <input
    //       type="text"
    //       name="shortDescription"
    //       value={this.state.data.shortDescription}
    //       onChange={this.setValue()}
    //       required
    //     />
    //     <label>Thumbnail</label>
    //     <form id="thumb">
    //       <input type="file" name="image" onChange={this.addImage()} />
    //       <div className="tempImgWrap">
    //         {this.state.data.thumbnail && !this.state.data.thumbnailLoader ? (
    //           <LazyLoadBG
    //             className="tempImg"
    //             transformations="w_400"
    //             style={{}}
    //             public_id={this.state.data.thumbnail.public_id}
    //           >
    //             <p
    //               className="removeImg"
    //               onClick={this.removeImg(this.state.data.thumbnail.path)}
    //             >
    //               Remove image
    //             </p>
    //           </LazyLoadBG>
    //         ) : null}

    //         {this.state.data.thumbnailLoader ? (
    //           <div className="tempImg loader">
    //             <img src={loadingGif} alt="loading..." />
    //           </div>
    //         ) : null}
    //       </div>
    //     </form>

    //     {this.state.data.variants.map((variant, index) => {
    //       return (
    //         <React.Fragment key={`variant${index}`}>
    //           <label>quantity</label>
    //           <input
    //             name="quantity"
    //             value={this.state.data.variants[index].quantity}
    //             onChange={this.setValue(index)}
    //           />
    //           <label>variantType</label>
    //           <input
    //             name="variantType"
    //             value={this.state.data.variants[index].variantType}
    //             onChange={this.setValue(index)}
    //           />
    //           <label>variantValue</label>
    //           <input
    //             name="variantValue"
    //             value={this.state.data.variants[index].variantValue}
    //             onChange={this.setValue(index)}
    //           />
    //           <label>images</label>
    //           <form>
    //             <input
    //               type="file"
    //               name="image"
    //               onChange={this.addImage(index)}
    //             />
    //             <div className="tempImgWrap">
    //               {this.state.data.variants[index].images.map(
    //                 (image, imgIndex) => {
    //                   return image.public_id ? (
    //                     <LazyLoadBG
    //                       key={"tempImg" + imgIndex}
    //                       className="tempImg"
    //                       transformations="w_400"
    //                       style={{}}
    //                       public_id={image.public_id}
    //                     >
    //                       <p
    //                         className="removeImg"
    //                         onClick={this.removeImg(
    //                           image.path,
    //                           index,
    //                           imgIndex
    //                         )}
    //                       >
    //                         Remove image
    //                       </p>
    //                     </LazyLoadBG>
    //                   ) : null;
    //                 }
    //               )}

    //               {this.state.data.variants[index].imagesLoader ? (
    //                 <div className="tempImg loader">
    //                   <img src={loadingGif} alt="loading..." />
    //                 </div>
    //               ) : null}
    //             </div>
    //           </form>
    //           <label>price</label>
    //           <input
    //             name="price"
    //             value={this.state.data.variants[index].price}
    //             onChange={this.setValue(index)}
    //           />
    //           <label>priceCompare</label>
    //           <input
    //             name="priceCompare"
    //             value={this.state.data.variants[index].priceCompare}
    //             onChange={this.setValue(index)}
    //           />
    //           <label>weight</label>
    //           <input
    //             name="weight"
    //             value={this.state.data.variants[index].weight}
    //             onChange={this.setValue(index)}
    //           />
    //         </React.Fragment>
    //       );
    //     })}
    //     <button onClick={this.addVariant}>Add variant</button>

    //     <button onClick={this.saveProduct}>Save Product</button>
    //   </div>
    // </React.Fragment>
  }
}

export default Products;
