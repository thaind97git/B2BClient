import { HubConnectionBuilder } from '@microsoft/signalr';
import { getToken } from './localStorage';
const API_SERVER_URL =
  process.env.API_SERVER_URL || 'http://35.240.230.138:5555';

class SignalR {
  constructor({ hubDomain = 'chatHub' }) {
    this.serverSignalR = API_SERVER_URL;
    this.connection = new HubConnectionBuilder()
      .withUrl(`${API_SERVER_URL}/${hubDomain}`, {
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
      console.log({ eventName });
      this.connection.on(eventName, (data) => {
        typeof callback === 'function' && callback(data);
      });
    } else {
      const connectionTimer = setInterval(() => {
        if (this.connection && this.connection.connectionStarted) {
          console.log({ eventNameTimeOut: eventName });
          this.connection.on(eventName, (data) => {
            typeof callback === 'function' && callback(data);
          });
          clearInterval(connectionTimer);
        }
      }, 10);
    }
  }

  async stopConnection() {
    if (this.connection.connectionStarted) {
      this.connection.stop();
    }
  }
}

export default SignalR;
