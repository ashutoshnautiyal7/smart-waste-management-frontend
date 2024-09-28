import React from "react";
import Slider from "react-slick";

const PostDetail = ({ post }) => {
  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="post-detail">
      {/* Post Title */}
      <h1>{post.title}</h1>

      {/* Post Author and Date */}
      <p>
        By {post.author} on {new Date(post.date).toLocaleDateString()}
      </p>

      {/* Post Content */}
      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {/* Image Slider */}
      {post.images && post.images.length > 0 && (
        <div className="post-images">
          <Slider {...sliderSettings}>
            {post.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`Post Image ${index + 1}`}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

// Example usage with post data
const examplePost = {
  title: "Community Event Highlights",
  author: "John Doe",
  date: "2024-09-28",
  content:
    "This post covers the highlights of the community event held last weekend. It was a great success!",
  images: [
    "https://via.placeholder.com/600x400",
    "https://via.placeholder.com/600x400",
  ],
};

const App = () => {
  return (
    <div>
      <PostDetail post={examplePost} />
    </div>
  );
};

export default App;
