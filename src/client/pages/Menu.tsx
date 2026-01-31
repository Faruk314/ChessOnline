import { useContext, useState } from "react";
import { ImUser, ImUsers } from "react-icons/im";
import { BiEnvelope, BiEnvelopeOpen, BiSearch } from "react-icons/bi";
import { FaSignOutAlt } from "react-icons/fa";
import SoundButton from "../components/SoundButton";
import UserInfo from "../components/UserInfo";
import FindMatch from "../modals/FindMatch";
import ChangeAvatar from "../modals/ChangeAvatar";
import FriendRequests from "../modals/FriendRequests";
import SocialHub from "../modals/SocialHub";
import GameInvites from "../modals/GameInvites";
import { SocketContext } from "../context/SocketContext";
import { useSoundStore } from "../store/useSoundStore";
import { useGameInvitesStore } from "../store/useGameInvitesStore";
import { useFriendStore } from "../store/useFriendStore";
import { useModalStore } from "../store/useModalStore";
import { useLogoutMutation } from "../api/queries/auth";
import { useFriendRequestsQuery } from "../api/queries/friends";
import { useGameInvitesQuery } from "../api/queries/gameInvites";
import { MenuButton } from "../components/ui/MenuButton";
import { IconButton } from "../components/ui/IconButton";
import { MenuLayout } from "../components/layouts/MenuLayout";
import MainLoader from "../components/ui/MainLoader";

const Menu = () => {
  const { mutate: logoutUser } = useLogoutMutation();
  const { socket } = useContext(SocketContext);
  const { playMoveSound } = useSoundStore();
  const { friendRequests } = useFriendStore();
  const { gameInvites } = useGameInvitesStore();

  const { isLoading: isLoadingFriends } = useFriendRequestsQuery();
  const { isLoading: isLoadingInvites } = useGameInvitesQuery();

  const [openFindMatch, setOpenFindMatch] = useState(false);
  const [openInvites, setOpenInvites] = useState(false);
  const [openSocialHub, setOpenSocialHub] = useState(false);
  const { openChangeAvatar } = useModalStore();
  const [openFriendReq, setOpenFriendReq] = useState(false);

  if (isLoadingFriends || isLoadingInvites) {
    return <MainLoader />;
  }

  const headerContent = (
    <>
      <SoundButton />

      <IconButton
        active={openFriendReq}
        badgeCount={friendRequests.length}
        onClick={(e) => {
          e.stopPropagation();
          setOpenInvites(false);
          setOpenFriendReq((prev) => !prev);
        }}
      >
        <ImUsers size={20} />
      </IconButton>

      <IconButton
        active={openInvites}
        badgeCount={gameInvites.length}
        onClick={(e) => {
          e.stopPropagation();
          setOpenFriendReq(false);
          setOpenInvites((prev) => !prev);
        }}
      >
        {openInvites ? <BiEnvelopeOpen size={20} /> : <BiEnvelope size={20} />}
      </IconButton>
    </>
  );

  return (
    <MenuLayout headerContent={headerContent} topRightContent={<UserInfo />}>
      <MenuButton
        icon={ImUser}
        label="PLAY LOCAL"
        onHover={() => playMoveSound()}
        onClick={() => {
          socket?.emit("startSinglePlayer");
        }}
      />

      <MenuButton
        icon={BiSearch}
        label="FIND MATCH"
        variant="primary"
        onHover={() => playMoveSound()}
        onClick={() => {
          setOpenFindMatch(true);
        }}
      />

      <MenuButton
        icon={ImUsers}
        label="FRIENDS"
        onHover={() => playMoveSound()}
        onClick={() => setOpenSocialHub(true)}
      />

      <button
        onClick={() => logoutUser()}
        onMouseEnter={() => playMoveSound()}
        className="mt-4 flex items-center justify-center px-6 py-3 md:px-8 md:py-4 space-x-2 text-base md:text-lg text-gray-400 hover:text-red-400 transition-colors"
      >
        <FaSignOutAlt />
        <span>Exit Game</span>
      </button>

      {openFindMatch && <FindMatch setOpenFindMatch={setOpenFindMatch} />}
      {openChangeAvatar && <ChangeAvatar />}
      {openSocialHub && <SocialHub onClose={() => setOpenSocialHub(false)} />}
      {openFriendReq && <FriendRequests setOpenFriendReq={setOpenFriendReq} />}
      {openInvites && <GameInvites setOpenInvites={setOpenInvites} />}
    </MenuLayout>
  );
};

export default Menu;
