import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <main className="h-screen font-roboto flex gap-32 justify-center items-center w-full">
      <div>
        <Image src={"/Images/banner.png"} width={500} height={500} />
      </div>
      <div>
        <h1 className="text-3xl font-medium text-[#3e6e34]">Welcome Back!</h1>
        <p className="text-[#71c55d] mt-3">Login to continue</p>
        <form action="" className="flex gap-2 flex-col mt-6">
          <label htmlFor="email" className="text-[#3e6e34] font-semibold">
            Email
          </label>
          <input
            type="password"
            placeholder="username@gamil.com"
            className="border border-[#3e6e34] py-2 px-4 rounded-xl outline-none w-full lg:w-[30vw]"
          />
          <label htmlFor="password" className="text-[#3e6e34] font-semibold">
            Password
          </label>
          <input
            type="password"
            placeholder="password"
            className="border border-[#3e6e34] py-2 px-4 rounded-xl outline-none w-full lg:w-[30vw]"
          />
          <button className="text-white bg-[#3e6e34] p-2 mt-5 rounded-full">
            Login
          </button>
        </form>

        <div className="mt-6 mx-auto">
          Don’t have an account?{" "}
          <Link
            className="text-[#71c55d] hover:text-[#3e6e34]"
            href={"/register"}
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
};

export default page;
