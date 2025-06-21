import { Elysia, t } from "elysia";

import { TeaManuService } from "./service";

export const teaManu = new Elysia({ prefix: "/teamanu" })
  .get("/", () => {
    console.log("HI");
    return TeaManuService.TeaManus();
  })
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
  )
  .post(
    "/",
    ({ body }) => {
      return TeaManuService.newTeaManu({
        name: body.name,
        price: body.price,
      });
    },
    {
      body: t.Object(
        {
          name: t.String({
            minLength: 3,
            error: { message: "name must be at least 3 character" },
          }),
          price: t.Number({
            minimum: 1,
            error: { message: "price must be at least 1 bath" },
          }),
        },
        { error: { message: "expected body" } }
      ),
    }
  )
  .patch(
    "/:id",
    ({ params, body }) => {
      return TeaManuService.UpdateTeaManu({
        id: params.id,
        ...body,
      });
    },
    {
      params: t.Object({
        id: t.Number({
          minimum: 1,
          error: { message: "id must be an integer" },
        }),
      }),
      body: t.Object(
        {
          name: t.Optional(
            t.String({
              minLength: 3,
              error: { message: "name must be at least 3 character" },
            })
          ),
          price: t.Optional(
            t.Number({
              minimum: 1,
              error: { message: "price must be at least 1 bath" },
            })
          ),
        },
        {
          additionalProperties: false,
          minProperties: 1,
          error: {
            message: "At least one field (name or price) must be provided",
          },
        }
      ),
    }
  )
  .delete(
    "/:id",
    ({ params }) => {
      return TeaManuService.RemoveTeaManu(params.id);
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
