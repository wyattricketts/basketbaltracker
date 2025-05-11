import AdminCard from "./adminCard"

export default function Admin({data, user}) {

    return (
        <div className="min-h-screen w-full flex flex-col">
            <p className="text-l font-semibold pl-4 pt-2">Admin Dashboard</p>
            <div className="flex flex-wrap p-4 gap-4 items-stretch">
                {data.slice().map((item) => (
                    <AdminCard key={item._id} cardInfo={item} user={user} />
                ))}
            </div>
        </div>
    )
}
