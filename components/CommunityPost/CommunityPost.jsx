import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { debounce, forEach, update } from "lodash";
import { format } from "timeago.js";
import axios from "axios";
import Link from "next/link";
import CommunityComment from "../CommunityComment/CommunityComment";

const CommunityPost = ({ post, user, token, prof }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const titleRef = useRef();
  const contentRef = useRef();
  const [imageSrc, setImageSrc] = useState([]);
  const imageRef = useRef();
  const [uploadData, setUploadData] = useState();
  const [warn, setWarn] = useState(false);
  const [likes, setLikes] = useState(post?.likeCount);
  const [comments, setComments] = useState(post?.comments);
  const [commOpen, setcommopen] = useState(false);
  const [numCommentsToShow, setNumCommentsToShow] = useState(5);
  const [initImages, setInitImages] = useState(post?.images);
  const [images, setImages] = useState(post?.images);
  const [totalComments, setTotalComments] = useState(post?.comments?.length);
  const [update, setUpdate] = useState("Update");

  function handleOnChange(changeEvent) {
    const reader = new FileReader();
    const files = changeEvent.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      reader.onload = function (onLoadEvent) {
        setImageSrc([...imageSrc, onLoadEvent.target.result]);
        setImages((prev) => [...prev, onLoadEvent.target.result]);
        setUploadData(undefined);
        setWarn(false);
      };
      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    post?.likes.forEach((like) => {
      if (like.userId === user?.id) {
        setIsLiked(true);
      }
    });
  }, [post?.likes]);

  const likeUnlikePost = async () => {
    const postId = post.id;
    const body = {
      postId,
    };
    try {
      const res = await axios.post(
        "http://localhost:3000/api/likepost",
        body,
        { headers: { Authorization: token } }
      );
      setIsLiked(!isLiked);
      setLikes(likes + (isLiked ? -1 : 1));
    } catch (err) {}
  };

  const debouncedLikeUnlikePost = debounce(likeUnlikePost, 200);
  const handleLike = () => {
    debouncedLikeUnlikePost();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postId = post.id;
    const content = e.target[0].value;
    const commentData = {
      postId,
      content,
    };
    try {
      const res = await axios.post(
        "http://localhost:3000/api/comment",
        commentData,
        { headers: { Authorization: token } }
      );
      const data = res.data;
      const newComm = {
        commentId: data.data.id,
        userId: user.id,
        username: user.name,
        content: content,
        userImage: user.image,
      };
      res.status === 201 && setComments((prev) => [newComm, ...prev]);
      e.target[0].value = "";
    } catch (err) {}
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const postId = post.id;

    try {
      const res = await axios.delete(
        "http://localhost:3000/api/community/deletepost",
        { headers: { Authorization: token }, data: { postId } }
      );
      setOpenMenu(false);
      location.reload();
    } catch (err) {}
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdate("Updating...");
    const title = e.target[0].value;
    const content = e.target[1].value;
    const postId = post.id;
    const addedImages = [];
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
          addedImages.push(data.url);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    }
    const commonImages = initImages.filter((value) => images.includes(value));
    const updatedImages = [...addedImages, ...commonImages];
    const user = {
      title,
      content,
      postId,
      images: updatedImages,
    };
    try {
      const res = await axios.put(
        "http://localhost:3000/api/community/updatepost",
        user,
        { headers: { Authorization: token } }
      );
      setOpenUpdate(false);
      location.reload();
      setUpdate("Update");
    } catch (err) {
      setUpdate("Update");
    }
  };

  const handleDeleteComment = async (e, commId) => {
    e.preventDefault();
    const commentId = commId;
    try {
      const res = await axios.delete(
        "http://localhost:3000/api/deletecomment",
        { headers: { Authorization: token }, data: { commentId } }
      );
      const newcomms = [];
      comments.forEach((comment) => {
        if (comment.commentId !== commId) {
          newcomms.push(comment);
        }
      });
      setComments(newcomms);
    } catch (err) {}
  };

  const handleImageRemove = (indexToRemove, image) => {
    setImageSrc((prevImages) =>
      prevImages.filter((url, index) => url !== image)
    );
    setImages((prev) => prev.filter((url, i) => i !== indexToRemove));
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  return (
    <div
      className={`bg-white p-4 md:p-6 flex text-black ${
        prof !== "prof" && "last:rounded-b-3xl"
      }`}
    >
      <div className="w-full md:w-9/12">
        <div className="flex items-center gap-2 my-2">
          <div className="relative rounded-full h-[60px] w-[60px]">
            <Image
              alt="image"
              className="rounded-full object-cover"
              fill={true}
              src={
                prof === "prof"
                  ? user.image
                    ? user.image
                    : "/prof.jpg"
                  : post.userImage
                  ? post.userImage
                  : "/prof.jpg"
              }
            ></Image>
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold">
              {prof === "prof" ? user.name : post?.user}
            </h2>
            <h3 className="text-xs">{format(post?.createdAt)}</h3>
          </div>
        </div>
        {openUpdate ? (
          <form onSubmit={handleUpdate}>
            <div className="flex items-center gap-2 my-2 bg-[#F6F3F3] rounded-xl py-3 px-5">
              <input
                ref={titleRef}
                defaultValue={post?.title}
                className="outline-none rounded-r-xl w-full bg-[#F6F3F3] placeholder:text-black"
                placeholder="Title"
              ></input>
            </div>
            <div className="flex items-center gap-2 my-4 bg-[#F6F3F3] rounded-xl p-5">
              <input
                ref={contentRef}
                defaultValue={post?.content}
                className="outline-none rounded-r-xl w-full bg-[#F6F3F3] placeholder:text-black"
                placeholder="Content"
              ></input>
            </div>
            <div className="flex flex-col">
              {images?.map((image, index) => (
                <div key={image} className="w-full h-full my-2">
                  <div
                    onClick={() => {
                      handleImageRemove(index, image);
                    }}
                    className="cursor-pointer relative top-4 -left-2"
                  >
                    <span className="bg-gray-400 w-fit text-black px-2 py-0.5 font-medium rounded-full flex justify-center items-center">
                      ×
                    </span>
                  </div>
                  <Image
                    alt="image"
                    className="w-full h-full"
                    width={1000}
                    height={1000}
                    src={image}
                  ></Image>
                </div>
              ))}
            </div>
            <div className="flex w-full justify-between items-center py-2">
              <label
                for="photo"
                className="cursor-pointer flex items-center justify-center gap-2 md:gap-4 rounded-full bg-[#C2F6C8] text-black px-6 py-2"
              >
                <Image
                  alt="image"
                  width={20}
                  height={20}
                  src={"/gallery.png"}
                ></Image>
                <span>Gallery</span>
              </label>
              <input
                name="file"
                ref={imageRef}
                onChange={handleOnChange}
                id="photo"
                className="hidden"
                type="file"
              />
              <button
                type="submit"
                className="bg-[#2CC34D] px-3 py-1 text-white rounded-md font-medium"
              >
                {update}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h2 className="text-2xl font-bold">{post?.title}</h2>
            {isValidUrl(post?.content) ? (
              <Link
                className="text-blue-700"
                href={post.content}
                target="_blank"
                rel="noopener noreferrer"
              >
                {post?.content}
              </Link>
            ) : (
              <p>{post?.content}</p>
            )}
            <div className="flex flex-col">
              {post?.images?.map((image) => (
                <div key={image} className="relative w-full h-full my-2">
                  <Image
                    alt="image"
                    className="h-full w-full"
                    width={1000}
                    height={1000}
                    src={image}
                  ></Image>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-8 mt-4">
              <div className="cursor-pointer flex items-center justify-center gap-2">
                <Image
                  alt="image"
                  onClick={handleLike}
                  height={25}
                  width={25}
                  src={isLiked ? "/like.png" : "/empty.png"}
                ></Image>
                <span className="font-medium">{likes}</span>
              </div>
              <div className="cursor-pointer flex items-center justify-center gap-2">
                <Image
                  alt="image"
                  onClick={() => setcommopen(!commOpen)}
                  height={20}
                  width={23}
                  src={"/comment.png"}
                ></Image>
                <span className="font-medium">{comments.length}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Image
                  alt="image"
                  height={20}
                  width={20}
                  src={"/share.png"}
                ></Image>
                <span className="text-xs">Share</span>
              </div>
            </div>
          </div>
        )}
        {commOpen && (
          <div className="flex flex-col gap-2 pt-5">
            <form onSubmit={handleSubmit} className="py-1 flex gap-2">
              <input
                required={true}
                className="outline-none w-full bg-slate-200 px-2 py-1 rounded-lg"
                placeholder="Write Comment"
              ></input>
              <button
                type="submit"
                className="px-3 py-1 bg-[#2CC34D] rounded-lg text-white"
              >
                Post
              </button>
            </form>
            <div className="flex flex-col gap-2 ">
              {comments?.slice(0, numCommentsToShow).map((comment) => (
                <div
                  key={comment.commentId}
                  className="flex flex-col gap-0.5 px-2 py-1 bg-slate-200 rounded-lg"
                >
                  <div className="flex gap-1 items-center">
                    <Image
                      className="relative h-[35px] w-[35px] rounded-full object-cover"
                      height={1000}
                      width={1000}
                      src={comment.userImage ? comment.userImage : "/prof.jpg"}
                    ></Image>
                    <span className="text-sm font-semibold">
                      {comment.username}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <CommunityComment text={comment.content} />
                    {comment.userId == user?.id && (
                      <button
                        onClick={(e) => {
                          handleDeleteComment(e, comment.commentId);
                        }}
                        className="flex items-center justify-center bg-[#2CC34D] px-1.5 py-1 rounded-md text-sm text-white"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {totalComments > numCommentsToShow && (
                <button
                  onClick={() => {
                    setNumCommentsToShow((prev) => prev + 5);
                  }}
                  className="pt-3 text-gray-500 hover:underline"
                >
                  Load more comments
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="w-1/12 md:w-3/12 flex justify-end">
        <div className="flex flex-col items-end">
          <span
            onClick={() => {
              setOpenMenu(!openMenu);
            }}
            className={`${
              post.userId === user?.id ? "cursor-pointer" : "cursor-not-allowed"
            } text-lg font-semibold`}
          >
            •••
          </span>
          {openMenu && post.userId === user.id && (
            <div className="flex flex-col bg-slate-400 gap-[1px]">
              <div
                onClick={handleDelete}
                className="cursor-pointer flex justify-center items-center bg-slate-300 px-5 py-1"
              >
                Delete
              </div>
              <div
                onClick={() => {
                  setOpenUpdate(!openUpdate), setOpenMenu(false);
                }}
                className="cursor-pointer flex justify-center items-center bg-slate-300 px-5 py-1"
              >
                {openUpdate ? "Cancel" : "Update"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPost;
