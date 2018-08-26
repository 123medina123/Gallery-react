import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import FlickrService from '../../services/FlickrService';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    onDelete: PropTypes.func,
    onExpand: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      deg: 0
    };
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.floor(galleryWidth / targetSize);
    return galleryWidth / imagesPerRow;
  }

  rotateHandler = () => {
    this.setState({
      deg: this.state.deg + 90
    });
  };

  render() {
    const size = this.calcImageSize();
    const rootStyles = {
      backgroundImage: `url(${FlickrService.urlFromDto(this.props.dto)})`,
      width: size,
      height: size,
      transform: `rotate(${this.state.deg}deg)`,
      opacity: 0;
      -webkit-animation: fadein 2s, /* Safari, Chrome and Opera > 12.1 */
           -moz-animation: fadein 2s, /* Firefox < 16 */
            -ms-animation: fadein 2s, /* Internet Explorer */
             -o-animation: fadein 2s, /* Opera < 12.1 */
                animation: fadein 2s,
    };
    const innerStyles = {
      transform: `rotate(-${this.state.deg}deg)`
    };

    return (
      <div className="image-root" style={rootStyles}>
        <div style={innerStyles}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.rotateHandler}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={this.props.onDelete}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.props.onExpand}/>
        </div>
      </div>
    );
  }
}

export default Image;
