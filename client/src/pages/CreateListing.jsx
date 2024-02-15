import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { app } from "../firebase.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { get } from "mongoose";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bethrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(formData);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storageImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const storageImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
      console.log("data recorded successfully");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className=" max-w-3xl mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        className=" flex flex-col gap-4 sm:flex-row"
      >
        <div className="flex flex-col gap-4 flex-1 ">
          <input
            type="text"
            placeholder="Title"
            className="border rounded-lg p-3"
            maxLength="62"
            minLength="10"
            id="name"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border rounded-lg p-3"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border rounded-lg p-3"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex gap-6 flex-wrap items-center">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className=" w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span className="">Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className=" w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span className="">Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className=" w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span className="">Park Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className=" w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span className="">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className=" w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span className="">Offer</span>
            </div>

            <div className="flex flex-wrap gap-6 ">
              <div className="flex gap-2 items-center ">
                <input
                  type="number"
                  id="bethrooms"
                  className=" p-3 border rounded-lg"
                  min="1"
                  max="10"
                  onChange={handleChange}
                  value={formData.bethrooms}
                  required
                />
                <p>Beds</p>
              </div>
              <div className="flex gap-2 items-center ">
                <input
                  type="number"
                  id="bathrooms"
                  className=" p-3 border rounded-lg"
                  min="1"
                  max="10"
                  onChange={handleChange}
                  value={formData.bathrooms}
                  required
                />
                <p>Baths</p>
              </div>
              <div className="flex gap-2 items-center ">
                <input
                  type="number"
                  id="regularPrice"
                  className=" p-3 border rounded-lg "
                  min="50"
                  max="10000000"
                  required
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Regular price</p>
                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
              {formData.offer && (
                <div className="flex gap-2 items-center ">
                <input
                  type="number"
                  id="discountPrice"
                  className=" p-3 border rounded-lg"
                  min="0"
                  max="10000000"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>

                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <div>
            <p className=" font-semibold ">
              Iamage:
              <span className=" font-normal ml-2 text-gray-600">
                The first image will be the cover (max 6)
              </span>
            </p>
          </div>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              accept="images/*"
              multiple
              className=" p-3 w-full rounded-md border border-gray-300 "
            />
            <button
              disabled = {uploading}
              type="button"
              onClick={handleImageSubmit}
              className=" p-3 text-green-700 border rounded-md border-green-700  hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && <span>{imageUploadError}</span>}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className=" p-3 bg-gray-700 uppercase hover:opacity-95 text-white rounded-lg disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
