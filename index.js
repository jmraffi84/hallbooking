
const express = require("express")
const app = express()
app.use(express.json()); // MIDDLEWARE
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
}); // Error handling

console.log("Hall Booking Api");

let roomlist = [
    {

        "RoomId": "202",
        "numberOfSeats": 100,
        "amenities": ["Ac", "Teapoy", "Tv"],
        "price": 5000,
        "isBooked": "false",
        "RoomName": "Duplex",
    },
    {
        "RoomId": "203",
        "numberOfSeats": 100,
        "amenities": ["Ac", "Teapoy", "Tv", "Gym Access"],
        "price": 15000,
        "isBooked": "false",
        "RoomName": "Suite",
    },
    {
        "RoomId": "204",
        "numberOfSeats": 50,
        "amenities": ["Ac", "Teapoy", "Tv"],
        "price": 5000,
        "isBooked": "true",
        "RoomName": "Duplex",
    },
    {
        "RoomId": "205",
        "numberOfSeats": 150,
        "amenities": ["Ac", "Teapoy", "Tv", "Gym Access", "Swimming Pool"],
        "price": 20000,
        "isBooked": "true",
        "RoomName": "Western Suite",
    },
]

const booking = [
    {
        "bookingID": "Block1",
        "roomID": "202",
        "customer": "Prakash",
        "bookingDate": "10/10/2023",
        "startTime": "12noon",
        "endTime": "11:59am",
        "status": "expired",
        "booked_On": "1/09/2023"
    },
    {
        "bookingID": "Block2",
        "roomID": "202",
        "customer": "Gunasekaran",
        "bookingDate": "10/10/2023",
        "startTime": "12noon",
        "endTime": "11:59am",
        "status": "AlreadyBooked",
        "booked_On": "1/10/2023"
    },
    {
        "bookingID": "Block3",
        "roomID": "202",
        "customer": "Adi Gunasekaran",
        "bookingDate": "10/10/2023",
        "startTime": "12noon",
        "endTime": "11:59am",
        "status": "Newbooking",
        "booked_On": "1/10/2023"
    },
]

app.get("/roomlist/all", (req, res) => {
    const rooms = roomlist
    res.status(200).json({ data: rooms })
})
app.get("/roomlist/create", (req, res) => {
    let addRooms = req.body
    let roomExists = roomlist.find((val) => val.RoomId === addRooms.RoomId)
    if (roomExists === false) {
        return res.status(400).json({ message: "room already exists.", Rooms: roomlist });

    }
    else {
        roomlist.push(addRooms);
        res.status(201).json({ message: "New room created", data: roomlist, added: roomlist });
    }

})

app.get("/booking/all", (req, res) => {
    const { status } = req.query
    if (req.query && status === "Newbooking") {
        let booked = booking.filter((val) => val.status === "Newbooking");
        res.status(200).json({ BookingList: booked })
    }
    else if (req.query && status === "expired") {
        let expired = booking.filter((val) => val.status === "expired")
        res.status(200).json({ BookingList: expired })
    }
    else {
        res.status(200).json({ BookingList: booking });
    }
})

// booking a room

app.post("/booking/create/:RoomId", (req, res) => {

    const { RoomId } = req.params;
    const newBooking = req.body;
    // console.log(req.body)
    let date = new Date();
    let dateFormat = date.toLocaleDateString();
    const { bookingDate, startTime, endTime, customer } = newBooking;


    // Check if the room with given RoomId exists
    const room = roomlist.find((val) => val.RoomId === RoomId)
    console.log(room);
    if (room) {
        return res.status(404).json({ message: "Room not found." });
    }

    // Check if the room is already booked for the specified date and time
    const existingBooking = booking.find((val) => val.roomID === RoomId && val.bookingDate === bookingDate);
    if (existingBooking) {
        return res.status(400).json({ message: "Room already booked for this date and time." });
    }

    // Create a new booking
    const newBookingId = "val" + (booking.length + 1);
    const createdBooking = {
        bookingID: newBookingId,
        roomID: RoomId,
        customer: customer,
        bookingDate: bookingDate,
        startTime: startTime,
        endTime: endTime,
        status: "BookingDone",
        booked_On: dateFormat
    };

    // Add the new booking to the bookings array
    booking.push(createdBooking);

    return res.status(200).json({ message: "Room booked successfully.", Booking: createdBooking });
});

app.get("/booking/customer/:customer", (req, res) => {
    const { customer } = req.params;

    // Find all bookings made by the customer
    const customerBookings = booking.filter((val) => val.customer === customer);

    // to get customer name
    const allCustomer = [...new Set(booking.map((val) => val.customer))];

    // Prepare response data with booking count and details
    const response = {
        customerName: allCustomer,
        totalBookings: customerBookings.length,
        bookings: customerBookings
    };

    res.status(200).json({ TotalBooking: response });
});






app.listen(9000, () => console.log("I am running on port 9000"));
