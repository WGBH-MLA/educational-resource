import React from 'react';
import Component from 'react'
// import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      titles: {},
      textboxes: {},
      records: {},
    };

  }



  render() {
    return(


    );
  }
}

class Editor extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      
    );
  }

}


class Layout extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="half-pane">
        { this.props.title }
        { this.props.textbox }
      </div>
      
      <div className="half-pane">
        { this.props.playlist }
      </div>
    );
  }

}

function Title(props) {
  return (
    <h1 className="title" onClick={props.onClick}>
      {props.text}
    </h1>
  );
}

function Textbox(props) {
  return (
    <p className="textbox" onClick={props.onClick}>
      {props.text}
    </p>
  );
}

// state for playhead?
class Playlist extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      this.props.records.map((record) => 

      );
    );
  }
}

export default App;
