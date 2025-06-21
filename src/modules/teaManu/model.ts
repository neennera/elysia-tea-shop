import { t } from "elysia";

export namespace TeaManuModel {
  export const TeaManuBody = t.Object({
    id: t.Integer(),
    name: t.String(),
    price: t.Numeric(),
  });
  export type TeaManuBodyType = typeof TeaManuBody.static;
}
