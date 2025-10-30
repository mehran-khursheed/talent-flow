import { Response } from "miragejs";

export function userRoutes(server) {
  /*I have keep these credentials for login as so you would be only able to login using 
  these credentials as we are only mocking and not implementing real functionality of authentication*/ 
  let users = [
    {
      email: "admin@test.com",
      password: "123456",
      name: "user",
      role: "hr",
    }
  ];

  server.post("/users/login", (schema, request) => {
    try {
      const { email, password } = JSON.parse(request.requestBody);

      if (!email || !password) {
        return new Response(400, {}, { error: "Email and password required" });
      }

      const mockUser = {
        email: "admin@test.com",
        password: "123456",
        name: "Admin User",
        role: "admin",
      };

      if (email !== mockUser.email || password !== mockUser.password) {
        return new Response(401, {}, { error: "Invalid credentials" });
      }

      const token = btoa(
        JSON.stringify({
          header: { alg: "HS256", typ: "JWT" },
          payload: { email, role: mockUser.role, exp: Date.now() + 3600000 },
        })
      );

      return new Response(
        200,
        {},
        {
          message: "Login successful",
          token,
          user: {
            email: mockUser.email,
            name: mockUser.name,
            role: mockUser.role,
          },
        }
      );
    } catch (error) {
      console.error("Login error:", error);
      return new Response(500, {}, { error: "Internal server error" });
    }
  });

  server.post("/users/signup", (schema, request) => {
    try {
      const { email, password } = JSON.parse(request.requestBody);

      if (!email || !password) {
        return new Response(400, {}, { error: "Email and password required" });
      }

      if (password.length < 6) {
        return new Response(400, {}, { error: "Password must be at least 6 characters" });
      }

      // Check if user exists - FIXED: Use simple array find instead of schema
      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        return new Response(409, {}, { error: "User already exists with this email" });
      }

      // Create new user - FIXED: Add to users array
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name: email.split('@')[0], // Generate name from email
        role: "user", // Use "user" role instead of "admin" for new signups
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);

      // Generate token
      const token = btoa(
        JSON.stringify({
          header: { alg: "HS256", typ: "JWT" },
          payload: { 
            email: newUser.email, 
            role: newUser.role, 
            exp: Date.now() + 3600000 
          },
        })
      );

      return new Response(
        201,
        {},
        {
          message: "Signup successful",
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          },
        }
      );
    } catch (error) {
      console.error("Signup error:", error);
      return new Response(500, {}, { error: "Internal server error" });
    }
  });
}