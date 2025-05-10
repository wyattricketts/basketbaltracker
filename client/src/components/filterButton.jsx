export default function FilterBar({text, selected, onClick}) {
  return (
    <div className="p-4">
    <button className= {selected ? "bg-amber-600 rounded-full py-1 px-3 text-white":"bg-amber-600/60 rounded-full py-1 px-3 text-white"}
    onClick={onClick}
    >  {text}</button>
    </div>
  )
}
