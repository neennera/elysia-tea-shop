import { t } from "elysia";

export namespace TeaManuModel {
  export const TeaManuBody = t.Object({
    id: t.String(),
    name: t.Optional(t.String()),
    price: t.Optional(t.Numeric()),
  });
  export type TeaManuBodyType = typeof TeaManuBody.static;

  export const NewTeaManuBody = t.Object({
    name: t.String(),
    price: t.Numeric(),
  });
  export type NewTeaManuBody = typeof NewTeaManuBody.static;
}
