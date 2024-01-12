import { tokenService } from "../../services/auth/tokenService";

export async function HttpClient(fetchUrl, fetchOptions) {
  const options = {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null,
  };
  return fetch(fetchUrl, options)
    .then(async (serverResponse) => {
      return {
        ok: serverResponse.ok,
        status: serverResponse.status,
        statusText: serverResponse.statusText,
        body: await serverResponse.json(),
      }
    })
    .then(async (response) => {
      if (!fetchOptions.refresh) return response;
      if (response.status !== 401) return response;

      console.log('Middleware: Rodar código para atualizar o token');
      const refreshResponse = await HttpClient('http://localhost:3000/api/refresh', {
        method: 'GET'
      });
      const newAcessToken = refreshResponse.body.data.acess_token;
      const newRefreshToken = refreshResponse.body.data.refresh_token;

      tokenService.save(newAcessToken);

      const retryResponse = await HttpClient(fetchUrl, {
        ...options,
        refresh: false,
        headers: {
          'Authorization': `Bearer ${newAcessToken}`
        }
      })

      return retryResponse;
    });
}
