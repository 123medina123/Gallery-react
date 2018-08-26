import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import Popup from '../Popup';
import FlickrService from '../../services/FlickrService';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      popupIndex: -1
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    FlickrService.fetchImages(tag)
      .then(images => {
        this.setState(prevState => ({
          images: [
            ...prevState.images,
            ...images
          ]
        }));
      });
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillUnmount() {
     window.removeEventListener('resize', this.handleResize);
   }

   handleResize = () => {
     this.setState({
       galleryWidth: this.getGalleryWidth()
     });
   };
   
  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  popupCloseHandler = () => {
    this.setState({
      popupIndex: -1
    });
  };

  popupNextHandler = () => {
    this.setState(prevState => ({
      popupIndex: prevState.popupIndex + 1
    }));
  };

  popupPrevHandler = () => {
    this.setState(prevState => ({
      popupIndex: prevState.popupIndex - 1
    }));
  };

  renderPopup = () => {
    const {popupIndex, images} = this.state;
    return popupIndex > -1 && (
      <Popup
        dto={images[popupIndex]}
        onClose={this.popupCloseHandler}
        onNext={this.popupNextHandler}
        onPrev={this.popupPrevHandler}
      />
    );
  };

  deleteHandler = index => {
    this.setState(prevState => ({
      images: [
        ...prevState.images.slice(0, index),
        ...prevState.images.slice(index + 1)
      ]
    }));
  };

  expandHandler = index => {
    this.setState({
      popupIndex: index
    });
  };

  renderImage = (dto, index) => (
    <Image
      key={`image-${dto.id}`}
      dto={dto}
      galleryWidth={this.state.galleryWidth}
      onDelete={() => this.deleteHandler(index)}
      onExpand={() => this.expandHandler(index)}
    />
  );

  render() {
    return (
      <div className="gallery-root">
      {this.renderPopup()}
      {this.state.images.map(this.renderImage)}
      </div>
    );
  }
}

export default Gallery;
