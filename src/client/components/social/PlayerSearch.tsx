import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useUserStore } from "../../store/useUserStore";
import PlayerCard from "../PlayerCard";
import { useDebounce } from "../../hooks/useDebounce";
import Loader from "../ui/Loader";
import { useFindUsersQuery } from "../../api/queries/users";

const PlayerSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  const { isLoading } = useFindUsersQuery(debouncedSearchQuery);
  const { foundUsers } = useUserStore();

  return (
    <div className="flex flex-col h-full px-4 pb-4">
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <BiSearch className="text-gray-400" size={20} />
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-emerald-500 transition-all"
          placeholder="Search by name or ID..."
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {isLoading ? (
          <Loader />
        ) : (
          foundUsers.map((user) => (
            <PlayerCard key={user.userId} playerInfo={user} />
          ))
        )}
      </div>
    </div>
  );
};

export default PlayerSearch;
