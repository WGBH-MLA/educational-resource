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
      playlist_items: {
        "6": {id: 1, title: 'title1', guid: 'cpb-aacip_37-97kps40n', in_time: 5, out_time: 8},
        "7": {id: 2, title: 'title2', guid: 'cpb-aacip_37-20sqvcx0', in_time: 6, out_time: 9},
        "8": {id: 3, title: 'title3', guid: 'cpb-aacip_507-gf0ms3kn9k', in_time: 7, out_time: 10},
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePlaylistItemChange = this.handlePlaylistItemChange.bind(this);
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
  
  // generalized to take whichever field's achangin
  handlePlaylistItemChange(event, id) {

    // update just the key we wanna change
    this.setState({playlist_items: update(this.state.playlist_items,
        {[id]: 
          {[event.target.name]: {$set: event.target.value }
        }
      })
    });
  }

  handleSubmit(event) {
    alert('wow!');
    event.preventDefault();
  }

  render() {
    // console.log(this.state.playlist_items)
    return (
      <div className="container">
        <div id="editor" className="half-pane open">
          <div className="spacer">
            <h2>Edit</h2>
            
            <Editor
              handleChange={ this.handleChange }
              titles={ this.state.titles }
              textboxes={ this.state.textboxes }
              playlist_items={ this.state.playlist_items }
            />
          </div>
        </div>

        <div id="viewer" className="half-pane">
          <div className="spacer">
      
            <h2>Preview</h2>

            <Layout
              title={ this.state.titles["4"] }
              textbox={ this.state.textboxes["5"] }
              playlist_items={ this.state.playlist_items }
            />
          </div>
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
  
  renderPlaylistItemEditor(id, text, guid, in_time, out_time) {
   return (
      <div key={ id }>
        <label>Edit Playlist Item
          <input id={ id } type="text" name="in" placeholder={ 'in-textbox-' +id } onChange={ (e) => this.props.handlePlaylistItemChange(e, id) } />
          <input id={ id } type="text" name="out" placeholder={ 'in-textbox-' +id } onChange={ (e) => this.props.handlePlaylistItemChange(e, id) } />
          <input id={ id } type="text" name="guid" placeholder={ 'in-textbox-' +id } onChange={ (e) => this.props.handlePlaylistItemChange(e, id) } />
          <input id={ id } type="text" name="title" placeholder={ 'in-textbox-' +id } onChange={ (e) => this.props.handlePlaylistItemChange(e, id) } />

        </label>
      </div>
    ); 
  }

  render(){
    let title_editors;
    let textbox_editors;
    let playlist_item_editors;
    
    let titles_keys = Object.keys(this.props.titles);
    if(titles_keys.length > 0){
      title_editors = titles_keys.map((title_key, index) => this.renderTitleEditor(this.props.titles[title_key].id, this.props.titles[title_key].text) )
    }
   
    let textboxes_keys = Object.keys(this.props.textboxes);
    if(textboxes_keys.length > 0){
      textbox_editors = textboxes_keys.map((textbox_key, index) => this.renderTextboxEditor(this.props.textboxes[textbox_key].id, this.props.textboxes[textbox_key].text) )
    }

    let playlist_items_keys = Object.keys(this.props.playlist_items);
    if(playlist_items_keys.length > 0){
      playlist_item_editors = playlist_items_keys.map((playlist_item_key, index) => this.renderPlaylistItemEditor(
        this.props.playlist_items[playlist_item_key].id,
        this.props.playlist_items[playlist_item_key].text,
        this.props.playlist_items[playlist_item_key].guid,
        this.props.playlist_items[playlist_item_key].in_time,
        this.props.playlist_items[playlist_item_key].out_time,
      ) )
    }

    return (
      <div className="container">
        <div>
          { title_editors }
        </div>

        <div>
          { textbox_editors }
        </div>

        <div>
          { playlist_item_editors }
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
          <Playlist playlist_items={ this.props.playlist_items } />;
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

  renderPlaylistItem(playlist_item, key){
    return (
      <div id={ playlist_item.id } key={ key } className="playlist-item">
        { playlist_item.title } - 
        { playlist_item.guid } - 
        { playlist_item.in } - 
        { playlist_item.out } - 
      </div>
    );
  }

  render() {
    let playlist_items_keys = Object.keys(this.props.playlist_items);
    return (
      <div>
        { playlist_items_keys.map((playlist_item_key, index) => this.renderPlaylistItem(this.props.playlist_items[playlist_item_key], index) ) }
      </div>
    );
  }
}

export default App;
