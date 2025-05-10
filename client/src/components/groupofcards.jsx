import Card from "./card"

export default function GroupOfCards({data = [], user }){
    return(
        <div className="min-h-screen w-full flex flex-col">
            <p className="text-l font-semibold pl-4 pt-2">filler</p>
            <div className="flex flex-wrap p-4 gap-4 items-stretch">
                {data.slice().map((item) => (
                    <Card key={item._id} cardInfo={item} user={user} />
                ))}
            </div>
        </div>
    )
}
