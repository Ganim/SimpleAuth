import { getCookies } from "cookies-next";
import ky from "ky";
import { env } from "process";

export const api = ky.create({
  prefixUrl: env.API_URL,
  throwHttpErrors: false,
  credentials: "include", // envia cookies automaticamente
  hooks: {
    beforeRequest: [
      async (request) => {
        if (typeof window !== 'undefined') {

          const {cookies: serverCookies} = await import('next/headers');
          const token = getCookies('token', { cookies: serverCookies });

          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        }
        else{
          const token = getCookies('token');

          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
            
        }
      }
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