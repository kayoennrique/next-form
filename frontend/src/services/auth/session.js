import { authService } from "./authService";

export function withSession(role) {
  return async (ctx) => {
    try {
      const session = await authService.getSession(ctx);
      const modifiedCtx = {
        ...ctx,
        req: {
          ...ctx.req,
          session: {
            name: 'Nome do usuário'
          }
        }
      };
      return role(modifiedCtx);
    } catch (err) {
      return {
        redirect: {
          permanent: false,
          destination: '/?error=401',
        }
      }
    }
  }
}
