import { Elysia } from "elysia";

const app = new Elysia();

app.get("/", () => "Hello Elysia").listen(80);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
