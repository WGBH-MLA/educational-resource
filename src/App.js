import React from 'react';
// import logo from './logo.svg';
import update from 'immutability-helper';

import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      titles: {
        "4": {id: 4, text: 'This is the title text'},
      },
      textboxes: {
        "5": {id: 5, text: 'This is a text box. And so it goes on and on.'}
      },
      records: [
        {id: 1, title: 'title1'},
        {id: 2, title: 'title2'},
        {id: 3, title: 'title3'},
      ]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  // for handling state of text inputs!
  handleChange(event, type) {
    // this.setState({value: event.target.value});
    let val = event.target.value;
    let id = event.target.id;

    // console.log(type)
    // console.log(event)

    // update just the key we wanna change

    this.setState({[type]: update(this.state[type],
        {[id]: 
          {text: {$set: val }
        }
      })
    });
  }

  handleSubmit(event) {
    alert('wow!');
    event.preventDefault();
  }

  render() {
    // console.log(this.state.records)
    return (
      <div className="container">
        <div id="editor" className="half-pane open">
          <h2>Edit</h2>
          
          <Editor
            handleChange={ this.handleChange }
            titles={ this.state.titles }
            textboxes={ this.state.textboxes }
            records={ this.state.records }
          />
        </div>

        <div id="viewer" className="half-pane">
          <h2>Preview</h2>

          <Layout
            title={ this.state.titles["4"] }
            textbox={ this.state.textboxes["5"] }
            records={ this.state.records }
          />
        </div>
      </div>

    );
  }
}

class Editor extends React.Component {
  constructor(props){
    super(props);
  }

  renderTitleEditor(id, title) {
    return (
      <div key={ id }>
        <label>Edit Title { id } <input id={ id } type="text" placeholder={ 'title-' +id } onChange={ (e) => this.props.handleChange(e, 'titles') } /></label>
      </div>
    );
  }
  
  renderTextboxEditor(id, text) {
   return (
      <div key={ id }>
        <label>Edit Textbox { id } <input id={ id } type="text" placeholder={ 'textbox-' +id } onChange={ (e) => this.props.handleChange(e, 'textboxes') } /></label>
      </div>
    ); 
  }

  render(){
    let title_editors;
    let textbox_editors;
    
    let titles_keys = Object.keys(this.props.titles);
    if(titles_keys.length > 0){
      title_editors = titles_keys.map((title_key, index) => this.renderTitleEditor(this.props.titles[title_key].id, this.props.titles[title_key].text) )
    }
   
    let textboxes_keys = Object.keys(this.props.textboxes);
    if(textboxes_keys.length > 0){
      textbox_editors = textboxes_keys.map((textbox_key, index) => this.renderTextboxEditor(this.props.textboxes[textbox_key].id, this.props.textboxes[textbox_key].text) )
    }

    return (
      <div className="container">
        <div>
          { title_editors }
        </div>

        <div>
          { textbox_editors }
        </div>

      </div>
    );
  }

}


class Layout extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="container">
        <div className="half-pane">
          <Title id={ this.props.title.id } text={ this.props.title.text } />
          <Textbox id={ this.props.textbox.id } text={ this.props.textbox.text } />
        </div>
        
        <div className="half-pane">
          <Playlist records={ this.props.records } />;
        </div>
      </div>
    );
  }

}

function Title(props) {
  return (
    <h1 className="title" onClick={props.onClick}>
      { props.text }
    </h1>
  );
}

function Textbox(props) {
  return (
    <p className="textbox" onClick={props.onClick}>
      { props.text }
    </p>
  );
}

// state for playhead?
class Playlist extends React.Component {
  constructor(props){
    super(props)
  }

  renderPlaylistItem(record, key){
    return (
      <div id={ record.id } key={ key } className="playlist-item">
        { record.title }
      </div>
    );
  }

  render() {

    return (
      <div>
        { this.props.records.map((record, index) => this.renderPlaylistItem(record, index) ) }
      </div>
    );
  }
}

export default App;
