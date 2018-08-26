import axios from 'axios';

class FlickrService {
  static urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  static fetchImages(tag,page) {
      const baseUrl = 'https://api.flickr.com/';
      const imagesUrl = 'services/rest/?method=flickr.photos.search' +
        '&api_key=522c1f9009ca3609bcbaf08545f067ad' +
        '&tag_mode=any' +
        '&per_page=100' +
        '&format=json' +
        '&safe_search=1' +
        '&nojsoncallback=1' +
        `&tags=${tag}` +
        `&page=${page}`;

      return axios({
        url: imagesUrl,
        baseURL: baseUrl,
        method: 'GET'
      })
        .then(res => res.data)
        .then(res => {
          if (
            res &&
            res.photos &&
            res.photos.photo &&
            res.photos.photo.length > 0
          ) {
            return res.photos.photo;
          }
          return [];
        });
  }
}

export default FlickrService;
