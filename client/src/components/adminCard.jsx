import { useState } from "react";
import axios from "axios";

export default function AdminCard({ cardInfo, user }) {

    return (
        <div
            className="p-4 w-80 min-h-80 bg-neutral-200 rounded-xl text-left" >
            <img src={cardInfo.imageUrl} alt="" className="rounded-lg w-full h-80 object-cover" />
            <p className="text-2xl font-semibold">$ {cardInfo.price}</p>
            <p className="text-2xl font-semibold">{cardInfo.description}</p>
            <p className={cardInfo.status === "pending" ? ("bg-orange-300 pl-2 rounded-xl bold") : ("bg-green-300 pl-2 rounded-xl bold")}>{cardInfo.status}</p>
            <div className="pt-2 flex gap-4 justify-center">
                {cardInfo.status === "pending" && (
                    <button
                        onClick={async () => {
                            await axios.patch(`/api/events/admin/${cardInfo._id}/approve`, {}, {
                                headers: {
                                    Authorization: `Bearer ${user.credential}`
                                }
                            });
                            window.location.reload();
                        }}
                        className="p-2 bg-green-500 text-white rounded"
                    >
                        Approve
                    </button>
                )}
                <button
                    onClick={async () => {
                        await axios.delete(`/api/events/admin/${cardInfo._id}`, {
                            headers: {
                                Authorization: `Bearer ${user.credential}`
                            }
                        });
                        window.location.reload();
                    }}
                    className="p-2 bg-red-500 text-white rounded"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}
