import React from 'react';
import PropTypes from 'prop-types';
import {DragSource, DropTarget} from 'react-dnd';
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

  saveClickHandler = () => {
    const {isSaved,onSaved} = this.props;
    onSaved(!isSaved)
  }

  render() {
    const {dto,onDelete,onExpand,connectDragSource,
          connectDropTarget,
          isDragging,
          isHovered,isSaved} = this.props;
    const size = this.calcImageSize();
    const rootStyles = {
      backgroundImage: `url(${FlickrService.urlFromDto(dto)})`,
      width: size,
      height: size,
      transform: `rotate(${this.state.deg}deg)`,
    };
    const innerStyles = {
      transform: `rotate(-${this.state.deg}deg)`
    };
    const saveStyle ={
      color: isSaved  ? 'blue' : 'white'
    };
    const classes = ['image-root'];
    if (isHovered) {
      classes.push('hovered');
    }
    if (isDragging) {
      classes.push('dragging');
    }
    return connectDropTarget(connectDragSource((
      <div className={classes.join(' ')} style={rootStyles}>
        <div style={innerStyles}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.rotateHandler}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={onDelete}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={onExpand}/>
          <FontAwesome className="image-icon" style={saveStyle} name="save" title="save"  onClick={this.saveClickHandler}/>
        </div>
      </div>
    )));
  }
}

export default DragSource(
  'Image',
  {
    beginDrag: props => ({
      index: props.dto.id
    }),
    endDrag: (props, monitor) => {
      props.onReorder(props.dto.id, monitor.getDropResult().index);
    }
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(
  DropTarget(
    'Image',
    {
      drop: props => ({
        index: props.dto.id
      })
    },
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isHovered: monitor.isOver()
    })
  )(Image)
);
