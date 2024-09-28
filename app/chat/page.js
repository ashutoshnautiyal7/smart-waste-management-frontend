"use client";

import { useState } from "react";
import axios from "axios";


const page = () => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedImage, setSelectedImage] = useState(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
  const [preview, setPreview] = useState(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
  const [prompt, setPrompt] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
  const [response, setResponse] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
  const [loading, setLoading] = useState(false);

  // Handle image selection and generate preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    // Generate image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Set preview as base64
      };
      reader.readAsDataURL(file); // Read the file as Data URL
    } else {
      setPreview(null); // Reset preview if no image is selected
    }
  };
  // Handle form submission for custom prompt
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("prompt", prompt);

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/describe-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(res.data.description);
    } catch (error) {
      console.error("Error uploading the image:", error);
      setResponse("Error processing the image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReuse = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/reuse", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data.description);
    } catch (error) {
      console.error("Error uploading the image:", error);
      setResponse("Error processing the image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRecycle = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/recycle", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data.description);
    } catch (error) {
      console.error("Error uploading the image:", error);
      setResponse("Error processing the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen font-sans">
    <h1 className="text-3xl font-bold mb-8 text-gray-800">Smart Waste Management and Social Welfare</h1> 

    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Select an Image or Use Camera</label>
        <input
          type="file"
          accept="image/*"
          capture="environment" 
          onChange={handleImageChange}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {preview && (
        <div className="mb-6">
          <img
            src={preview}
            alt="Preview"
            className="w-64 h-auto rounded-md shadow-md mx-auto border border-gray-200"
          />
        </div>
      )}

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Custom Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a custom prompt for the image description"
          className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Custom Prompt'}
        </button>
      </div>
    </form>

    <div className="mt-4 flex space-x-4">
      <button
        onClick={handleSubmitReuse}
        className={`bg-green-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Reuse'}
      </button>

      <button
        onClick={handleSubmitRecycle}
        className={`bg-red-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Recycle'}
      </button>
    </div>

    {response && (
      <div className="mt-8 p-6 bg-gray-100 rounded-md shadow-md w-full max-w-lg">
        <h3 className="text-xl font-semibold text-gray-800">Response:</h3>
        <p className="text-gray-600 mt-2">{response}</p>
      </div>
    )}
  </div>
  )
}

export default page