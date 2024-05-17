const axios = require('axios').default;

const instance = axios.create({
  timeout: 20000,
});

async function fetchPosts(params) {
  const { start = 0, limit = 10 } = params || {};
  const { data: posts } = await instance.get(
    'https://jsonplaceholder.typicode.com/posts',
    {
      params: {
        _start: start,
        _limit: limit,
      },
    },
  );
  return posts;
}

async function fetchPhotosByAlbumId(albumId) {
  const { data: photos } = await instance.get(
    `https://jsonplaceholder.typicode.com/albums/${albumId}/photos`,
  );
  return photos;
}

module.exports = { fetchPosts, fetchPhotosByAlbumId };
