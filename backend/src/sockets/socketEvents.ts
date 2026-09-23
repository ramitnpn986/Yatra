

export const SOCKET_EVENTS = {
    CONNECTION: " connection",
    DISCONNECT: " disconnect",

    RIDE: {
        JOIN: "ride:join",
        JOINED: "ride: joined",

        LEAVE: "ride:leave",    // client asks the server to leave  "Server, I want to leave this ride room."
        LEFT: "ride: left",               // server confirms that the user left that room "Your request was successful. You have left the ride."
        ERROR: "ride:error",
    },

    LOCATION: {
        UPDATE: "location:update",
        UPDATED: "location:updated",
    },

    SYSTEM: {
        ERROR: "socket:error"
    }
}