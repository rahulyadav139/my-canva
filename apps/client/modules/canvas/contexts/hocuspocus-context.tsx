'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { connectionManager } from '../../../lib/hocuspocus';

// Types for the provider context
export interface HocuspocusProviderContextType {
  isInitialized: boolean;
  connectionCount: number;
  globalConnectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  error: string | null;

  // Methods
  getConnectionStatus: (
    canvasId: string
  ) => { connected: boolean; synced: boolean } | null;
  closeConnection: (canvasId: string) => void;
  closeAllConnections: () => void;
}

// Create the context
const HocuspocusProviderContext =
  createContext<HocuspocusProviderContextType | null>(null);

// Props for the provider component
export interface HocuspocusProviderProps {
  children: ReactNode;

  // Configuration options
  autoReconnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;

  // Event handlers
  onGlobalConnect?: () => void;
  onGlobalDisconnect?: () => void;
  onError?: (error: string) => void;

  // Environment configuration
  wsUrl?: string;
}

export const HocuspocusProvider: React.FC<HocuspocusProviderProps> = ({
  children,
  autoReconnect = true,
  reconnectDelay = 5000,
  maxReconnectAttempts = 5,
  onGlobalConnect,
  onGlobalDisconnect,
  onError,
  wsUrl,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [connectionCount, setConnectionCount] = useState(0);
  const [globalConnectionStatus, setGlobalConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected' | 'error'
  >('disconnected');
  const [error, setError] = useState<string | null>(null);

  // Initialize the provider
  useEffect(() => {
    // Set environment variables if provided
    if (wsUrl && typeof window !== 'undefined') {
      // You might want to set this in your environment configuration
      console.log(`Hocuspocus WebSocket URL: ${wsUrl}`);
    }

    setIsInitialized(true);

    // Set up periodic connection status check
    const statusInterval = setInterval(() => {
      const connections = connectionManager.getAllConnections();

      setConnectionCount(connections.length);

      // Determine global status
      if (connections.length === 0) {
        setGlobalConnectionStatus('disconnected');
      } else {
        const hasConnected = connections.some(conn => conn.connected);
        const hasConnecting = connections.some(
          conn => !conn.connected && !conn.synced
        );

        if (hasConnected) {
          setGlobalConnectionStatus('connected');
        } else if (hasConnecting) {
          setGlobalConnectionStatus('connecting');
        } else {
          setGlobalConnectionStatus('disconnected');
        }
      }
    }, 1000);

    return () => {
      clearInterval(statusInterval);
      // Clean up all connections on unmount
      connectionManager.closeAllConnections();
    };
  }, [wsUrl]);

  // Handle global connection events
  useEffect(() => {
    if (globalConnectionStatus === 'connected' && connectionCount > 0) {
      onGlobalConnect?.();
    } else if (
      globalConnectionStatus === 'disconnected' &&
      connectionCount === 0
    ) {
      onGlobalDisconnect?.();
    }
  }, [
    globalConnectionStatus,
    connectionCount,
    onGlobalConnect,
    onGlobalDisconnect,
  ]);

  // Handle errors
  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  // Get connection status for a specific canvas
  const getConnectionStatus = (canvasId: string) => {
    const connections = connectionManager.getAllConnections();

    const connection = connections.find(conn => conn.documentName === canvasId);

    if (!connection) return null;

    return {
      connected: connection.connected,
      synced: connection.synced,
    };
  };

  // Close specific connection
  const closeConnection = (canvasId: string) => {
    try {
      connectionManager.closeConnection(canvasId);
    } catch (err) {
      setError(`Failed to close connection for canvas ${canvasId}: ${err}`);
    }
  };

  // Close all connections
  const closeAllConnections = () => {
    try {
      connectionManager.closeAllConnections();
      setConnectionCount(0);
      setGlobalConnectionStatus('disconnected');
    } catch (err) {
      setError(`Failed to close all connections: ${err}`);
    }
  };

  const contextValue: HocuspocusProviderContextType = {
    isInitialized,
    connectionCount,
    globalConnectionStatus,
    error,
    getConnectionStatus,
    closeConnection,
    closeAllConnections,
  };

  return (
    <HocuspocusProviderContext.Provider value={contextValue}>
      {children}
    </HocuspocusProviderContext.Provider>
  );
};

export const useHocuspocusProvider = (): HocuspocusProviderContextType => {
  const context = useContext(HocuspocusProviderContext);

  if (!context) {
    throw new Error(
      'useHocuspocusProvider must be used within a HocuspocusProvider'
    );
  }

  return context;
};
