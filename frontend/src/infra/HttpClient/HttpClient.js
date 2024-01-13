import nookies from 'nookies';
import { tokenService } from '../../services/auth/tokenService';

export async function HttpClient(fetchUrl, fetchOptions = {}) {
  const defaultHeaders = fetchOptions.headers || {};
  const options = {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...defaultHeaders,
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
      if(!fetchOptions.refresh) return response;
      if(response.status !== 401) return response;
      console.log('Middleware: Rodar código para atualizar o token');

      const isServer = Boolean(fetchOptions?.ctx);
      const currentRefreshToken = fetchOptions?.ctx?.req?.cookies['REFRESH_TOKEN_NAME'];
      try {
        const refreshResponse = await HttpClient('http://localhost:3000/api/refresh', {
          method: isServer ? 'PUT' :'GET',
          body: isServer ? { refresh_token: currentRefreshToken } : undefined,
        });
        const newAccessToken = refreshResponse.body.data.access_token;
        const newRefreshToken = refreshResponse.body.data.refresh_token;  
        if(isServer) {
          nookies.set(fetchOptions.ctx, 'REFRESH_TOKEN_NAME', newRefreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/'
          })
        }
        tokenService.save(newAccessToken);
        const retryResponse = await HttpClient(fetchUrl, {
          ...options,
          refresh: false,
          headers: {
            'Authorization': `Bearer ${newAccessToken}`
          }
        });
        return retryResponse;

      } catch(err) {
        console.error(err);
        return response;
      }
    });
}
