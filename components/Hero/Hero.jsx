import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <section className="py-[10rem] flex justify-center items-center flex-col">
      <h1 className="font-philosopher text-5xl text-[#71c55d] text-bold">
        Smart Waste Management System
      </h1>
      <p className="font-roboto text-2xl text-[#777] mt-3">
        "Smart Waste, Bright Future: Clean, Green, and Efficient!"
      </p>
      <Image src={"/Images/hero.png"} width={500} height={500} className="mt-10"/>
    </section>
  );
};

export default Hero;
