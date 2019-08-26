import React from 'react';
// import logo from './logo.svg';
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

  }


  // for handling state of text inputs!
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    // alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }



  render() {
    console.log(this.state.records)
    return (
      <div className="container">
        <div id="editor" className="half-pane open">
          <h2>Edit</h2>
          
          <Editor
            titles={ this.state.titles }
            textboxes={ this.state.textboxes }
            records={ this.state.records }
          />
        </div>
        <div id="viewer" className="half-pane">
          <h2>Preview</h2>

          <Layout
            title={ this.state.titles[0] }
            textbox={ this.state.textboxes[0] }
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
      <div>
        <label>Edit Title { id } <input id={ id } type="text" placeholder={ 'title-' +id } /></label>
      </div>
    );
  }
  
  renderTextboxEditor(id, text) {
   return (
      <div>
        <label>Edit Textbox { id } <input id={ id } type="text" placeholder={ 'title-' +id } /></label>
      </div>
    ); 
  }

  render(){
    let title_editors;
    let textbox_editors;

    if(this.props.titles.length > 0){
      title_editors = this.props.titles.map((title, index) => this.renderTitleEditor(title.id, title.text) )
    }
    
    if(this.props.textboxes.length > 0){
      textbox_editors = this.props.textboxes.map((textbox, index) => this.renderTextboxEditor(textbox.id, textbox.text) )
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
