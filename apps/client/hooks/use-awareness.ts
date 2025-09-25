import { useEffect, useState, useCallback, useRef } from 'react';
import { Awareness } from 'y-protocols/awareness';
import { UserAwarenessState, HocuspocusConnection } from '../lib/hocuspocus';

export interface UseAwarenessOptions {
  connection: HocuspocusConnection | null;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export interface UseAwarenessReturn {
  // Current user's awareness state
  localState: UserAwarenessState | null;

  // Other users' awareness states
  remoteStates: Map<number, UserAwarenessState>;

  // Methods to update awareness
  setCursor: (x: number, y: number, visible?: boolean) => void;
  setSelection: (
    elementIds: string[],
    action?: 'selecting' | 'editing' | 'transforming'
  ) => void;
  clearCursor: () => void;
  clearSelection: () => void;

  // Utility methods
  getActiveUsers: () => UserAwarenessState[];
  getUserByClientId: (clientId: number) => UserAwarenessState | undefined;
  isUserActive: (clientId: number) => boolean;
}

/**
 * Custom hook for managing user awareness in collaborative canvas
 */
export const useAwareness = ({
  connection,
  userId,
  userName = 'Anonymous',
  userEmail,
  userAvatar,
}: UseAwarenessOptions): UseAwarenessReturn => {
  const [localState, setLocalState] = useState<UserAwarenessState | null>(null);
  const [remoteStates, setRemoteStates] = useState<
    Map<number, UserAwarenessState>
  >(new Map());

  const awarenessRef = useRef<Awareness | null>(null);

  // Initialize user awareness when connection is established
  useEffect(() => {
    if (!connection?.awareness || !userId) return;

    awarenessRef.current = connection.awareness;

    // Set initial user state
    const initialState: UserAwarenessState = {
      user: {
        id: userId,
        name: userName,
        email: userEmail,
        avatar: userAvatar,
        color: connection.generateUserColor(),
      },
      lastSeen: Date.now(),
    };

    connection.setUserAwareness(initialState);
    setLocalState(initialState);

    // Set up awareness change listener
    const handleAwarenessChange = () => {
      // Update local state
      const currentLocal = connection.getUserAwareness();
      setLocalState(currentLocal);

      // Update remote states
      const allRemoteStates = connection.getAllUserAwareness();
      setRemoteStates(new Map(allRemoteStates));
    };

    // Listen for awareness changes
    connection.awareness.on('change', handleAwarenessChange);

    // Initial load of remote states
    handleAwarenessChange();

    // Cleanup
    return () => {
      if (connection.awareness) {
        connection.awareness.off('change', handleAwarenessChange);
      }
    };
  }, [connection, userId, userName, userEmail, userAvatar]);

  // Update cursor position
  const setCursor = useCallback(
    (x: number, y: number, visible: boolean = true) => {
      if (!connection || !localState) return;

      connection.setUserAwareness({
        ...localState,
        cursor: { x, y, visible },
      });
    },
    [connection, localState]
  );

  // Update selection state
  const setSelection = useCallback(
    (
      elementIds: string[],
      action: 'selecting' | 'editing' | 'transforming' = 'selecting'
    ) => {
      if (!connection || !localState) return;

      connection.setUserAwareness({
        ...localState,
        selection: { elementIds, action },
      });
    },
    [connection, localState]
  );

  // Clear cursor
  const clearCursor = useCallback(() => {
    if (!connection || !localState) return;

    connection.setUserAwareness({
      ...localState,
      cursor: undefined,
    });
  }, [connection, localState]);

  // Clear selection
  const clearSelection = useCallback(() => {
    if (!connection || !localState) return;

    connection.setUserAwareness({
      ...localState,
      selection: undefined,
    });
  }, [connection, localState]);

  // Get all active users (excluding current user)
  const getActiveUsers = useCallback((): UserAwarenessState[] => {
    const now = Date.now();
    const activeThreshold = 30000; // 30 seconds

    return Array.from(remoteStates.values()).filter(
      state => now - state.lastSeen < activeThreshold
    );
  }, [remoteStates]);

  // Get user by client ID
  const getUserByClientId = useCallback(
    (clientId: number): UserAwarenessState | undefined => {
      return remoteStates.get(clientId);
    },
    [remoteStates]
  );

  // Check if user is active
  const isUserActive = useCallback(
    (clientId: number): boolean => {
      const user = remoteStates.get(clientId);
      if (!user) return false;

      const now = Date.now();
      const activeThreshold = 30000; // 30 seconds
      return now - user.lastSeen < activeThreshold;
    },
    [remoteStates]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (awarenessRef.current) {
        awarenessRef.current.setLocalState(null);
      }
    };
  }, []);

  return {
    localState,
    remoteStates,
    setCursor,
    setSelection,
    clearCursor,
    clearSelection,
    getActiveUsers,
    getUserByClientId,
    isUserActive,
  };
};
