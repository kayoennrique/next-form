import { HttpClient } from "../../infra/HttpClient/HttpClient";

export const authService = {
  async login({ username, password }) {
    return HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
      method: 'POST',
      body: { username, password }
    })
      .then(async (serverResponse) => {
        if (!serverResponse.ok) throw new Error('Usuário ou senha invalidos')
        const body = await serverResponse.body;
        console.log(body);
      })
  }
};
