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
  token,
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

    const data = {
      title,
      email: user.email,
      content,
      images,
      price,
      address,
      city,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/createpost",
        data,
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

  return (
    <section className="bg-white p-2 lg:p-6 lg:rounded-md lg:shadow-md">
      <form
        onSubmit={handleSubmit}
        className="bg-[#F4F4F4] text-black rounded-md p-3 lg:p-5 mb-6"
      >
        <h2 className="font-bold text-[#71c55d] text-xl mb-4">Create Post</h2>

        <div className="my-3">
          <input
            ref={titleRef}
            required
            className="w-full p-3 border text-[14px] md:text-[16px] rounded-md focus:ring-2 focus:ring-[#71C55D] outline-none"
            placeholder="Title"
          />
        </div>

        <div className="my-3">
          <input
            ref={contentRef}
            required
            className="w-full p-3 border text-[14px] md:text-[16px] rounded-md focus:ring-2 focus:ring-[#71C55D] outline-none"
            placeholder="What's on your mind"
          />
        </div>

        <div className="my-3">
          <input
            ref={priceRef}
            required
            className="w-full p-3 border text-[14px] md:text-[16px] rounded-md focus:ring-2 focus:ring-[#71C55D] outline-none"
            placeholder="Price"
          />
        </div>

        <div className="my-3">
          <input
            ref={addressRef}
            required
            className="w-full p-3 border text-[14px] md:text-[16px] rounded-md focus:ring-2 focus:ring-[#71C55D] outline-none"
            placeholder="Address"
          />
        </div>

        <div className="my-3">
          <input
            ref={cityRef}
            required
            className="w-full p-3 border text-[14px] md:text-[16px] rounded-md focus:ring-2 focus:ring-[#71C55D] outline-none"
            placeholder="City"
          />
        </div>

        {imageSrc.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4">
            {imageSrc.map((image, index) => (
              <div key={index} className="relative">
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-0 left-0 p-1 bg-red-500 rounded-full text-white"
                >
                  ×
                </button>
                <Image
                  alt="Selected"
                  className="rounded-md"
                  src={image}
                  width={100}
                  height={100}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <label
            htmlFor="gallery"
            className="cursor-pointer text-[14px] md:text-[16px] flex items-center gap-2 text-white bg-[#71c55d] px-4 py-2 rounded-md"
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

          <button
            type="submit"
            className="bg-[#71c55d] text-[14px] md:text-[16px] text-white px-5 py-2 rounded-md"
          >
            <MdOutlinePublish className="inline-block" /> {publish}
          </button>
        </div>
      </form>
      <div className="flex justify-between gap-4 my-10">
        <div className="flex items-center gap-4">
          <div className="bg-[#71c55d] h-9 w-3 md:w-5 rounded-sm"></div>
          <h2 className="text-[#71c55d] text-xl font-bold">Posts</h2>
        </div>
        <div className="text-[#71c55d] flex md:gap-20 justify-end">
          <div className="flex mt-2 md:mt-0">
            <button className="md:px-2" onClick={handleScrollLeft}>
              <BsFillArrowLeftCircleFill className="h-6 md:h-8 w-6 md:w-8" />
            </button>
            <button className="px-2 md:px-2" onClick={handleScrollRight}>
              <BsFillArrowRightCircleFill className="h-6 md:h-8 w-6 md:w-8" />
            </button>
          </div>
        </div>
      </div>

      <div
        className="flex overflow-x-scroll no-scrollbar gap-6 md:gap-10"
        style={{ scrollbarWidth: "none" }}
        ref={scrollContainerRef}
      >
        {/* Map through posts */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <>
              <Link href={`/market-place/${post.id}`}>
                <div
                  key={post.id}
                  className="bg-[#F5F5F5] p-4 rounded-md w-[300px] min-w-[300px] flex-shrink-0 mb-4"
                >
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
                      <h3 className=" font-semibold">
                        {post.user}
                      </h3>{" "}
                      {/* Updated text color */}
                      <p className="text-sm text-gray-500">
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
                    {/* Updated Colors */}
                    <h3 className="text-lg font-semibold mt-4">
                      {post.title}
                    </h3>
                    <p className="text-md mt-2">
                      Price: ${post.price}
                    </p>
                    <p className="text-md  mt-2">
                      {post.address}, {post.city}
                    </p>
                  </div>
                </div>
              </Link>
            </>
          ))
        ) : (
          <p className="text-gray-400">No posts available.</p>
        )}
      </div>
    </section>
  );
};

export default LeftSection;
