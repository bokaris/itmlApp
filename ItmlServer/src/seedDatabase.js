import User from "./models/User.js";
import Request from "./models/Request.js";

export async function seedDatabase() {
  try {
    await Request.deleteMany({});
    await User.deleteMany({});

    const users = await User.insertMany([
      {
        name: "Nick",
        email: "nick@itml.com",
        password: "123456",
        role: "employee",
      },
      {
        name: "Alex",
        email: "alex@itml.com",
        password: "123456",
        role: "employee",
      },
      {
        name: "John",
        email: "john@itml.com",
        password: "123456",
        role: "employee",
      },
      {
        name: "Spyros",
        email: "spyros@itml.com",
        password: "123456",
        role: "employee",
      },
      {
        name: "George",
        email: "george@itml.com",
        password: "123456",
        role: "employee",
        remainingAnnualLeaves: 17,
      },
      {
        name: "Antonis",
        email: "antonis@itml.com",
        password: "123456",
        role: "manager",
      },

      {
        name: "Evi",
        email: "evi@itml.com",
        password: "123456",
        role: "hr",
      },
    ]);

    const employees = users.filter((u) => u.role === "employee");
    const manager = users.find((u) => u.role === "manager");
    const hr = users.find((u) => u.role === "hr");

    const requests = [
      {
        type: "remote",
        employee: employees[0]._id,
        manager: manager._id,
        hr: hr._id,
        status: "approved",
        hrApproved: true,
        startDate: "2025-11-10",
        endDate: "2025-11-10",
      },
      {
        type: "annual",
        employee: employees[0]._id,
        manager: manager._id,
        hr: hr._id,
        status: "rejected",
        managerApproved: false,
        hrApproved: false,
        startDate: "2025-12-10",
        endDate: "2025-12-20",
      },
      {
        type: "annual",
        employee: employees[1]._id,
        manager: manager._id,
        hr: hr._id,
        status: "rejected",
        managerApproved: false,
        hrApproved: false,
        startDate: "2025-12-01",
        endDate: "2025-12-05",
      },
      {
        type: "annual",
        employee: employees[2]._id,
        manager: manager._id,
        hr: hr._id,
        status: "pending",
        managerApproved: null,
        hrApproved: null,
        startDate: "2025-12-10",
        endDate: "2025-12-12",
      },
      {
        type: "remote",
        employee: employees[3]._id,
        manager: manager._id,
        hr: hr._id,
        status: "pending",
        hrApproved: null,
        startDate: "2025-11-15",
        endDate: "2025-11-15",
      },
      {
        type: "annual",
        employee: employees[4]._id,
        manager: manager._id,
        hr: hr._id,
        status: "approved",
        managerApproved: true,
        hrApproved: true,
        startDate: "2025-12-17",
        endDate: "2025-12-19",
      },
    ];

    await Request.insertMany(requests);

    console.log("Database reset and seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}
