import { FaUserFriends } from "react-icons/fa";
import { useFriendStore } from "../../store/useFriendStore";
import PlayerCard from "../PlayerCard";
import { useFriendsQuery } from "../../api/queries/friends";
import Loader from "../ui/Loader";

const FriendList = () => {
  const { friends } = useFriendStore();
  const { isLoading } = useFriendsQuery();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar">
      {friends.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
          <FaUserFriends size={40} className="opacity-20" />
          <p>Your friend list is empty</p>
        </div>
      ) : (
        friends.map((user) => (
          <PlayerCard key={user.id} friendRequestInfo={user} />
        ))
      )}
    </div>
  );
};

export default FriendList;
