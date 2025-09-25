import { UserAwarenessState } from '@/lib/hocuspocus';

interface ActiveUsersListProps {
  activeUsers: UserAwarenessState[];
  className?: string;
}

export const ActiveUsersList = ({
  activeUsers,
  className = '',
}: ActiveUsersListProps) => {
  if (activeUsers.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-gray-600 font-medium">
        {activeUsers.length} user{activeUsers.length > 1 ? 's' : ''} online:
      </span>

      <div className="flex -space-x-2">
        {activeUsers.slice(0, 5).map((user, index) => (
          <div
            key={user.user.id}
            className="relative"
            title={`${user.user.name}${user.user.email ? ` (${user.user.email})` : ''}`}
          >
            {user.user.avatar ? (
              <img
                src={user.user.avatar}
                alt={user.user.name}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                style={{ borderColor: user.user.color }}
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: user.user.color }}
              >
                {user.user.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
        ))}

        {activeUsers.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-gray-600 text-xs font-bold">
            +{activeUsers.length - 5}
          </div>
        )}
      </div>
    </div>
  );
};
