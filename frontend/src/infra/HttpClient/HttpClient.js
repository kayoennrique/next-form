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
    });
}
