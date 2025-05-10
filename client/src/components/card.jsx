import { useState } from "react";
import axios from "axios";

export default function Card({ cardInfo, user }) {
    let [isPopUpOpen, setPopUp] = useState(false);
    let [showMessageBox, setShowMessageBox] = useState(false);
    let [message, setMessage] = useState("");


    function handleSendEmail() {
        const email = cardInfo.userEmail;
        if (!email) {
            alert("No email available for this user.");
            return;
        }
        const subject = encodeURIComponent("Interested in your item on Clutterfly");
        const body = encodeURIComponent(message || "Hi, I'm interested in your post!");
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }


    return (
        <div>
            <dialog className="bg-neutral-300/93 drop-shadow-2xl w-100 rounded-2xl fixed top-40 place-self-center"
                open={isPopUpOpen}>
                <div className="p-4">
                    <button
                        className="border-2 border-amber-600 w-12 h-8 rounded-full hover:bg-orange-400/50"
                        onClick={() => setPopUp(false)}
                    >exit</button>
                    <img src={cardInfo.imageUrl} alt="" className="p-2 rounded-lg w-full h-80 object-cover" />
                    <p className="text-2xl font-semibold">{cardInfo.description}</p>
                    <div className="flex gap-x-4 pt-3">
                        <div className="flex font-semibold">
                            <p>$</p>
                            <p className="pl-2">{cardInfo.price}</p>
                        </div>
                        <p className="italic">{cardInfo.tags}</p>
                    </div>
                    <div className="flex gap-x-4 pb-2">
                        <p className="italic font-light">{cardInfo.location}</p>
                    </div>
                    {user && user.sub !== cardInfo.userId ? (
                        <div className="pt-2 flex gap-20 justify-center">
                            {!showMessageBox ? (
                                <button
                                    onClick={() => setShowMessageBox(true)}
                                    className="border-2 border-orange-600 bg-orange-300 w-50 h-10 rounded-full text-xl hover:bg-orange-600/50"
                                > Message </button>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <textarea
                                        className="rounded p-2 w-64 h-20"
                                        placeholder="Write your message here..."
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSendEmail}
                                            className="border-2 border-green-600 bg-green-300 rounded-full px-4 py-2 hover:bg-green-500"
                                        >Send Email</button>
                                        <button
                                            onClick={() => setShowMessageBox(false)}
                                            className="border-2 border-gray-400 bg-gray-200 rounded-full px-4 py-2 hover:bg-gray-400"
                                        >Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={async () => {
                                if (window.confirm("Are you sure you want to delete this event?")) {
                                    await axios.delete(`/api/events/${cardInfo._id}`, {
                                        headers: {
                                            Authorization: `Bearer ${user.credential}`
                                        }
                                    });
                                }
                            }}
                            className="p-2 bg-red-500 text-white rounded"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </dialog >

            <button
                onClick={() => setPopUp(true)}
                className="p-4 w-80 min-h-80 bg-neutral-200 rounded-xl text-left hover:bg-neutral-300">
                <img src={cardInfo.imageUrl} alt="" className="rounded-lg w-full h-80 object-cover" />
                <p className="text-2xl font-semibold">$ {cardInfo.price}</p>
            </button>
        </div >
    )
}
