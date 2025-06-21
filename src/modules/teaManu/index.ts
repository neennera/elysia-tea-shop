import { Elysia, t } from "elysia";

import { TeaManuModel } from "./model";
import { TeaManuService } from "./service";

export const teaManu = new Elysia({ prefix: "/teamanu" })
  .get("/", () => TeaManuService.TeaManus())
  .get(
    "/:id",
    ({ params }) => {
      return TeaManuService.TeaManu(params.id);
    },
    {
      params: t.Object({
        id: t.Number({
          minimum: 1,
          error: { message: "id must be an integer" },
        }),
      }),
    }
  );
