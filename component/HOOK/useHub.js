import { HubConnectionBuilder } from '@microsoft/signalr';
import React, { useEffect, useState } from 'react';
import { getToken } from '../../libs/localStorage';
const API_SERVER_URL =
  process.env.API_SERVER_URL || 'http://35.240.230.138:5555';
const useHub = () => {
  const [connection, setConnection] = useState(null);
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${API_SERVER_URL}/chatHub`, {
        accessTokenFactory: () => {
          return `${getToken()}`;
        }
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);
  if (!connection) {
    return {};
  }
  return {
    connection
  };
};

export default useHub;
