// PASSENGER
//    │
//    ├── Select current location
//    │
//    ├── Select destination
//    │
//    ├── Calculate distance + estimated fare for all vehicles type for bike: 100 car : 400  
//    │
//    └── Confirm Ride - store vehicle type prefered by user and send request  to near by vehicle of that type
//           │
//           ▼
//      RIDE REQUEST
//           │
//           ▼
//    Find nearby available
//       transporters
//           │
//           ▼
//    Send ride request
//    via Socket.IO
//           │
//       ┌───┴────┐
//       │        │
//    Accept    Reject
//       │
//       ▼
//    ASSIGNED
//       │
//       ▼
// Transporter goes to
//      pickup
//       │
//       ▼
//  "Arrived at pickup"
//       │
//       ▼
//    Passenger enters/
//    confirms pickup
//       │
//       ▼
//     RIDE STARTED
//       │
//       ▼
// Transporter navigates
//     to destination
//       │
//       ▼
//   "Arrived at destination"
//       │
//       ▼
//    RIDE COMPLETED
//       │
//       ▼
//  Payment / confirmation
//       │
//       ▼
//     Rating/Review



    //                      SOCKET CONNECTION
    //                             │
    //                             ▼
    //                     JWT authentication
    //                             │
    //                             ▼
    //                  Identify user + role
    //                             │
    //                             ▼
    //                 Automatically join personal room
    //                             │
    //              ┌──────────────┴──────────────┐
    //              ▼                             ▼
    //       transporter:123                 customer:456
    //              │                             │
    //              │                             │
    //              ├── new_ride_request          │
    //              ├── notification              │
    //              └── ride accepted             │
                               
    //                  RIDE ACCEPTED
    //                        │
    //          ┌─────────────┴─────────────┐
    //          ▼                           ▼
    //    transporter:123               customer:456
    //          │                           │
    //          └──────────┬────────────────┘
    //                     ▼
    //                ride:rideId
    //                     │
    //          ┌──────────┼──────────┐
    //          ▼          ▼          ▼
    //    location      ride:start   ride:end
    //     :updated