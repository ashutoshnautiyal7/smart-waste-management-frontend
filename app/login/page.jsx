"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import GetCookie from "@/components/GetCookie/GettCookie";

const Page = () => {
  const router = useRouter();
  const token = typeof window !== "undefined" ? GetCookie("token") : null;
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const user = {
      email,
      password,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        user
      );
      if (res.status === 200) {
        document.cookie = "token=Bearer " + res.data.token + "; max-age=86400";
        document.cookie =
          "Bearer " +
          res.data.token +
          "=" +
          JSON.stringify(res.data.payloadData) +
          "; max-age=86400";
        router.push("/");
      }
    } catch (err) {
      setInvalid(true);
    }
  };

  return (
    <main className="h-screen font-roboto flex gap-32 justify-center items-center w-full">
      <div>
        <Image
          src={"/Images/banner.png"}
          width={500}
          height={500}
          alt="Banner"
        />
      </div>
      <div>
        <h1 className="text-3xl font-medium text-[#3e6e34]">Welcome Back!</h1>
        <p className="text-[#71c55d] mt-3">Login to continue</p>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-col mt-6">
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
            Login
          </button>
          {invalid && (
            <p className="text-red-500 mt-2">
              Invalid credentials. Please try again.
            </p>
          )}
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

export default Page;
