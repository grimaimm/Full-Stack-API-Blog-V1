import { EyeFilledIcon, EyeSlashFilledIcon } from '@/common/components/elements/Icon';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Link,
} from '@heroui/react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function LoginForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setAlert(null); // Clear previous alerts

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }), // Send email and password in the body
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setAlert({
          type: 'danger',
          message: errorData.message || 'An error occurred. Please try again.',
        });
        return;
      }

      const result = await response.json();
      console.log(result); // Log the received data for debugging

      if (result.status === 'success') {
        setAlert({ type: 'success', message: result.message });

        Cookies.set('access_token', result.access_token, {
          expires: 1, // 1 day expiration
          secure: true, // Pastikan menggunakan HTTPS
          sameSite: 'Strict',
        });

        // Check user level and redirect
        if (result.user_level === 1 || result.user_level === 2) {
          // router.push('/dashboard/users'); // Redirect to dashboard for admin and higher level users
          window.location.href = '/dashboard/users';
        } else {
          setAlert({
            type: 'danger',
            message: 'You do not have access to the dashboard.',
          });
          // router.push('/'); // Redirect to homepage for unauthorized users
          window.location.href = '/';
        }
      } else {
        // Handle case where result.status is not 'success'
        setAlert({
          type: 'danger',
          message: result.message || 'An error occurred. Please try again.',
        });
      }
    } catch (error) {
      console.error(error); // Log error details for debugging
      setAlert({
        type: 'danger',
        message: 'Network or server error. Please try again.',
      });
    }
  };


  // const handleSubmit = async (event) => {
  //   event.preventDefault(); // Prevent default form submission
  //   setAlert(null); // Clear previous alerts

  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ email, password }), // Send email and password in the body
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       setAlert({
  //         type: 'danger',
  //         message: errorData.message || 'An error occurred. Please try again.',
  //       });
  //       return;
  //     }

  //     const result = await response.json();
  //     // console.log(result); // Log the received data for debugging

  //     if (result.status === 'success') {
  //       setAlert({ type: 'success', message: result.message });

  //       Cookies.set('access_token', result.access_token, {
  //         expires: 1, // 1 day expiration
  //         secure: true, // Pastikan menggunakan HTTPS
  //         sameSite: 'Strict'
  //       });

  //       // Check user level
  //       if (result.user_level === 1 || result.user_level === 2) {
  //         router.push('/dashboard/users'); // Redirect to dashboard
  //       } else {
  //         setAlert({
  //           type: 'danger',
  //           message: 'You do not have access to the dashboard.',
  //         });
  //         router.push('/'); // Redirect to homepage for unauthorized users
  //       }
  //     // if (result.status === 'success') {
  //     //   setAlert({ type: 'success', message: result.message });
  //     //   Cookies.set('access_token', result.access_token, {
  //     //     expires: 1, // 1 day expiration
  //     //     secure: true, // Pastikan menggunakan HTTPS
  //     //     sameSite: 'Strict',
  //     //   });

  //     //   windows.location.href = '/dashboard/users';
  //     // } else {
  //     //   setAlert({
  //     //     type: 'danger',
  //     //     message: result.message || 'An error occurred. Please try again.',
  //     //   });
  //     // }
  //   } catch (error) {
  //     setAlert({
  //       type: 'danger',
  //       message: 'Network or server error. Please try again.',
  //     });
  //   }
  // };

  return (
    <Card
      isBlurred
      className='border-none bg-background/40 dark:bg-default-100/40'
      shadow='sm'
    >
      <CardHeader className='justify-start px-6 pt-4'>
        <h4 className='font-bold text-2xl'>Sign In</h4>
      </CardHeader>
      <CardBody className='gap-4 px-6 pb-6'>
        {alert && (
          <div className='flex items-center justify-center w-full'>
            <div className='flex flex-col w-full'>
              <div className='w-full flex items-center'>
                <Alert color={alert.type} title={alert.message} />
              </div>
            </div>
          </div>
        )}
        <Input
          isRequired
          label='Email'
          placeholder='Enter your email'
          type='email'
          variant='bordered'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          endContent={
            <button
              aria-label='toggle password visibility'
              className='focus:outline-none'
              type='button'
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
              ) : (
                <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
              )}
            </button>
          }
          isRequired
          label='Password'
          placeholder='Enter your password'
          type={isVisible ? 'text' : 'password'}
          variant='bordered'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button color='secondary' onClick={handleSubmit}>
          Login to your account
        </Button>
      </CardBody>
    </Card>
  );
}
