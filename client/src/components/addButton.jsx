import { useState } from "react"
import axios from "axios";

const LOCATION_OPTIONS = ["West Campus", "North Campus", "Collegetown", "other"];
const TAG_OPTIONS = ["Free", "Firm Price", "Flexible Price", "Shirt", "Hoodie"];

export default function AddButton({ disabled, user }) {
    let [isPopUpOpen, setPopUp] = useState(false);
    let [description, setDescription] = useState("");
    let [price, setPrice] = useState("");
    let [location, setLocation] = useState(LOCATION_OPTIONS[0]);
    let [tags, setTags] = useState([]);
    let [image, setImage] = useState(null);
    let [imageUrl, setImageUrl] = useState();
    const DESCRIPTION_LIMIT = 50;
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_IMAGE_SIZE) {
                alert("Image is too large. Max size is 2MB.");
                return;
            }
            setImage(file);
        }
    };

    const handleTagChange = (tag) => {
        setTags(tags =>
            tags.includes(tag)
                ? tags.filter(t => t !== tag)
                : [...tags, tag]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("You must be signed in to post an event.");
            return;
        }
        if (!description.trim()) {
            alert("Please enter a title/description.");
            return;
        }
        if (!price || isNaN(price)) {
            alert("Please enter a valid price.");
            return;
        }
        let uploadedImageUrl = "";
        if (image) {
            const formData = new FormData();
            formData.append('image', image);
            try {
                const res = await axios.post('/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                uploadedImageUrl = res.data.url;
            } catch (err) {
                alert("Image upload failed.");
                return;
            }
        }
        try {
            await axios.post("/api/events", {
                description,
                price,
                location,
                tags,
                imageUrl: uploadedImageUrl
            }, {
                headers: {
                    Authorization: `Bearer ${user.credential}`
                }
            });
            setPopUp(false);
            setDescription("");
            setPrice("");
            setLocation(LOCATION_OPTIONS[0]);
            setTags([]);
            setImage(null);
            setImageUrl(undefined);
        } catch (err) {
            alert("Failed to add event.");
        }
    };

    return (
        <div className="p-4">
            <dialog
                open={isPopUpOpen}
                className="bg-neutral-300/93 drop-shadow-2xl w-100 rounded-2xl fixed top-40 place-self-center"
            >
                <button className="p-2 m-2 bg-orange-300 rounded-xl hover:bg-orange-400" onClick={() => setPopUp(false)}>Cancel</button>
                <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit} encType="multipart/form-data">
                    {/* Description */}
                    <label className="font-semibold">
                        Description
                        <textarea
                            className="w-full rounded p-2 mt-1"
                            maxLength={DESCRIPTION_LIMIT}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Describe your item..."
                            required
                        />
                        <span className="text-xs text-gray-600">
                            {description.length}/{DESCRIPTION_LIMIT} characters
                        </span>
                    </label>
                    {/* Price */}
                    <label className="font-semibold">
                        Price
                        <input
                            type="number"
                            className="w-full rounded p-2 mt-1"
                            value={price}
                            min="0"
                            onChange={e => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                            placeholder="Enter price"
                            required
                        />
                    </label>
                    {/* Location */}
                    <label className="font-semibold">
                        Location
                        <select
                            className="w-full rounded p-2 mt-1"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                        >
                            {LOCATION_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </label>
                    {/* Tags */}
                    <label className="font-semibold">
                        Tags
                        <div className="flex flex-wrap gap-2 mt-1">
                            {TAG_OPTIONS.map(tag => (
                                <label key={tag} className="flex items-center gap-1">
                                    <input
                                        type="checkbox"
                                        checked={tags.includes(tag)}
                                        onChange={() => handleTagChange(tag)}
                                    />
                                    {tag}
                                </label>
                            ))}
                        </div>
                    </label>
                    {/* Image Upload */}
                    <label className="font-semibold">
                        Image
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full rounded p-2 mt-1"
                            onChange={handleImageChange}
                        />
                    </label>
                    {user ? (
                        <button
                            type="submit"
                            className="p-2 rounded-full bg-green-500/80"
                        >
                            Post
                        </button>
                    ) : (
                        <button type="submit" className="p-2 bg-slate-400/80 rounded-full">
                            Sign in to post
                        </button>
                    )}
                </form>
            </dialog>
            <button
                className="p-2 w-10 h-10 bg-slate-300 hover:bg-slate-500/80 rounded-full font-semibold"
                onClick={() => setPopUp(true)}
            >+</button>
        </div>
    )
}
