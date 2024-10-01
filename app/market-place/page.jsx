"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Topbar from "@/components/topbar/Topbar";
import LeftSection from "@/components/leftsection/LeftSection";
import Link from "next/link";
import { ThreeCircles } from "react-loader-spinner";
import GetCookie from "@/components/GetCookie/GettCookie";

const MarketPlace = () => {
  //   const { data: session, status } = useSession();
  const router = useRouter();
  const token = typeof window !== "undefined" ? GetCookie("token") : null;
  const [user, setUser] = useState("");
  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userloading, setUserLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setUser(
        typeof window !== "undefined" ? JSON.parse(GetCookie(token)) : null
      );
    }
  }, []);

  //   useEffect(() => {
  //     const getUser = async () => {
  //       if (status === "authenticated" && session?.user?.email) {
  //         try {
  //           const res = await axios.get(
  //             `http://localhost:3000/api/get_user?email=${encodeURIComponent(
  //               email
  //             )}`
  //           );
  //           const data = res.data;

  //           setUser(data[0]);
  //         } catch (err) {
  //           console.log("Some error occurred fetching user data", err);
  //         } finally {
  //           setUserLoading(false);
  //         }
  //       } else if (status !== "loading") {
  //         setUserLoading(false);
  //       }
  //     };

  //     getUser();
  //   }, [session, status]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:3000/api/posts?page=" + currentPage,
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
  console.log("the user is ", user);
  console.log("the posts are  ", posts);

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

  //   if (status === "loading" || userloading) {
  //     return (
  //       <div className="flex items-center justify-center">
  //         <ThreeCircles height="30" width="100" color="#000" />
  //       </div>
  //     );
  //   }

  //   if (!session) {
  //     return (
  //       <>
  //         <Navbar />
  //         <div className="flex justify-center items-center h-screen">
  //           Please sign in to view this page.
  //           <Link href={"/login"}>Sign In</Link>
  //         </div>
  //       </>
  //     );
  //   }

  return (
    <main className="w-full pt-[4rem]">
      <div className="px-[1.2rem] md:px-[rem] md:pt-6 py-[15rem] flex items-center flex-col bg-[#30304C]">
        <div className="w-full">
          {/* <Topbar onSearch={onSearch} user={user} /> */}
          <LeftSection
            loading={loading}
            user={user}
            posts={filteredPosts}
            size={size}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            token={token}
          />
        </div>
      </div>
    </main>
  );
};

export default MarketPlace;
