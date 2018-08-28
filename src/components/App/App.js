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
      showStars: false
    };
  }

allStarHandler = ()=>{
  this.setState(prevState => ({
      showStars: !prevState.showStars
    }));
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={event => this.setState({tag: event.target.value})} value={this.state.tag}/>
          <FontAwesome  className="stars" style={{color: this.state.showStars ? 'yellow' : 'white'}} name="star" title="star"  onClick={this.allStarHandler}/>
        </div>
        <Gallery tag={this.state.tag} showStars={this.state.showStars}/>
      </div>
    );
  }
}

export default App;
