import { Elysia } from "elysia";
import { teaManu } from "./modules/teaManu";
import { auth } from "./modules/auth";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia();

app
  .use(swagger())
  .get("/", () => "Hello Elysia")
  .use(teaManu)
  .use(auth)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
