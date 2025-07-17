import ky from "ky";
import { env } from "process";

export const api = ky.create({
  prefixUrl: env.API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let token: string | undefined;

        if (typeof window !== 'undefined') {
          // Client-side: busca do cookie via document.cookie
          const match = document.cookie.match(/(^|;) ?token=([^;]*)(;|$)/);
          token = match ? match[2] : undefined;
        } else {
          // Server-side: usa cookies() do next/headers
          const { cookies } = await import('next/headers');
          const cookieStore = await cookies();
          token = cookieStore.get('token')?.value;
        }

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          // Tenta fazer refresh
          const refreshResponse = await ky.post("/token/refresh", {
            prefixUrl: env.API_URL,
            credentials: "include",
            throwHttpErrors: false,
          });
          if (refreshResponse.ok) {
            // Repete a requisição original
            return ky(request, options);
          } else {
            // Redireciona para sign-in
            window.location.href = "/sign-in";
          }
        }
        return response;
      }
    ]
  }
});