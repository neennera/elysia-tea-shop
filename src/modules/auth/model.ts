import { t } from "elysia";

export namespace AuthBody {
  export const AuthSignInBody = t.Object({
    username: t.String(),
    password: t.String(),
  });
  export type AuthSignInBodyType = typeof AuthSignInBody.static;

  export const AuthSignUpBody = t.Object({
    name: t.String(),
    username: t.String(),
    password: t.String(),
    email: t.String(),
  });
  export type AuthSignUpBodyType = typeof AuthSignUpBody.static;

  export const AuthUpdateUserBody = t.Object({
    id: t.String(),
    username: t.Optional(t.String()),
    name: t.Optional(t.String()),
  });
  export type AuthUpdateUserBodyType = typeof AuthUpdateUserBody.static;

  export const AuthUpdatePasswordBody = t.Object({
    id: t.String(),
    password: t.String(),
  });
  export type AuthUpdateBodyType = typeof AuthUpdatePasswordBody.static;
}
