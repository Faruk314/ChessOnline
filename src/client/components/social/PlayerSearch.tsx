import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useUserStore } from "../../store/useUserStore";
import { useFindUsersMutation } from "../../api/queries/users";
import PlayerCard from "../PlayerCard";
import { useDebounce } from "../../hooks/useDebounce";
import Loader from "../ui/Loader";

const PlayerSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { foundUsers, setFoundUsers } = useUserStore();
  const { mutate: findUsers, isPending } = useFindUsersMutation();
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  useEffect(() => {
    if (debouncedSearchQuery.trim().length === 0) {
      setFoundUsers([]);
      return;
    }
    findUsers(debouncedSearchQuery);
  }, [debouncedSearchQuery, findUsers, setFoundUsers]);

  return (
    <div className="flex flex-col h-full px-4 pb-4">
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BiSearch className="text-gray-400" size={20} />
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            placeholder="Search by name or ID..."
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {isPending ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader />
          </div>
        ) : (
          <>
            {foundUsers.length === 0 && searchQuery && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>No players found</p>
              </div>
            )}
            {foundUsers.map((user) => (
              <PlayerCard key={user.userId} friendRequestInfo={user} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerSearch;
