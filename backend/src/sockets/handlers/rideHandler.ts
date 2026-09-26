// Join / leave ride rooms

import type { Socket } from "socket.io";
import { AuthenticatedSocket, JoinRidePayload, LeaveRidePayload } from "../socketTypes.js";
import { SOCKET_EVENTS } from "../socketEvents.js";

export const registerRideHandlers = (socket: Socket): void => {
	const authenticatedSocket = socket as AuthenticatedSocket;

	socket.on(SOCKET_EVENTS.RIDE.JOIN, (payload: JoinRidePayload) => {
		if (!payload?.rideId) {
			socket.emit(SOCKET_EVENTS.RIDE.ERROR, {
				message: "Ride ID is required",
			});
			return;
		}

		const room = `ride:${payload.rideId}`;
		void socket.join(room);

		socket.emit(SOCKET_EVENTS.RIDE.JOINED, {
			rideId: payload.rideId,
			userId: authenticatedSocket.user.id,
		});
	});

	socket.on(SOCKET_EVENTS.RIDE.LEAVE, (payload: LeaveRidePayload) => {
		if (!payload?.rideId) {
			socket.emit(SOCKET_EVENTS.RIDE.ERROR, {
				message: "Ride ID is required",
			});
			return;
		}

		const room = `ride:${payload.rideId}`;
		void socket.leave(room);

		socket.emit(SOCKET_EVENTS.RIDE.LEFT, {
			rideId: payload.rideId,
		});
	});
};