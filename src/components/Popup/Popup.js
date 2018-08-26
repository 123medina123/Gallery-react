import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import FlickrService from '../../services/FlickrService';
import './Popup.scss';

class Popup extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    onClose: PropTypes.func,
    onNext: PropTypes.func,
    onPrev: PropTypes.func
  };
  
  render() {
    return (
      <div className="popup"
      style={{
        backgroundImage: `url(${FlickrService.urlFromDto(this.props.dto)})`
      }}
      >
        <div>
          <FontAwesome className="image-icon close" name="times" title="close" onClick={this.props.onClose} />
          <FontAwesome className="image-icon next" name="chevron-right" title="next"  onClick={this.props.onNext} />
          <FontAwesome className="image-icon prev" name="chevron-left" title="prev"  onClick={this.props.onPrev}/>
        </div>
      </div>
    );
  }
}
export default Popup;
