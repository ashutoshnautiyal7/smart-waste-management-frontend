"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { ThreeCircles } from "react-loader-spinner";
import GetCookie from "@/components/GetCookie/GettCookie";
import LeftSection2 from "@/components/LeftSection2/LeftSection2";

const CommunityPage = () => {
  const token = typeof window !== "undefined" ? GetCookie("token") : null;
  const router = useRouter();
  const [user, setUser] = useState("");
  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setUser(
        typeof window !== "undefined" ? JSON.parse(GetCookie(token)) : null
      );
    }
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:3000/api/community/posts?page=" + currentPage,
          { headers: { Authorization: token } }
        );
        const data = res.data.formattedPosts;
        setSize(res.data.size);
        setPosts(data);
        setFilteredPosts(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    getPosts();
  }, [currentPage]);

  const onSearch = (query) => {
    if (query.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase()) ||
          (post.user && post.user.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredPosts(filtered);
    }
  };

  console.log("the user is ", user);
  console.log("the community posts are  ", posts);

  return (
    <main className="w-full pt-[4rem]">
      <div className="px-[1.2rem] md:px-[rem] md:pt-6 py-[15rem] flex items-center flex-col bg-[#30304C]">
        <div className="w-full">
          {/* <Topbar onSearch={onSearch} user={user} /> */}
          <LeftSection2
            loading={loading}
            token={token}
            user={user}
            posts={filteredPosts}
            size={size}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </main>
  );
};

export default CommunityPage;
