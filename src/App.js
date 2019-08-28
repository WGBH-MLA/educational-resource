import React from 'react';
// import logo from './logo.svg';
import ReactDOM from 'react-dom';

import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';

import update from 'immutability-helper';
import axios from 'axios';

import videojs from 'video.js';

import './App.css';

let TITLE_BOXTYPE = 1;
let TEXTBOX_BOXTYPE = 2;

function createMarkup(html) {
  return {__html: html};
}

class App extends React.Component {
  constructor(props){
    super(props);

    // in realité, this will take project_id and figure out which boxes it needs to loadBox, then throw them into state
    
    // this.state = {
    //   titles: {
    //     "4": {id: 4, data: '', text: 'This is the title text'},
    //   },
    //   textboxes: {
    //     "5": {id: 5, data: '', text: 'This is a text box. And so it goes on and on.'}
    //   },
    //   playlist_items: {
    //     "1": {id: 1, title: 'title1', guid: 'cpb-aacip_37-97kps40n', in_time: 5, out_time: 8},
    //     "2": {id: 2, title: 'title2', guid: 'cpb-aacip_37-20sqvcx0', in_time: 6, out_time: 9},
    //     "3": {id: 3, title: 'title3', guid: 'cpb-aacip_507-gf0ms3kn9k', in_time: 7, out_time: 10},
    //   },

    //   editor_open: false
    // };

    this.state = {
      titles: {},
      textboxes: {},
      playlist_items: {},
      editor_open: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePlaylistItemChange = this.handlePlaylistItemChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.showPreview = this.showPreview.bind(this);
    this.saveEditorState = this.saveEditorState.bind(this);

    this.loadProject = this.loadProject.bind(this);
    this.loadBox = this.loadBox.bind(this);

    // load whatever we got
    // this.loadProject(1);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(this.state)
  //   return true;
  //   // if( this.state.titles !== nextState.titles || this.state.textboxes !== nextState.textboxes || this.state.playlist_items !== nextState.playlist_items) {
  //   //   return true;
  //   // } else {
  //   //   return false;
  //   // }
  // }

  newProject() {
    console.log("hello")
    // delete everythign and get new elements
    axios.get('http://localhost:3001/init_project').then( (resp) => {
      console.log('got that dang newproject ' + resp.status)
      console.log(resp)

      this.setState({titles: {}, textboxes: {}, playlist_items: {}});
      this.loadProject(1);
    });    
  }

  loadProject(id) {
    axios.get('http://localhost:3001/project/'+id).then( (resp) => {
      console.log('got that dang loadproject ' + resp.status)
      console.log(resp)

      let box_ids = resp.data;
      console.log(box_ids)
      if(!box_ids) box_ids = [];

      // needs arrow to presever this behavior inside this block!
      box_ids.forEach( (box_id) => {
        this.loadBox(box_id);
      });
    });
  }

  saveProject() {
    let titles = this.state.titles;
    let textboxes = this.state.textboxes;
    
    // how u struckchur
    // let playlist_items = this.state.playlist_items;

    Object.keys(titles).forEach(function(title_id, index) {
      this.saveBox(TITLE_BOXTYPE, title_id, titles[title_id].data, titles[title_id].text);
    });

    Object.keys(textboxes).forEach(function(textbox_id, index) {
      this.saveBox(TEXTBOX_BOXTYPE, textbox_id, textboxes[textbox_id].data, textboxes[textbox_id].text);
    });
  }

  loadBox(id) {
    console.log(id+"i tried!")
    axios.get('http://localhost:3001/boxes/'+id).then( (resp) => {
      console.log('got that dang loadbox ' + resp.status)
      console.log(resp)
      let box = resp.data;
      let type = box.box_type === TITLE_BOXTYPE ? 'titles' : 'textboxes';
      this.setState({[type]: update(this.state[type],
          {[id]: {$set: box } } )
      });

    });
  }

  saveBox(box_type, id, data, text) {
    if(id){
      
      axios.patch('http://localhost:3001/boxes/'+id, {box_type: box_type, data: data, text: text}).then( (resp) => {
        console.log('got that dang response ' + resp.status)
        console.log(resp)
      });

    } else {
      // this will only get called when initializing the project...
      axios.post('http://localhost:3001/boxes', {box_type: box_type, data: data, text: text}).then( (resp) => {
        console.log('got that dang response ' + resp.status)
        console.log(resp)
      });
    }
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

  saveEditorState(id, json_data, box_type) {
    console.log('Save Editor Staet: ')
    console.log(id)
    console.log(json_data)
    this.setState({[box_type]: update(this.state[box_type],
        {[id]: 
          {data: {$set: json_data }
        }
      })
    });
  
  }

  showPreview(id, html, box_type) {
    console.log('Show Preview: ')
    console.log(id)
    console.log(html)
    this.setState({[box_type]: update(this.state[box_type],
        {[id]: 
          {text: {$set: html }
        }
      })
    });

  }

  render() {
    // console.log(this.state.playlist_items)

    let layout;
    if(Object.keys(this.state.titles).length > 0 && Object.keys(this.state.textboxes).length > 0) {
      layout = (
        <Layout
          title={ Object.entries(this.state.titles)[0][1] }
          textbox={ Object.entries(this.state.textboxes)[0][1] }
          playlist_items={ this.state.playlist_items }
        />
      );
    }

    return (
      <div>
        <div id="menu-bar">
          <div className="spacer">
            
            <button id="new-project" onClick={ () => this.newProject() } className="menu-item">
              New Project
            </button>

            <button id="edit" onClick={ () => this.toggleEditor() } className="menu-item">
              Edit
            </button>

            <button className="menu-item">
              Save
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
                saveEditorState={ this.saveEditorState }
              />
            </div>
          </div>

          <div id="viewer" className={ this.paneClasses('viewer') }>
            <div className="spacer">
        
              <h2>Preview</h2>

              { layout }
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

    let editor_data;
    if (this.props.data) {
      editor_data = EditorState.createWithContent(convertFromRaw(this.props.data))
    } else {
      editor_data = EditorState.createEmpty();
    }

    this.state = {editorState: editor_data};
    // this.onChange = (editorState) => this.setState({editorState});
    this.onChange = (editorState) => {

      this.setState({editorState}, () => {

        // this block fires after setstate has compelted
        let contentState = this.state.editorState.getCurrentContent();
        // grab current state of editor
        this.props.saveEditorState( this.props.object_id, this.getEditorData(contentState), this.props.box_type );  
        // grab current output of editor
        this.props.showPreview( this.props.object_id, this.getPreview(contentState), this.props.box_type );  
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

  getPreview(content) {
    return stateToHTML(content);;
  }

  getEditorData(content) {
    return JSON.stringify(convertToRaw(content));
  }

  render() {
    return (
      <div>
        <Editor
          editorState={ this.state.editorState }
          onChange={ this.onChange }
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

    let title_data;
    if(this.props.titles[id]) {
      title_data = this.props.titles[id].data
    }

    return (
      <div key={ id }>
        <label>
          <div>
            Edit Title { id }
          </div>
          
          <div className="edit-box">
            <BoxEditor
              object_id={ id }
              data={ title_data }

              box_type={ 'titles' }

              showPreview={ this.props.showPreview }
              saveEditorState={ this.props.saveEditorState }
            />
          </div>
        </label>
      </div>
    );
  }
  
  renderTextboxEditor(id, text) {
   // return (
   //    <div key={ id }>
   //      <label>
   //        <div>
   //          Edit Textbox { id }
   //        </div>
   //        <div>
   //          <input id={ id }
   //            type="text"
   //            placeholder={ 'textbox-' +id }
   //            value={ this.props.textboxes[id].text }
   //            onChange={ (e) => this.props.handleChange(e, 'textboxes') }
   //          />
   //        </div>
   //      </label>
   //    </div>
   //  ); 

    let textbox_data;
    if(this.props.textboxes[id]) {
      textbox_data = this.props.textboxes[id].data
    }

    return (
      <div key={ id }>
        <label>
          <div>
            Edit Textbox { id }
          </div>
          
          <div className="edit-box">
            <BoxEditor
              object_id={ id }
              data={ textbox_data }

              box_type={ 'textboxes' }

              showPreview={ this.props.showPreview }
              saveEditorState={ this.props.saveEditorState }
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
    const videoJsOptions = {
      autoplay: false,
      controls: true,
      sources: [{
        src: 'https://avalon-mediacache-test.s3.amazonaws.com/anamorphTEST.mp4',
        type: 'video/mp4'
      }]
    }

    let template = '';

    if(this.props.title && this.props.title.id){
      template = (
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
            <VideoPlayer { ...videoJsOptions } />
            <Playlist playlist_items={ this.props.playlist_items } />;
          </div>
        </div>
      );
    }
    return template;
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
    <p className="textbox" onClick={props.onClick} dangerouslySetInnerHTML={ createMarkup(props.text) } />
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

class VideoPlayer extends React.Component {
  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log('onPlayerReady', this)
    });
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div> 
        <div data-vjs-player>
          <video ref={ node => this.videoNode = node } className="video-js"></video>
        </div>
      </div>
    )
  }
}



export default App;
