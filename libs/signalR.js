import { HubConnectionBuilder } from '@microsoft/signalr';
import React, { useEffect, useState } from 'react';
import { getToken } from './localStorage';
const API_SERVER_URL =
  process.env.API_SERVER_URL || 'http://35.240.230.138:5555';

class SignalR {
  constructor() {
    this.serverSignalR = API_SERVER_URL;
    this.connection = new HubConnectionBuilder()
      .withUrl(`${API_SERVER_URL}/chatHub`, {
        accessTokenFactory: () => {
          return `${getToken()}`;
        }
      })
      .withAutomaticReconnect()
      .build();
  }

  async startConnection() {
    try {
      await this.connection.start();
      console.log('SignalR Connected with first start.');
    } catch (error) {
      console.log('Start connect signalR fail: ', error);
    }
  }

  isConnectionStarted() {
    return this.connection.connectionStarted;
  }

  async onListen(eventName, callback) {
    if (this.connection && this.connection.connectionStarted) {
      //   this.connection.start().then(() => {
      //     this.connection.on(eventName, (data) => {
      //       typeof callback === 'function' && callback(data);
      //     });
      //   });
      // } else {
      this.connection.on(eventName, (data) => {
        typeof callback === 'function' && callback(data);
      });
    }
  }

  async stopConnection() {
    if (this.connection.connectionStarted) {
      this.connection.stop();
    }
  }
}

export default SignalR;
