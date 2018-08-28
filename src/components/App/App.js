import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import FontAwesome from 'react-fontawesome';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'art',
      showSaved: false
    };
  }

allSavedHandler = ()=>{
  this.setState(prevState => ({
      showSaved: !prevState.showSaved
    }));
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={event => this.setState({tag: event.target.value})} value={this.state.tag}/>
          <FontAwesome  className="save" style={{color: this.state.showSaved ? 'blue' : 'white'}} name="save" title="save"  onClick={this.allSavedHandler}/>
        </div>
        <Gallery tag={this.state.tag} showSaved={this.state.showSaved}/>
      </div>
    );
  }
}

export default App;
