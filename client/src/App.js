import React, { Component } from "react";

import "./App.css";
import ImageLibrary from "./components/ImageLibrary/ImageLibrary";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Product from "./components/Product";
import MainNav from "./components/Nav-main/Nav-main";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

class App extends Component {
  state = {
    auth: true,
    user: {},
  };
  // check user auth
  // componentDidMount = () => {
  //   fetch("http://localhost:4000/user/auth")
  //     .then((res) => res.json())
  //     .then((res) => {
  //       console.log(res);
  //       this.setState({ auth: res.auth });
  //     })
  //     .catch((res) => {
  //       console.log(res);
  //     });
  // };

  updateState = (obj) => {
    this.setState(obj);
  };

  MainPage = () => {
    return (
      <React.Fragment>
        <MainNav />
        <section className="mainContent">
          <Route exact path="/imageLibrary" component={ImageLibrary} />
          <Route exact path="/product" component={Product.Retrieve} />
          <Route exact path="/product/create" component={Product.Create} />
          <Route exact path="/product/:id" component={Product.Update} />
        </section>
      </React.Fragment>
    );
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/login"
            render={() =>
              this.state.auth ? (
                <Redirect to="/" />
              ) : (
                <Login updateState={this.updateState.bind(this)} />
              )
            }
          />
          <Route
            exact
            path="/register"
            render={() =>
              this.state.auth ? (
                <Redirect to="/" />
              ) : (
                <Register updateState={this.updateState.bind(this)} />
              )
            }
          />

          <Route
            render={() =>
              this.state.auth ? <this.MainPage /> : <Redirect to="/login" />
            }
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
