import PropTypes from 'prop-types';
import React, { useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';

const PostContainer = styled.div(() => ({
  width: '300px',
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
}));

const CarouselContainer = styled.div(() => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
}));

const Carousel = styled.div(() => ({
  display: 'flex',
  overflowX: 'scroll',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollSnapType: 'x mandatory',
}));

const CarouselItem = styled.div(() => ({
  flex: '0 0 auto',
  scrollSnapAlign: 'start',
}));

const Image = styled.img(() => ({
  width: '280px',
  height: 'auto',
  maxHeight: '300px',
  padding: '10px',
}));

const Content = styled.div(() => ({
  padding: '10px',
  '& > h2': {
    marginBottom: '16px',
  },
}));

const Button = styled.button(() => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#000',
  fontSize: '20px',
  cursor: 'pointer',
  height: '50px',
  width: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const PrevButton = styled(Button)`
  left: 10px;
`;

const NextButton = styled(Button)`
  right: 10px;
`;

const Avatar = styled.div(() => ({
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: 'gray',
  color: '#FFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontWeight: 'bold',
  marginRight: '10px',
}));

const Header = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
}));

const Post = ({ post }) => {
  const [user, setUser] = useState(null);
  const carouselRef = useRef(null);
  const userId = post.userId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `https://jsonplaceholder.typicode.com/users/${userId}`,
        );
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleNextClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 280,
        behavior: 'smooth',
      });
    }
  };

  const handlePrevClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -280,
        behavior: 'smooth',
      });
    }
  };

  if (!post) {
    console.error('Post prop is undefined');
    return null;
  }

  if (!post.images || !Array.isArray(post.images)) {
    console.error('Post images prop is missing or not an array');
    return null;
  }

  const getUserInitials = user => {
    if (user) {
      const firstNameInitial = user.name.charAt(0);
      const lastNameInitial = user.name.split(' ')[1].charAt(0);
      return `${firstNameInitial}${lastNameInitial}`;
    }
    return '';
  };

  return (
    <PostContainer>
      <Header>
        <Avatar>{user && getUserInitials(user)}</Avatar>
        <span>{user && user.name}</span>
      </Header>
      <CarouselContainer>
        <Carousel ref={carouselRef}>
          {post.images.map((image, index) => (
            <CarouselItem key={index}>
              <Image src={image.url} alt={post.title} />
            </CarouselItem>
          ))}
        </Carousel>
        <PrevButton onClick={handlePrevClick}>&#10094;</PrevButton>
        <NextButton onClick={handleNextClick}>&#10095;</NextButton>
      </CarouselContainer>
      <Content>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </Content>
    </PostContainer>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default Post;
