const express = require('express');
const { fetchPosts, fetchPhotosByAlbumId } = require('./posts.service');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { start = 0, limit = 10 } = req.query;
    const posts = await fetchPosts({
      start: parseInt(start, 10),
      limit: parseInt(limit, 10),
    });

    const postsWithImages = await Promise.all(
      posts.map(async post => {
        const photos = await fetchPhotosByAlbumId(post.id);
        return {
          ...post,
          images: photos.slice(0, 3).map(photo => ({ url: photo.url })),
        };
      }),
    );

    res.json(postsWithImages);
  } catch (error) {
    console.error('Error fetching posts with images:', error);
    res.status(500).json({ error: 'Failed to fetch posts with images' });
  }
});

module.exports = router;
