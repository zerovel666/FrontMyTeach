import { useCookies } from 'vue-cookies';

export function useAppCookies() {
  const cookies = useCookies();

  const setCookie = (name, value, time = '7d') => {
    	
  };

  const getCookie = (name) => cookies.get(name);
  const removeCookie = (name) => cookies.remove(name);

  return { setCookie, getCookie, removeCookie };
}
