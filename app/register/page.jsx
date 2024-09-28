"use client";
import GetCookie from "@/components/GetCookie/GettCookie";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const [exists, setExists] = useState(false);

  const token = typeof window !== "undefined" ? GetCookie("token") : null;

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    const user = {
      name,
      email,
      password,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        user
      );
      if (res.status === 200) {
        const userlogin = {
          email,
          password,
        };
        const reslogin = await axios.post(
          "http://localhost:3000/api/auth/login",
          userlogin
        );
        if (reslogin.status === 200) {
          document.cookie =
            "token=Bearer " + reslogin.data.token + "; max-age=86400";
          document.cookie =
            "Bearer " +
            reslogin.data.token +
            "=" +
            JSON.stringify(reslogin.data.payloadData) +
            "; max-age=86400";
          router.push("/");
        }
      }
    } catch (err) {
      setExists(true);
    }
  };

  return (
    <main className="h-screen font-roboto flex gap-32 justify-center items-center">
      <div>
        <Image
          src={"/Images/banner.png"}
          width={500}
          height={500}
          alt="Banner"
        />
      </div>
      <div>
        <h1 className="text-3xl font-medium text-[#3e6e34]">Hello!</h1>
        <p className="text-[#71c55d] mt-3">Join to get with us!</p>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-col mt-6">
          <label htmlFor="name" className="text-[#3e6e34] font-semibold">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="name"
            className="border border-[#3e6e34] py-2 px-4 rounded-xl outline-none w-full lg:w-[30vw]"
            required
          />
          <label htmlFor="email" className="text-[#3e6e34] font-semibold">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="username@gmail.com"
            className="border border-[#3e6e34] py-2 px-4 rounded-xl outline-none w-full lg:w-[30vw]"
            required
          />
          <label htmlFor="password" className="text-[#3e6e34] font-semibold">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="password"
            className="border border-[#3e6e34] py-2 px-4 rounded-xl outline-none w-full lg:w-[30vw]"
            required
          />
          <button className="text-white bg-[#3e6e34] p-2 mt-5 rounded-full">
            Sign up
          </button>
          {exists && (
            <p className="text-red-500 mt-2">
              User already exists. Please try with a different email.
            </p>
          )}
        </form>
        <div className="mt-6 mx-auto">
          Already have an account?{" "}
          <Link className="text-[#71c55d] hover:text-[#3e6e34]" href={"/login"}>
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Page;
