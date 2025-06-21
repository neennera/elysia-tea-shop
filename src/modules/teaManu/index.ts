import { Elysia } from "elysia";

import { TeaManuModel } from "./model";
import { TeaManuService } from "./service";

export const teaManu = new Elysia({ prefix: "/teamanu" }).get("/", () =>
  TeaManuService.TeaManus()
);
