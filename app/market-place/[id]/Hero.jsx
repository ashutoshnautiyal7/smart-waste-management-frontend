"use client";
import Link from "next/link";
import React, { useState } from "react";

const Hero = ({ data }) => {


  console.log("the data is ", data)
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const handleClickPrev = () => {
    setMainImageIndex((prevIndex) =>
      prevIndex === 0 ? data.images.length - 1 : prevIndex - 1
    );
  };

  const handleClickNext = () => {
    setMainImageIndex((prevIndex) =>
      prevIndex === data.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="bg-[#F4F4F4] lg:rounded-md lg:shadow-md p-10 lg:p-10">
      <div className="flex gap-10 flex-col xl:flex-row justify-center items-center xl:items-start">
        {/* Image Thumbnails and Main Image */}
        <div className="lg:min-w-[49rem] flex flex-col-reverse md:flex-row gap-5 sm:gap-8 md:gap-4 lg:gap-6">
          <div className="flex md:flex-col gap-4 lg:gap-5 justify-center">
            {data.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-[4rem] sm:w-[7rem] lg:w-[8rem] sm:h-[9rem] lg:h-[10rem] cursor-pointer rounded-md ${
                  index === mainImageIndex
                    ? "border-4 border-[#71c55d]"
                    : "border-2 border-gray-500"
                }`}
                onClick={() => setMainImageIndex(index)}
              />
            ))}
          </div>
          <div className="relative w-[19rem] sm:w-[30rem] h-[20rem] sm:h-[35rem] overflow-hidden rounded-md">
            <img
              src={data.images[mainImageIndex]}
              alt={`Main Image ${mainImageIndex + 1}`}
              className="object-cover w-full h-full"
            />
            <button
              onClick={handleClickPrev}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-[#71c55d]  p-3 rounded-full"
            >
              &#10094;
            </button>
            <button
              onClick={handleClickNext}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#71c55d] p-3 rounded-full"
            >
              &#10095;
            </button>
          </div>
        </div>
        {/* Text content */}
        <div className=" max-w-[43.5rem] lg:max-w-[49rem] xl:mt-10">
          <h1 className="text-[40px] md:text-[50px] font-bold leading-[110%]">
            {data.title}
          </h1>
          <div className="mt-2 md:mt-3">
            <span className="text-[#71c55d] text-[26px] md:text-[36px] leading-[40px] font-semibold">
              ₹{data.price}
            </span>
          </div>
          <div className="mt-7 md:mt-6 leading-[28.8px]">
            <p className="whitespace-pre-wrap">{data.content}</p>
          </div>
          <div className="mt-7 md:mt-6 leading-[28.8px]">
            <p className="whitespace-pre-wrap">Address: {data.address}</p>
          </div>
          <div className="mt-7 md:mt-6 leading-[28.8px]">
            <Link href={`tel:${data.user.phone}`} className="whitespace-pre-wrap">Phone: {data.user.phone}</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
