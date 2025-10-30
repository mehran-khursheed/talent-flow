
export function userRoutes(server) {
    server.get("/users", (schema) => schema.users.all())
}