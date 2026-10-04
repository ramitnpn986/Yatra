
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
  },

  RENTAL: {
    NEW_REQUEST: "new_rental_request",
    ACCEPTED: "rental_accepted",
    REJECTED: "rental_rejected",
    STARTED: "rental_started",
    COMPLETED: "rental_completed",
    CANCELLED: "rental_cancelled",
    DEPOSIT_PAID: "rental_deposit_paid",
  }


}