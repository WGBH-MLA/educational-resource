import React from 'react';
// import logo from './logo.svg';
import ReactDOM from 'react-dom';

import {Editor, EditorState, RichUtils, convertToRaw} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';

import update from 'immutability-helper';

import './App.css';

function createMarkup(html) {
  return {__html: html};
}


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
        "1": {id: 1, title: 'title1', guid: 'cpb-aacip_37-97kps40n', in_time: 5, out_time: 8},
        "2": {id: 2, title: 'title2', guid: 'cpb-aacip_37-20sqvcx0', in_time: 6, out_time: 9},
        "3": {id: 3, title: 'title3', guid: 'cpb-aacip_507-gf0ms3kn9k', in_time: 7, out_time: 10},
      },


      editor_open: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePlaylistItemChange = this.handlePlaylistItemChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.showPreview = this.showPreview.bind(this);
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

  toggleEditor() {
    this.setState({editor_open: !this.state.editor_open })
    console.log(this.state.editor_open)
  }

  paneClasses(element_name) {

    let editor_open = this.state.editor_open;
    let classes;
    if(editor_open) {
      classes = 'half-pane'
    } else {
      classes = element_name === 'editor' ? 'hidden' : 'full-pane';
    }

    return classes;
  }

  showPreview(id, html) {
    console.log(id)
    console.log(html)
    this.setState({titles: update(this.state.titles,
        {[id]: 
          {text: {$set: html }
        }
      })
    });

  }

  render() {
    // console.log(this.state.playlist_items)
    return (
      <div>
        <div id="menu-bar">
          <div className="spacer">
            <button id="edit" onClick={ () => this.toggleEditor() } className="menu-item">
              Edit
            </button>

            <button className="menu-item">
              Save
            </button>

            <button className="menu-item">
              thing
            </button>

          </div>
        </div>

        <div className="container">
          <div id="editor" className={ this.paneClasses('editor') }>
            <div className="spacer">
              <h2>Edit</h2>
              
              <PageEditor
                handleChange={ this.handleChange }
                handlePlaylistItemChange={ this.handlePlaylistItemChange }
                titles={ this.state.titles }
                textboxes={ this.state.textboxes }
                playlist_items={ this.state.playlist_items }

                showPreview={ this.showPreview }
              />
            </div>
          </div>

          <div id="viewer" className={ this.paneClasses('viewer') }>
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
      </div>
    );
  }
}

class BoxEditor extends React.Component {
    constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    // this.onChange = (editorState) => this.setState({editorState});
    this.onChange = (editorState) => {

      this.setState({editorState}, () => {
        // this fires after setstate has compelted
        this.props.showPreview( this.props.object_id, this.getPreview(this.props.object_id) );  

        return true;

      });
      
    };
  }

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command)
    if (newState) {
        this.onChange(newState);
        return 'handled';
    }
    return 'not-handled';
  }

  getPreview(id) {
    let contentState = this.state.editorState.getCurrentContent();
    let html = stateToHTML(contentState);
    return html;
  }

  render() {
    return (
      <div>
        <Editor
          editorState={ this.state.editorState }
          onChange={ this.onChange }
          // onKeyUp={ () => this.props.showPreview( this.getPreview(this.props.object_id) ) }
          handleKeyCommand={ this.handleKeyCommand }
        />
      </div>
    );
  }
}


class PageEditor extends React.Component {
  constructor(props){
    super(props);
  }

  renderTitleEditor(id, title) {
    // return (
    //   <div key={ id }>
    //     <label>
    //       <div>
    //         Edit Title { id }
    //       </div>
          
    //       <div>
          
    //         <input
    //           id={ id }
    //           type="text"
    //           placeholder={ 'title-' +id }
    //           value={ this.props.titles[id].text }
    //           onChange={ (e) => this.props.handleChange(e, 'titles') } 
    //         />
    //       </div>
    //     </label>
    //   </div>
    // );


    return (
      <div key={ id }>
        <label>
          <div>
            Edit Title { id }
          </div>
          
          <div className="edit-box">
            <BoxEditor
              object_id={ id }
              showPreview={ this.props.showPreview }
            />
          </div>
        </label>
      </div>
    );
  }
  
  renderTextboxEditor(id, text) {
   return (
      <div key={ id }>
        <label>
          <div>
            Edit Textbox { id }
          </div>
          <div>
            <input id={ id }
              type="text"
              placeholder={ 'textbox-' +id }
              value={ this.props.textboxes[id].text }
              onChange={ (e) => this.props.handleChange(e, 'textboxes') }
            />
          </div>
        </label>
      </div>
    ); 
  }
  
  renderPlaylistItemEditor(id, text, guid, in_time, out_time) {
   return (
      <div key={ id }>
        <label>
          <div>
            Edit Playlist Item { id }
          </div>
          
          <div>
            <input
              id={ id }
              type="text"
              name="in_time"
              placeholder={ 'in-' +id }
              value={ this.props.playlist_items[id].in_time }
              onChange={ (e) => this.props.handlePlaylistItemChange(e, id) }
            />
            <input
              id={ id }
              type="text"
              name="out_time"
              placeholder={ 'out-textbox-' +id }
              value={ this.props.playlist_items[id].out_time }
              onChange={ (e) => this.props.handlePlaylistItemChange(e, id) }
            />
            <input
              id={ id }
              type="text"
              name="guid"
              placeholder={ 'guid-textbox-' +id }
              value={ this.props.playlist_items[id].guid }
              onChange={ (e) => this.props.handlePlaylistItemChange(e, id) }
            />
            <input
              id={ id }
              type="text"
              name="title"
              placeholder={ 'title-textbox-' +id }
              value={ this.props.playlist_items[id].title }
              onChange={ (e) => this.props.handlePlaylistItemChange(e, id) }
            />

          </div>

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

    console.log(this.props.playlist_items)
    let playlist_items_keys = Object.keys(this.props.playlist_items);
    console.log(playlist_items_keys)
    if(playlist_items_keys.length > 0){
        
      playlist_item_editors = playlist_items_keys.map((playlist_item_key) => this.renderPlaylistItemEditor(        
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
          <Title
            id={ this.props.title.id }
            text={ this.props.title.text }
          />
          <Textbox
            id={ this.props.textbox.id }
            text={ this.props.textbox.text }
          />
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
    // lol!
    <h1 className="title" onClick={props.onClick} dangerouslySetInnerHTML={ createMarkup(props.text) } />
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
        <div className="playlist-item-row">
          <h3>
            { playlist_item.title }
          </h3>
        </div>

        <div className="playlist-item-row">
          
          <span className="playlist-item-guid">
            { playlist_item.guid }
          </span>

          <span className="playlist-item-inout">
            { playlist_item.in_time } - 
            { playlist_item.out_time }
          </span>

        </div>
      </div>
    );
  }

  render() {
    let playlist_items_keys = Object.keys(this.props.playlist_items);
    console.log(playlist_items_keys)
    return (
      <div>
        { playlist_items_keys.map((playlist_item_key, index) => this.renderPlaylistItem(this.props.playlist_items[playlist_item_key], index) ) }
      </div>
    );
  }
}

export default App;
