import { PenBox, Verified, MapPin, Calendar, BadgeCheck } from "lucide-react";
import moment from "moment";
import React from "react";
import Avatar from "react-avatar";


const UserProfileInfo = ({ user, posts, profileId, setShowEdits }) => {
  return (
    <div className="relative py-4 px-6 md:px-8 bg-white">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Profile picture */}
        <div className="w-32 h-32 border-4 border-white shadow-lg absolute -top-16 rounded-full overflow-hidden">
          {user?.profile_picture ? (
            <img
              src={`http://localhost:5000${user.profile_picture}`}
              alt={user?.username}
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <Avatar
              name={user?.full_name || user?.username || "User"}
              size="128"
              round={true}
              color={Avatar.getRandomColor("sitebase", [
                "red",
                "green",
                "blue",
              ])}
            />
          )}
        </div>

        {/* User info */}
        <div className="w-full pt-16 md:pt-0 md:pl-36">
          <div className="flex flex-col md:flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.full_name || user?.username || "No Name"}
                </h1>
                <Verified className="w-6 h-6 text-blue-500" />
              </div>
              <p>{user?.username ? `@${user.username}` : "Add a username"}</p>
            </div>

            {/* Edit button only if it's own profile */}
            {!profileId && (
              <button
                className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50
                px-3 py-2 rounded-lg font-medium transition-colors mt-4 md:mt-0"
                onClick={() => setShowEdits(true)}
              >
                <PenBox className="w-4 h-4" /> Edit
              </button>
            )}
          </div>

          {/* Bio */}
          <p className="text-gray-700 text-sm max-w-md mt-4">{user?.bio}</p>

          {/* Extra info */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {user?.location || "Add location"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Joined{" "}
              <span className="font-medium">
                {user?.createdAt ? moment(user.createdAt).fromNow() : "N/A"}
              </span>
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6 border-t border-gray-200 pt-4">
            <div>
              <span className="sm:text-xl font-bold text-gray-900">
                {posts?.length || 0}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1.5">
                Posts
              </span>
            </div>
            <div>
              <span className="sm:text-xl font-bold text-gray-900">
                {posts.reduce(
                  (acc, post) => acc + (post.likes?.length || 0),
                  0,
                )}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1.5">
                Likes
              </span>
            </div>
            <div>
              <span className="sm:text-xl font-bold text-gray-900">
                {posts.reduce(
                  (acc, post) => acc + (post.comments?.length || 0),
                  0,
                )}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1.5">
                Comments
              </span>
            </div>
            {/* Followers */}
            <div className="cursor-pointer">
              <span className="sm:text-xl font-bold text-gray-900">
                {user?.followers?.length || 0}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1.5">
                Followers
              </span>
            </div>

            {/* Following */}
            <div className="cursor-pointer">
              <span className="sm:text-xl font-bold text-gray-900">
                {user?.following?.length || 0}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1.5">
                Following
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
