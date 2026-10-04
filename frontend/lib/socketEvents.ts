export const SOCKET_EVENTS = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",

    RIDE: {
        JOIN: "ride:join",
        JOINED: "ride:joined",

        LEAVE: "ride:leave",
        LEFT: "ride:left",

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

    SYSTEM: {
        ERROR: "socket:error",
    },
} as const;

const SocketEvents={
    CONNECTION:"connection",
}