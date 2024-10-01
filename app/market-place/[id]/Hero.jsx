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
    <section className="bg-[#30304C] pt-7 md:pt-10 px-[1.2rem] md:px-[2.5rem]">
      <div className="flex gap-10 flex-col xl:flex-row justify-center items-center xl:items-start">
        {/* Image Thumbnails and Main Image */}
        <div className="lg:min-w-[49rem] flex flex-col-reverse md:flex-row gap-5 sm:gap-8 md:gap-4 lg:gap-6">
          <div className="flex md:flex-col gap-4 lg:gap-5 justify-center">
            {data.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-[4rem] sm:w-[7rem] lg:w-[8rem] sm:h-[9rem] lg:h-[10rem] cursor-pointer"
                onClick={() => setMainImageIndex(index)}
              />
            ))}
          </div>
          <div className="relative w-[19rem] sm:w-[35rem] lg:w-[40rem] h-[23rem] sm:h-[40rem] lg:h-[45rem] rounded-lg md:rounded-xl bg-white justify-center items-center flex">
            <img
              src={data.images[mainImageIndex]}
              alt={`Main Image ${mainImageIndex + 1}`}
              className="sm:w-[26rem] sm:h-[30rem]"
            />
            <img
              src="/Images/half-left.png"
              alt="Left Arrow"
              className="absolute left-1.5 sm:left-2.5 lg:left-5 w-5 sm:w-14 h-3.5 sm:h-8 cursor-pointer"
              onClick={handleClickPrev}
            />
            <img
              src="/Images/half-right.png"
              alt="Right Arrow"
              className="absolute right-1.5 sm:right-2.5 lg:right-5 w-5 sm:w-14 h-3.5 sm:h-8 cursor-pointer"
              onClick={handleClickNext}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="text-white max-w-[43.5rem] lg:max-w-[49rem]">
          <h1 className="text-[40px] md:text-[50px] font-bold leading-[110%]">
            {data.title}
          </h1>
          <div className="mt-2 md:mt-3">
            <span className="text-[#4FA2AE] text-[26px] md:text-[36px] leading-[40px] font-semibold">
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
      <div className="mt-10 md:mt-14">
        <div className="h-[1px] w-full bg-white"></div>
      </div>
    </section>
  );
};

export default Hero;
