import React from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';
import Image from '../Image';
import Popup from '../Popup';
import FlickrService from '../../services/FlickrService';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  page = 1;
  loading = false;

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      popupIndex: -1,
      savedImages:[]
    };
  }

  handleReorder = (from, to) => {
     this.setState(prevState => {
       const images = prevState.images.slice();
       const temp = images[this.findImageIndex(from)];
       images.splice(this.findImageIndex(from), 1);
       images.splice(this.findImageIndex(to), 0, temp);
       return {
         images
       };
     });
   };

  findImageIndex(id) {
     return this.state.images.findIndex(image => image.id == id);
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    this.loading = true;
    FlickrService.fetchImages(tag,this.page)
      .then(images => {
        this.setState(prevState => ({
          images: [
            ...prevState.images,
            ...images
          ]
        }));
        this.loading = false;
      });
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillUnmount() {
     window.removeEventListener('resize', this.handleResize);
     window.removeEventListener('scroll', this.handleScroll);
   }

  componentWillReceiveProps(props) {
     this.page = 1;
     if(!props.showSaved) this.setState({images: []});
     this.getImages(props.tag);
   }

  handleResize = () => {
     this.setState({
       galleryWidth: this.getGalleryWidth()
     });
   };

  shouldLoadMore() {
     return window.innerHeight + window.pageYOffset >=
     document.body.offsetHeight - 500;
   }

  handleScroll = () => {
     if (!this.loading && this.shouldLoadMore()) {
       this.page++;
       this.getImages(this.props.tag);
     }
   };

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
        showPrevButton={popupIndex > 0  && !this.props.showSaved}
        showNextButton={popupIndex < images.length - 1  && !this.props.showSaved}
      />
    );
  };

  handleSave = (index,savedIndex, isSaved) => {
    if(isSaved){
    this.setState(prevState => ({
      savedImages: [
        ...prevState.savedImages,
          prevState.images[index]
      ]
      }));
    }
    else{
      this.setState(prevState => ({
        savedImages: [
          ...prevState.savedImages.slice(0, savedIndex),
          ...prevState.savedImages.slice(savedIndex + 1)
        ]
        }));
    }
  }

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

  renderImage = (dto) => {
    const index = this.state.images.findIndex(image => image.id == dto.id);
    const savedIndex = this.state.savedImages.findIndex(image => image.id == dto.id);
    return(
    <Image
      key={`image-${dto.id}`}
      dto={dto}
      galleryWidth={this.state.galleryWidth}
      onDelete={() => this.deleteHandler(index)}
      onExpand={() => this.expandHandler(index)}
      onReorder={this.handleReorder}
      onSaved={(isSaved) => this.handleSave(index,savedIndex,isSaved)}
      isSaved={savedIndex > -1}
    />
  )};

  render() {
    return (
      <div className="gallery-root">
      {this.renderPopup()}
      {this.props.showSaved ?  this.state.savedImages.map(this.renderImage) : this.state.images.map(this.renderImage)}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Gallery);
