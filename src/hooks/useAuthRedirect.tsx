import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_COOKIE } from '@/utils';

const useAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get(ACCESS_TOKEN_COOKIE);
    if (!token) {
      router.push('/login');
    } else {
      router.push(pathname);
    }
  }, [router, pathname]);
};

export default useAuthRedirect;
