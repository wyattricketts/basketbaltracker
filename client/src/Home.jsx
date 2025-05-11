import FilterButton from "./components/filterButton"
import GroupOfCards from "./components/groupofcards"
import AddButton from "./components/addButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDebounce } from 'use-debounce';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Admin from "./components/admin";


export default function Home() {

  let [eventData, setEventData] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(undefined)
  const filters = [
    { label: "Free", value: "Free" },
    { label: "West Campus", value: "West Campus" },
    { label: "North Campus", value: "North Campus" },
    { label: "Collegetown", value: "Collegetown" },
    { label: "My Posts", value: "MyPosts" }
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchParam] = useDebounce(searchQuery, 600);

  function loadEventData() {
    let filter = {};
    if (currentFilter) {
      if (currentFilter === "MyPosts" && user) {
        filter.userId = user.sub;
      } else {
        filter[currentFilter] = true;
      }
    }
    if (searchParam !== "") {
      filter.q = searchParam;
    }

    axios.get('/api/events', { params: filter })
      .then((response) => {
        setIsLoading(false);
        setEventData(response.data);
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    setIsLoading(true);
    loadEventData();
  }, [currentFilter, searchParam]);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAdmin = user && user.email === "wjr78@cornell.edu";

  function handleLoginSuccess(credentialResponse) {
    const decoded = jwtDecode(credentialResponse.credential);
    if (decoded.email.endsWith('@cornell.edu')) {
      setUser({ ...decoded, credential: credentialResponse.credential });
      localStorage.setItem('user', JSON.stringify({ ...decoded, credential: credentialResponse.credential }));
    } if (decoded.email == "wjr78@cornell.edu") {
      setIsAdmin(true)
    }else {
      alert('Please use your Cornell email.');
    }
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem('user');
    googleLogout();
  }

  return (
    <div>
          <div className="flex pt-4">
            <p className="text-2xl font-semibold p-4">Clutterfly</p>
            <input className="rounded-xl w-2/5 h-10 self-center bg-slate-200 p-3" type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
              }}
              placeholder="Search 🔎"
            ></input>
            <AddButton disabled={!user} user={user} />
            <div className="pt-4">
              {!user ? (
                <GoogleLogin onSuccess={handleLoginSuccess} onError={() => alert('Login Failed')} />
              ) : (
                <div className="">
                  <span className="pr-2">Welcome, {user.name}</span>
                  <button className="p-2 bg-red-300 rounded-full hover:bg-red-500" onClick={handleLogout}>Sign out</button>
                </div>
              )}
            </div>

          </div>
          <div>
            <p className="italic pl-4">Let your clutter fly away</p>
            {eventData.length > 0 ? ([]) : (
              <p className="pl-45 text-red-400 font-bold">
                No search results found</p>)}
          </div>
          <div className="flex">
            {filters.map((filter) => (
              <FilterButton
                key={filter.value}
                text={filter.label}
                selected={currentFilter === filter.value}
                onClick={() => setCurrentFilter(
                  currentFilter === filter.value ? undefined : filter.value)}
              />
            ))}
          </div>
          {isLoading && (
            <div className="flex justify-center items-center my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
              <span className="ml-3 text-amber-700 font-semibold">Loading events...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-200 border border-red-600 text-red-800 px-4 py-2 rounded-xl my-4 text-center font-semibold">
              Error loading events. Please try again later.
            </div>
          )}
      {!isAdmin ? (
          <GroupOfCards data={eventData} user={user} />
      ) : (
        <Admin data={eventData} user={user}/>
      )}
    </div>
  )
}
