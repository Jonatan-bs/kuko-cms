import React, { Component } from "react";
import "./Create.css";
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
            required
          />
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={this.state.data.description}
            onChange={this.setValue()}
            required
          />
          <label>Short Description</label>
          <input
            type="text"
            name="shortDescription"
            value={this.state.data.shortDescription}
            onChange={this.setValue()}
            required
          />
          <label>Thumbnail</label>
          <form>
            <div className="tempImgWrap">
              {this.state.data.thumbnail ? (
                <div
                  className="tempImg"
                  style={{
                    backgroundImage:
                      "url(http://localhost:4000/uploads/" +
                      this.state.data.thumbnail.filename +
                      ")",
                  }}
                >
                  <p onClick={this.removeImg(this.state.data.thumbnail.path)}>
                    Remove image
                  </p>
                </div>
              ) : null}
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
                            style={{
                              backgroundImage:
                                "url(http://localhost:4000/uploads/" +
                                image.filename +
                                ")",
                            }}
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

          <button onClick={this.saveProduct}>Save Product</button>
        </div>
      </React.Fragment>
    );
  }
}

export default Products;
