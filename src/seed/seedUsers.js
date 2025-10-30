import { faker } from "@faker-js/faker";
import { db } from "../db/index.js";

export function seedUsers(server) {
  db.table("users").toArray().then((users) => {
    if (users.length === 0) {
      for (let i = 0; i < 10; i++) {
        const userData = {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          role: faker.helpers.arrayElement(["admin", "recruiter"]),
        };
        const user = server.create("user", userData);
        db.table("users").add(user.attrs); 
      }
    } else {
      users.forEach((user) => server.create("user", user));
    }
  });
}
