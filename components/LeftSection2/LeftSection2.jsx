import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Post from "../post/Post";
import axios from "axios";
import Link from "next/link";
import CommunityPost from "../CommunityPost/CommunityPost";
import { GrGallery } from "react-icons/gr";
import { MdOutlinePublish } from "react-icons/md";
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from "react-icons/bs";

const LeftSection2 = ({
  loading,
  token,
  user,
  posts,
  size,
  currentPage,
  setCurrentPage,
}) => {
  const lastPage = Math.ceil(size / 10);
  const [imageSrc, setImageSrc] = useState([]);
  const titleRef = useRef();
  const contentRef = useRef();
  const imageRef = useRef();
  const [uploadData, setUploadData] = useState();
  const [warn, setWarn] = useState(false);
  const [publish, setPublish] = useState("Publish");

  function handleOnChange(changeEvent) {
    const reader = new FileReader();
    const files = changeEvent.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      reader.onload = function (onLoadEvent) {
        setImageSrc([...imageSrc, onLoadEvent.target.result]);
        setUploadData(undefined);
        setWarn(false);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublish("Publishing...");
    const title = e.target[0].value;
    const content = e.target[1].value;
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
          console.log(data);
          images.push(data.url);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    }
    const user = {
      title,
      content,
      images,
    };
    try {
      const res = await axios.post(
        "http://localhost:3000/api/community/createpost",
        user,
        { headers: { Authorization: token } }
      );
      titleRef.current.value = "";
      contentRef.current.value = "";
      imageRef.current.value = [];
      setImageSrc([]);
      setPublish("Publish");
      location.reload();
    } catch (err) {
      setPublish("Publish");
    }
  };

  const handleImageRemove = (indexToRemove) => {
    setImageSrc((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
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
          <textarea
            ref={contentRef}
            required
            className="w-full p-3 border text-[14px] md:text-[16px] rounded-md focus:ring-2 focus:ring-[#71C55D] outline-none"
            placeholder="What's on your mind"
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
      {loading ? (
        <div className="w-full flex justify-center py-5">Loading...</div>
      ) : (
        <div className="flex flex-col gap-5">
          {posts?.map((p, index) => (
            <CommunityPost key={p?.id} post={p} user={user} token={token} />
          ))}
        </div>
      )}
      <div
        className={`w-full flex ${
          currentPage <= 1 || currentPage === lastPage
            ? "justify-center"
            : "justify-between"
        } my-8`}
      >
        {currentPage > 1 && (
          <div className="bg-white p-0.5 md:p-1 rounded-lg">
            <button
              onClick={() => {
                setCurrentPage((prev) => prev - 1),
                  window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="rounded-lg py-2 px-8 bg-gradient-to-b from-[#FF1111] to-[#692323] md:text-xl text-base text-white"
            >
              Previous Page
            </button>
          </div>
        )}
        {currentPage < lastPage && (
          <div className="bg-white p-0.5 md:p-1 rounded-lg">
            <button
              onClick={() => {
                setCurrentPage((prev) => prev + 1),
                  window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="rounded-lg py-2 px-8 bg-gradient-to-b from-[#FF1111] to-[#692323] md:text-xl text-base text-white"
            >
              Next Page
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LeftSection2;
