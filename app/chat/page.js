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

  const formatResponseToHTML = (responseText) => {
    let formattedText = responseText
      .replace(/\n\n/g, '</p><p>')  // Convert double newlines to paragraphs
      .replace(/(\d+)\.\s/g, '<li>')  // Convert numbered list items
      .replace(/<li>/g, '</li><li>');  // Close previous <li> before adding new one
  
    // Handling URLs by wrapping them in <a> tags
    formattedText = formattedText.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" class="text-blue-500 underline">$1</a>'
    );
  
    return `<p>${formattedText}</p>`;
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 font-sans">
    {/* Left side chat section */}
    <div className="w-full lg:w-1/3 bg-white p-6 border-r border-gray-300 h-full shadow-lg overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Chat Input</h1>
  
      {/* Form for uploading image and entering custom prompt */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Upload an Image</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="block w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {/* Image preview */}
        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto rounded-md shadow-sm border border-gray-200"
            />
          </div>
        )}
  
        <div>
          <label className="block text-gray-700 font-medium mb-2">Custom Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter custom prompt"
            className="w-full h-28 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {/* Submit buttons */}
        <div className="space-y-4">
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 hover:bg-blue-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
  
          <div className="flex space-x-2">
            <button
              onClick={handleSubmitReuse}
              className={`w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 hover:bg-green-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Reuse'}
            </button>
  
            <button
              onClick={handleSubmitRecycle}
              className={`w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 hover:bg-red-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Recycle'}
            </button>
          </div>
        </div>
      </form>
    </div>
  
    {/* Right side response section */}
    <div className="w-full lg:w-2/3 p-8 overflow-auto bg-gray-50 flex flex-col items-start justify-start">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">Response Output</h1>
  
      {response && (
        <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Response:</h3>
  
          {/* Rendering formatted HTML content */}
          <div
            className="prose prose-lg text-gray-700 overflow-y-auto max-h-[50vh]"
            dangerouslySetInnerHTML={{ __html: formatResponseToHTML(response) }}
          />
        </div>
      )}
    </div>
  </div>
  


  )
}

export default page