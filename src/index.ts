import { Elysia } from "elysia";
import { teaManu } from "./modules/teaManu";

const app = new Elysia();

app
  .get("/", () => "Hello Elysia")
  .use(teaManu)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
