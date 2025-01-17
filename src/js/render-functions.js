export function createGalleryMarkup(images) {
  return images.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => `
    <a href="${largeImageURL}" class="gallery-item" title="${tags}">
      <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="card-info">
          <p><b>Likes:</b> ${likes}</p>
          <p><b>Views:</b> ${views}</p>
          <p><b>Comments:</b> ${comments}</p>
          <p><b>Downloads:</b> ${downloads}</p>
        </div>
      </div>
    </a>
  `).join('');
}




export function renderGallery(gallery, markup) {
  gallery.innerHTML = markup;
}
