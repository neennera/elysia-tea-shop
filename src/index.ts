import { Elysia } from "elysia";
import { teaManu } from "./modules/teaManu";
import { auth } from "./modules/auth";

const app = new Elysia();

app
  .get("/", () => "Hello Elysia")
  .use(teaManu)
  .use(auth)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
