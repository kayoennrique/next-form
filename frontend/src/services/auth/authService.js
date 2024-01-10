export const authService = {
  async login({ username, password }) {
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
      })
    })
      .then(async (serverResponse) => {
        if (!serverResponse.ok) throw new Error('Usuário ou senha invalidos')
        const body = await serverResponse.json();
        console.log(body);
      })
  }
};
