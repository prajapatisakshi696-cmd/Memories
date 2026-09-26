import Avatar from "react-avatar";
import { getImageUrl } from "../helper";

const UserAvatar = ({ user, size = 40, className = "" }) => {
  if (user?.profile_picture) {
    return (
      <img
        src={getImageUrl(user.profile_picture)}
        alt={user.username || "user"}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <Avatar
      name={user?.full_name || user?.username || "User"}
      size={size.toString()}
      round={true}
      className={className}
    />
  );
};

export default UserAvatar;