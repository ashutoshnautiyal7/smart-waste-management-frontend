// import { debounce } from "lodash";
// import React, { useRef, useEffect, useState } from "react";
// import Image from "next/image";
// import axios from "axios";
// import Link from "next/link";
// import Comment from "../comment/Comment";
// import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
// import { FaComment } from "react-icons/fa";
// import { GrGallery } from "react-icons/gr";
// import { format } from "timeago.js";

// const Post = ({ post, user }) => {
//   const [isLiked, setIsLiked] = useState(false);
//   const [openMenu, setOpenMenu] = useState(false);
//   const [openUpdate, setOpenUpdate] = useState(false);
//   const titleRef = useRef();
//   const contentRef = useRef();
//   const [imageSrc, setImageSrc] = useState([]);
//   const imageRef = useRef();
//   const [uploadData, setUploadData] = useState();
//   const [warn, setWarn] = useState(false);
//   const [likes, setLikes] = useState(post?.likeCount);
//   const [comments, setComments] = useState(post?.comments);
//   const [commOpen, setcommopen] = useState(false);
//   const [numCommentsToShow, setNumCommentsToShow] = useState(5);
//   const [initImages, setInitImages] = useState(post?.images);
//   const [images, setImages] = useState(post?.images);
//   const [totalComments, setTotalComments] = useState(post?.comments?.length);
//   const [update, setUpdate] = useState("Update");

//   function handleOnChange(changeEvent) {
//     const reader = new FileReader();
//     const files = changeEvent.target.files;

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       reader.onload = function (onLoadEvent) {
//         setImageSrc([...imageSrc, onLoadEvent.target.result]);
//         setImages((prev) => [...prev, onLoadEvent.target.result]);
//         setUploadData(undefined);
//         setWarn(false);
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   useEffect(() => {
//     post?.likes.forEach((like) => {
//       if (like.userId === user?.id) {
//         setIsLiked(true);
//       }
//     });
//   }, [post?.likes]);

//   const likeUnlikePost = async () => {
//     const postId = post.id;
//     const body = {
//       postId,
//       email: user.email,
//     };
//     try {
//       const res = await axios.post("https://cacoona.com/api/posts/like", body);
//       setIsLiked(!isLiked);
//       setLikes(likes + (isLiked ? -1 : 1));
//     } catch (err) {}
//   };

//   const debouncedLikeUnlikePost = debounce(likeUnlikePost, 200);
//   const handleLike = () => {
//     debouncedLikeUnlikePost();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const postId = post.id;
//     const content = e.target[0].value;
//     const commentData = {
//       email: user.email,
//       postId,
//       content,
//     };
//     try {
//       const res = await axios.post(
//         "https://cacoona.com/api/posts/comment",
//         commentData
//       );
//       const data = res.data;
//       const newComm = {
//         commentId: data.data.id,
//         userId: user.id,
//         username: user.name,
//         content: content,
//         userImage: user.image,
//       };
//       res.status === 201 && setComments((prev) => [newComm, ...prev]);
//       e.target[0].value = "";
//     } catch (err) {}
//   };

//   // to delte post
//   const handleDelete = async (e) => {
//     e.preventDefault();
//     const postId = post.id;

//     try {
//       const res = await axios.delete("https://cacoona.com/api/posts", {
//         data: { postId, email: user.email },
//       });
//       setOpenMenu(false);
//       location.reload();
//     } catch (err) {}
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setUpdate("Updating...");
//     const title = e.target[0].value;
//     const content = e.target[1].value;
//     const postId = post.id;
//     const addedImages = [];
//     if (imageSrc !== null) {
//       for (const imageUrl of imageSrc) {
//         const formData = new FormData();
//         formData.append("file", imageUrl);
//         formData.append("upload_preset", "my-upload");
//         try {
//           const data = await fetch(
//             "https://api.cloudinary.com/v1_1/dgav9ohkf/image/upload",
//             {
//               method: "POST",
//               body: formData,
//             }
//           ).then((r) => r.json());
//           console.log(data);
//           addedImages.push(data.url);
//         } catch (error) {
//           console.error("Error uploading image:", error);
//         }
//       }
//     }
//     const commonImages = initImages.filter((value) => images.includes(value));
//     const updatedImages = [...addedImages, ...commonImages];
//     const data = {
//       title,
//       content,
//       email: user.email,
//       postId,
//       images: updatedImages,
//     };
//     try {
//       const res = await axios.put("https://cacoona.com/api/posts", data);
//       setOpenUpdate(false);
//       location.reload();
//       setUpdate("Update");
//     } catch (err) {
//       setUpdate("Update");
//     }
//   };

//   const handleDeleteComment = async (e, commId) => {
//     e.preventDefault();
//     const commentId = commId;
//     try {
//       const res = await axios.delete("https://cacoona.com/api/posts/comment", {
//         data: { email: user.email, commentId },
//       });
//       const newcomms = [];
//       comments.forEach((comment) => {
//         if (comment.commentId !== commId) {
//           newcomms.push(comment);
//         }
//       });
//       setComments(newcomms);
//     } catch (err) {}
//   };

//   const handleImageRemove = (indexToRemove, image) => {
//     setImageSrc((prevImages) =>
//       prevImages.filter((url, index) => url !== image)
//     );
//     setImages((prev) => prev.filter((url, i) => i !== indexToRemove));
//   };

//   const isValidUrl = (string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };

//   return (
//     <div
//       className={`bg-white p-4 md:p-6 flex text-black relative last:rounded-b-3xl
//       `}
//     >
//       <div className="w-full ">
//         <div className="flex items-center gap-2 my-2">
//           <div className="relative rounded-full h-[60px] w-[60px]">
//             <Image
//               alt="User image"
//               className={`rounded-full object-cover ${
//                 post.userImage ? "" : "border-[3px] border-[#cccccc]"
//               }`}
//               fill={true}
//               src={post.userImage || "/Images/noAvatar.png"}
//             />
//           </div>
//           <div className="flex flex-col">
//             <h2 className="text-sm font-semibold">{post?.user}</h2>
//             <h3 className="text-xs">{format(post?.createdAt)}</h3>
//           </div>
//         </div>
//         {openUpdate ? (
//           <form onSubmit={handleUpdate}>
//             <div className="flex items-center gap-2 my-2 bg-[#F6F3F3] rounded-xl py-3 px-5">
//               <input
//                 ref={titleRef}
//                 defaultValue={post?.title}
//                 className="outline-none rounded-r-xl w-full bg-[#F6F3F3] placeholder:text-black"
//                 placeholder="Title"
//               ></input>
//             </div>
//             <div className="flex items-center gap-2 my-4 bg-[#F6F3F3] rounded-xl p-5">
//               <input
//                 ref={contentRef}
//                 defaultValue={post?.content}
//                 className="outline-none rounded-r-xl w-full bg-[#F6F3F3] placeholder:text-black"
//                 placeholder="Content"
//               ></input>
//             </div>
//             <div className="flex flex-col">
//               {images?.map((image, index) => (
//                 <div key={image} className="w-full h-full my-2">
//                   <div
//                     onClick={() => {
//                       handleImageRemove(index, image);
//                     }}
//                     className="cursor-pointer relative top-4 -left-2"
//                   >
//                     <span className="bg-gray-400 w-fit text-black px-2 py-0.5 font-medium rounded-full flex justify-center items-center">
//                       ×
//                     </span>
//                   </div>
//                   <Image
//                     alt="image"
//                     className="w-full h-full"
//                     width={1000}
//                     height={1000}
//                     src={image}
//                   ></Image>
//                 </div>
//               ))}
//             </div>
//             <div className="flex w-full justify-between items-center py-2">
//               <label
//                 htmlFor="photo"
//                 className="cursor-pointer flex gap-2 items-center text-white bg-[#4fa2ae] text-[14px] md:text-[16px] px-5 py-2 rounded-lg font-medium"
//               >
//                 <GrGallery />
//                 <span>Gallery</span>
//               </label>
//               <input
//                 name="file"
//                 ref={imageRef}
//                 onChange={handleOnChange}
//                 id="photo"
//                 className="hidden"
//                 type="file"
//               />
//               <button
//                 type="submit"
//                 className="cursor-pointer flex gap-2 items-center text-white bg-[#4fa2ae] text-[14px] md:text-[16px] px-5 py-2 rounded-lg font-medium"
//               >
//                 {update}
//               </button>
//             </div>
//           </form>
//         ) : (
//           <div>
//             <h2 className="text-2xl font-bold">{post?.title}</h2>
//             {isValidUrl(post?.content) ? (
//               <Link
//                 className="text-blue-700"
//                 href={post.content}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 {post?.content}
//               </Link>
//             ) : (
//               <p>{post?.content}</p>
//             )}
//             <div className="flex flex-col">
//               {post?.images?.map((image) => (
//                 <div key={image} className="relative w-full h-full my-2">
//                   <Image
//                     alt="image"
//                     className="h-full w-full"
//                     width={1000}
//                     height={1000}
//                     src={image}
//                   ></Image>
//                 </div>
//               ))}
//             </div>
//             <div className="flex items-center gap-8 mt-4">
//               <div className="cursor-pointer flex items-center justify-center gap-2">
//                 <div onClick={handleLike}>
//                   {isLiked ? (
//                     <MdFavorite className="w-6 h-6 text-[#FF0000]" />
//                   ) : (
//                     <MdFavoriteBorder className="w-6 h-6 text-[#FF0000]" />
//                   )}
//                 </div>
//                 <span className="font-medium">{likes}</span>
//               </div>
//               <div className="cursor-pointer flex items-center justify-center gap-2">
//                 <FaComment
//                   className="w-5 h-5 text-[#4fa2ae]"
//                   onClick={() => setcommopen(!commOpen)}
//                 />
//                 <span className="font-medium">{comments.length}</span>
//               </div>
//             </div>
//           </div>
//         )}
//         {commOpen && (
//           <div className="flex flex-col gap-2 pt-5">
//             <form onSubmit={handleSubmit} className="py-1 flex gap-2">
//               <input
//                 required={true}
//                 className="outline-none w-full bg-[#ECECEC] px-2.5 py-2 rounded-lg"
//                 placeholder="Write Comment"
//               ></input>
//               <button
//                 type="submit"
//                 className="px-3 py-1 bg-[#4fa2ae] text-[14px] md:text-[16px] rounded-lg text-white"
//               >
//                 Post
//               </button>
//             </form>
//             <div className="flex flex-col gap-2 ">
//               {comments?.slice(0, numCommentsToShow).map((comment) => (
//                 <div
//                   key={comment.commentId}
//                   className="flex flex-col gap-0.5 px-3 py-2 bg-[#ECECEC] rounded-lg"
//                 >
//                   <div className="flex gap-1 items-center">
//                     <Image
//                       alt="image"
//                       className="relative h-[35px] w-[35px] rounded-full bg-cover "
//                       height={1000}
//                       width={1000}
//                       src={
//                         comment.userImage
//                           ? comment.userImage
//                           : "/Images/noAvatar.png"
//                       }
//                     ></Image>
//                     <span className="text-sm font-semibold">
//                       {comment.username}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-end">
//                     <Comment text={comment.content} />
//                     {comment.userId == user?.id && (
//                       <button
//                         onClick={(e) => {
//                           handleDeleteComment(e, comment.commentId);
//                         }}
//                         className="flex items-center justify-center bg-[#4fa2ae] px-2.5 py-1 rounded-md text-sm text-white"
//                       >
//                         Delete
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               {totalComments > numCommentsToShow && (
//                 <button
//                   onClick={() => {
//                     setNumCommentsToShow((prev) => prev + 5);
//                   }}
//                   className="pt-3 text-gray-500 hover:underline"
//                 >
//                   Load more comments
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="absolute top-5 right-5  flex justify-end">
//         <div className="flex flex-col items-end">
//           <span
//             onClick={() => {
//               setOpenMenu(!openMenu);
//             }}
//             className={`${
//               post.userId === user?.id ? "cursor-pointer" : "cursor-not-allowed"
//             } text-lg font-semibold`}
//           >
//             •••
//           </span>
//           {openMenu && post.userId === user.id && (
//             <div className="flex flex-col bg-[#4fa2ae] text-white rounded-md">
//               <div
//                 onClick={handleDelete}
//                 className="cursor-pointer flex justify-center items-center px-5 py-2 border-b border-gray-300"
//               >
//                 Delete
//               </div>
//               <div
//                 onClick={() => {
//                   setOpenUpdate(!openUpdate), setOpenMenu(false);
//                 }}
//                 className="cursor-pointer flex justify-center items-center px-5 py-2"
//               >
//                 {openUpdate ? "Cancel" : "Update"}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Post;
