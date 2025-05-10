use('community');

db.events.drop();
db.createCollection('events');

db.events.insertMany([
    {
          description: "23",
          price: 23,
          location: "West Campus",
          tags: [
            "Firm Price"
          ],
          imageUrl: "",
          userId: "107979131145326691004",
          userEmail: "wjr78@cornell.edu"
    },
    {
        description: "Gently used mini fridge, perfect for dorm rooms.",
        price: 40,
        location: "West Campus",
        tags: ["Appliance", "Firm Price"],
        imageUrl: "",
        userId: "107979131145326691004",
        userEmail: ""
    },
    {
        description: "Set of 3 textbooks for CS 1110, good condition.",
        price: 25,
        location: "North Campus",
        tags: ["Books", "Negotiable"],
        imageUrl: "",
        userId: "107979131145326691004",
        userEmail: ""
    },
    {
        description: "Free futon, must pick up in Collegetown.",
        price: 0,
        location: "Collegetown",
        tags: ["Furniture", "Free"],
        imageUrl: "",
        userId: "",
        userEmail: ""
    },
    {
        description: "Microwave for sale, works great, moving out soon.",
        price: 15,
        location: "West Campus",
        tags: ["Appliance", "Negotiable"],
        imageUrl: "",
        userId: "",
        userEmail: ""
    },
    {
        description: "Bike in good condition, includes lock.",
        price: 60,
        location: "North Campus",
        tags: ["Transportation", "Firm Price"],
        imageUrl: "",
        userId: "",
        userEmail: ""
    }
])

db.events.createIndex({ tags: "text", description: "text", location: "text" })
