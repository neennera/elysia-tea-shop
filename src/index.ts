import { Elysia } from "elysia";
import { teaManu } from "./modules/teaManu";
import { auth } from "./modules/auth";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";

const app = new Elysia();

app
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "jwt_secret",
    })
  )
  .use(cookie())
  .use(swagger())
  .get("/", () => "Hello Elysia")
  .use(teaManu)
  .use(auth)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
