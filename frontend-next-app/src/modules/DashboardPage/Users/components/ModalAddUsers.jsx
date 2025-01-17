import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
} from '@/common/components/elements/Icon';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  Select,
  SelectItem,
  Alert,
} from '@heroui/react';
import Cookies from 'js-cookie';
import React from 'react';
import { useRouter } from 'next/router';

export default function ModalAddUsers({
  isOpenAddModal,
  onOpenChangeAddModal,
  backdrop,
  setUsers,
}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [fullname, setFullname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [levelId, setLevelId] = React.useState('2');
  const [alert, setAlert] = React.useState(null);

  const router = useRouter();
  const toggleVisibility = () => setIsVisible(!isVisible);

  // Reset alert ketika modal dibuka atau ditutup
  React.useEffect(() => {
    if (!isOpenAddModal) {
      setAlert(null);
    }
  }, [isOpenAddModal]);

  const handleSubmit = async () => {
    const accessToken = Cookies.get('access_token');

    const userData = {
      fullname,
      email,
      password,
      level_id: levelId,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        {
          withCredentials: true,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        },
      );

      const result = await response.json();

      if (result.status === 'success') {
        setAlert({ type: 'success', message: 'User berhasil dibuat!' });
        // Reset form fields
        setFullname('');
        setEmail('');
        setPassword('');
        setLevelId('2');

        setTimeout(() => {
          onOpenChangeAddModal(false);
          router.push('/dashboard/users');
          setUsers((prevUsers) => [...prevUsers, result.data]);
        }, 2000);
      } else {
        setAlert({ type: 'danger', message: result.message });
      }
    } catch (error) {
      setAlert({ type: 'danger', message: 'Terjadi kesalahan, coba lagi.' });
    }
  };

  return (
    <>
      <Modal
        backdrop={backdrop}
        isOpen={isOpenAddModal}
        placement='center'
        onOpenChange={(isOpen) => {
          onOpenChangeAddModal(isOpen);
          if (!isOpen) {
            setAlert(null);
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Add New Users
              </ModalHeader>
              <ModalBody>
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
                  label='Full Name'
                  placeholder='Enter your name'
                  variant='bordered'
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
                <Input
                  label='Email'
                  placeholder='Enter your email'
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
                  label='Password'
                  placeholder='Enter your password'
                  type={isVisible ? 'text' : 'password'}
                  variant='bordered'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Select
                  label='Select an Level'
                  variant='bordered'
                  value={levelId}
                  onChange={(e) => setLevelId(e.target.value)}
                >
                  <SelectItem key='1'>Admin</SelectItem>
                  <SelectItem key='2'>Author</SelectItem>
                  <SelectItem key='3'>Reader</SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Close
                </Button>
                <Button color='primary' onPress={handleSubmit}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
