import '../static/css/App.css';
import React, { Component } from "react";
import HomePage from "./HomePage";

export default class App extends Component{
  constructor(props){
      super(props);
  }

  render(){
      return (
          <div className="center">
              <HomePage/>
          </div>
      );
  }
}