// components/SessionContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/who-me`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${Cookies.get('access_token')}`,
            },
            withCredentials: true,
          }
        );

        // if (!response.ok) {
        //   // Remove invalid token and redirect to login page
        //   Cookies.remove('access_token');
        //   router.push('/'); // Redirect to home if there's an issue with fetching the user
        //   return;
        // }
        
        // setUser(response.data.user);

        const data = await response.json();
        setUser(data.user);

        // You can add additional redirection based on user level here if needed
        // if (data.user.level === 3) {
        //   router.push('/some-other-page'); // Redirect to another page if level is 3
        // }

      } catch (error) {
        // console.error('Error fetching user:', error);
        // // In case of any error, clear the token and redirect
        // Cookies.remove('access_token');
        // window.location.href = '/'; // Redirect to home on error
        if (error.response?.status === 422) {
          Cookies.remove('access_token');
          window.location.href = '/';
        } else {
          console.error('Error fetching user data:', error);
        }
      } finally {
        setLoading(false); // Set loading to false after the user is fetched or error happens
      }
    };

    fetchUser();
  }, []);

  return (
    <SessionContext.Provider value={{ user, loading }}>
      {!loading ? children : null}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
