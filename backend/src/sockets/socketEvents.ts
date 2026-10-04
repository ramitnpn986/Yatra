export const SOCKET_EVENTS = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",

    RIDE: {
        JOIN: "ride:join",
        JOINED: "ride:joined",

        LEAVE: "ride:leave",    // client asks the server to leave  "Server, I want to leave this ride room."
        LEFT: "ride:left",               // server confirms that the user left that room "Your request was successful. You have left the ride."
        ERROR: "ride:error",
        NEW_REQUEST: "new_ride_request",

        STARTED: "ride:started",
        ARRIVED_AT_PICKUP: "ride:arrived_at_pickup",
        COMPLETED: "ride:completed",
        CANCELLED: "ride:cancelled",

    },

    LOCATION: {
        UPDATE: "location:update",
        UPDATED: "location:updated",
    },

    TRANSPORTER: {
        JOIN: "transporter:join",
        JOINED: "transporter:joined",
    },

    RENTAL: {
        NEW_REQUEST: "new_rental_request",
        ACCEPTED: "rental_accepted",
        REJECTED: "rental_rejected",
        STARTED: "rental_started",
        COMPLETED: "rental_completed",
        CANCELLED: "rental_cancelled",
        DEPOSIT_PAID: "rental_deposit_paid",
    },

    SYSTEM: {
        ERROR: "socket:error"
    }
}