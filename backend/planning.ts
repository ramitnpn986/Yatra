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