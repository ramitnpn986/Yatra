
export const SOCKET_EVENTS = {
  RIDE: {
     NEW_REQUEST: "new_ride_request",

     JOIN: "ride:join",
     JOINED: "ride:joined",

     LEAVE: "ride:leave",
     LEFT: "ride:left",

     ERROR: "ride:error"

  },

  LOCATION :{
       UPDATE: "location:update",
       UPDATED: "location:updated"
  },

  SYSTEM:{
    ERROR: "socket:error"
  }


}