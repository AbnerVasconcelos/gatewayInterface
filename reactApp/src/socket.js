import { io } from 'socket.io-client';


// "undefined" means the URL will be computed from the `window.location` object
const URL =  'http://192.168.196.45:5002';
//const URL =  'http://localhost:5002';
//const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5002';



export const socket = io(URL, {
    autoConnect: false
  });


   // socket.connect()
   // socket.disconnect();
