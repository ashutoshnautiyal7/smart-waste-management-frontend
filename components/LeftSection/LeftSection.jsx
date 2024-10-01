import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { GrGallery } from "react-icons/gr";
import { FaRegComments } from "react-icons/fa";
import { MdOutlinePublish } from "react-icons/md";
import axios from "axios";
import Link from "next/link";
import Post from "../post/Post";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";

const LeftSection = ({
  loading,
  user,
  posts,
  size,
  currentPage,
  setCurrentPage,
  token
}) => {
  const [imageSrc, setImageSrc] = useState([]);
  const titleRef = useRef();
  const contentRef = useRef();
  const priceRef = useRef();
  const addressRef = useRef();
  const cityRef = useRef();
  const imageRef = useRef();
  const scrollContainerRef = useRef(null);
  const [publish, setPublish] = useState("Publish");

  // Waste Category State
  const [wasteCategory, setWasteCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);


  

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 500;
      const currentPosition = container.scrollLeft;
      const targetPosition = currentPosition + scrollAmount;
      container.scrollTo({
        left: targetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 500;
      const currentPosition = container.scrollLeft;
      const targetPosition = currentPosition - scrollAmount;
      container.scrollTo({
        left: targetPosition,
        behavior: "smooth",
      });
    }
  };

  function handleOnChange(changeEvent) {
    const reader = new FileReader();
    const files = changeEvent.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      reader.onload = function (onLoadEvent) {
        setImageSrc([...imageSrc, onLoadEvent.target.result]);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleImageRemove = (indexToRemove) => {
    setImageSrc((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublish("Publishing...");
    const title = titleRef.current.value;
    const content = contentRef.current.value;
    const price = priceRef.current.value;
    const address = addressRef.current.value;
    const city = cityRef.current.value;

    const images = [];
    if (imageSrc !== null) {
      for (const imageUrl of imageSrc) {
        const formData = new FormData();
        formData.append("file", imageUrl);
        formData.append("upload_preset", "my-upload");
        try {
          const data = await fetch(
            "https://api.cloudinary.com/v1_1/dgav9ohkf/image/upload",
            {
              method: "POST",
              body: formData,
            }
          ).then((r) => r.json());
          images.push(data.url);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    }

    const postData = {
      title,
      email: user.email,
      content,
      images,
      price,
      address,
      city,
      wasteCategory, // Adding the waste category to the data
    };

    

    try {
      const res = await axios.post(
        "http://localhost:3000/api/createpost",
        postData,
        { headers: { Authorization: token } }
      );
      titleRef.current.value = "";
      contentRef.current.value = "";
      priceRef.current.value = "";
      addressRef.current.value = "";
      cityRef.current.value = "";
      imageRef.current.value = [];
      setImageSrc([]);
      setPublish("Publish");
      location.reload();
    } catch (err) {
      setPublish("Publish");
    }
  };

  // Handle category change
  const handleWasteCategoryChange = (e) => {
    setWasteCategory(e.target.value);
  };

  // Handle category filter for posts
  const handleCategoryFilter = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);

    if (selected === '') {
      setFilteredPosts(posts); // Show all posts if no category is selected
    } else {
      const filtered = posts.filter((post) => post.wasteCategory === selected);
      setFilteredPosts(filtered);
    }
  };

   // Update filtered posts when posts or selectedCategory changes
   useEffect(() => {
    if (selectedCategory === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) => post.wasteCategory === selectedCategory);
      setFilteredPosts(filtered);
    }
  }, [posts, selectedCategory]);

  console.log("the selected category is " , selectedCategory);
  console.log("the filtered posts are : " , filteredPosts)


  
  return (
    <section className="">
  <form
    onSubmit={handleSubmit}
    className="bg-white text-black my-2 rounded-t-xl p-3 md:p-5 overflow-hidden"
  >
    <h2 className="font-bold ml-1 text-[18px]">Create Post</h2>

    <div className="flex items-center gap-2 my-2 bg-[#ECECEC] rounded-xl py-3 px-5">
      <input
        required
        ref={titleRef}
        className="outline-none rounded-r-xl w-full bg-[#ECECEC] placeholder:text-black"
        placeholder="Title"
      />
    </div>

    <div className="flex items-center gap-2 my-4 bg-[#ECECEC] rounded-xl p-5">
      <FaRegComments className="w-5 h-5" />
      <input
        required
        ref={contentRef}
        className="outline-none rounded-r-xl w-full bg-[#ECECEC] placeholder:text-black"
        placeholder="What's on your mind"
      />
    </div>

    <div className="flex items-center gap-2 my-4 bg-[#ECECEC] rounded-xl p-5">
      <input
        required
        ref={priceRef}
        className="outline-none rounded-r-xl w-full bg-[#ECECEC] placeholder:text-black"
        placeholder="Price"
      />
    </div>

    <div className="flex items-center gap-2 my-4 bg-[#ECECEC] rounded-xl p-5">
      <input
        required
        ref={addressRef}
        className="outline-none rounded-r-xl w-full bg-[#ECECEC] placeholder:text-black"
        placeholder="Address"
      />
    </div>

    <div className="flex items-center gap-2 my-4 bg-[#ECECEC] rounded-xl p-5">
      <input
        required
        ref={cityRef}
        className="outline-none rounded-r-xl w-full bg-[#ECECEC] placeholder:text-black"
        placeholder="City"
      />
    </div>

    {/* Waste Category Dropdown */}
    <div>
        <select value={wasteCategory} onChange={handleWasteCategoryChange} required>
          <option value="">Select Waste Category</option>
          <option value="PLASTIC">Plastic</option>
          <option value="METAL">Metal</option>
          <option value="PAPER">Paper</option>
          <option value="ORGANIC">Organic</option>
          <option value="E_WASTE">E-waste</option>
        </select>
      </div>

    {/* Image upload and submit */}
    <div className="flex gap-2 md:gap-0 justify-center md:justify-between items-center">
      <div className="flex items-center gap-2">
        <label
          htmlFor="gallery"
          className="cursor-pointer flex gap-2 items-center text-white bg-[#4fa2ae] px-5 py-2 rounded-lg font-medium"
        >
          <GrGallery />
          <span>Gallery</span>
        </label>
        <input
          ref={imageRef}
          id="gallery"
          onChange={handleOnChange}
          type="file"
          className="hidden"
          multiple
        />
      </div>

      <button
        type="submit"
        className="bg-[#4fa2ae] text-white px-5 py-2 rounded-lg font-medium flex gap-2 items-center"
      >
        <MdOutlinePublish className="w-5 h-5" />
        <span>{publish}</span>
      </button>
    </div>
  </form>

  {/* Category Filter */}
  <div className="flex items-center gap-4 my-4">
    <select
      className="outline-none bg-[#4fa2ae] text-white rounded-md px-3 py-2"
      onChange={handleCategoryFilter}
    >
      <option value="">All Categories</option>
      <option value="PLASTIC">Plastic</option>
      <option value="METAL">Metal</option>
      <option value="PAPER">Paper</option>
      <option value="ORGANIC">Organic</option>
      <option value="E_WASTE">E-waste</option>
    </select>
  </div>

  <div className="flex items-center gap-4">
    <div className="bg-[#4FA2AE] h-9 w-5 rounded-sm"></div>
    <h2 className="text-[#4FA2AE] text-[14px] md:text-[16px] font-semibold">
      Posts
    </h2>
  </div>

  <div className="text-white flex md:gap-20 justify-end">
    <div className="flex mt-2 md:mt-0">
      <button className="md:px-2" onClick={handleScrollLeft}>
        <BsFillArrowLeftCircleFill className="h-6 md:h-8 w-6 md:w-8" />
      </button>
      <button className="px-2 md:px-2" onClick={handleScrollRight}>
        <BsFillArrowRightCircleFill className="h-6 md:h-8 w-6 md:w-8" />
      </button>
    </div>
  </div>

  <div
    className="mt-6 md:mt-10 flex overflow-x-scroll no-scrollbar gap-10"
    style={{ scrollbarWidth: "none" }}
    ref={scrollContainerRef}
  >
    {/* Filtered Posts */}
    {filteredPosts.length > 0 ? (
      filteredPosts.map((post) => (
        <Link href={`/market-place/${post.id}`} key={post.id}>
          <div className="bg-[#20203A] p-4 rounded-md w-[300px] min-w-[300px] flex-shrink-0">
            <div className="flex items-center gap-2">
              {post.userImage ? (
                <Image
                  src={post.userImage}
                  alt={post.user}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="bg-gray-400 w-10 h-10 rounded-full flex items-center justify-center text-white">
                  {post.user.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-white font-semibold">{post.user}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full h-[250px] bg-gray-200 overflow-hidden rounded-md">
                <Image
                  src={post.images[0]}
                  alt={post.title}
                  width={400}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg text-[#4FA2AE] font-semibold mt-4">
                {post.title}
              </h3>
              <p className="text-md text-[#4FA2AE] mt-2">
                Price: ${post.price}
              </p>
              <p className="text-md text-gray-400 mt-2">
                {post.address}, {post.city}
              </p>
            </div>
          </div>
        </Link>
      ))
    ) : (
      <p className="text-gray-400">No posts available.</p>
    )}
  </div>
</section>

  );
};

export default LeftSection;
