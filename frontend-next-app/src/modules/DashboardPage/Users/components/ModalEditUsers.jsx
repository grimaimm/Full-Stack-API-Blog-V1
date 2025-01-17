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
  Input,
  Select,
  SelectItem,
  Alert,
} from '@heroui/react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function ModalEditUsers({
  isOpenEditModal,
  onOpenChangeEditModal,
  backdrop,
  userToEdit,
  setUsers,
}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [fullname, setFullname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [levelId, setLevelId] = React.useState('');
  const [alert, setAlert] = React.useState(null);

  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Reset alert ketika modal dibuka atau ditutup
  useEffect(() => {
    if (!isOpenEditModal) {
      setAlert(null);
    }
  }, [isOpenEditModal]);

  // Populate fields when editing an existing user
  useEffect(() => {
    if (userToEdit) {
      setFullname(userToEdit.fullname || '');
      setEmail(userToEdit.email || '');
      setLevelId(userToEdit.levelId || '');
    }
  }, [userToEdit]);

  const handleEditUser = async () => {
    const accessToken = Cookies.get('access_token');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userToEdit.id}`,
        {
          withCredentials: true,
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullname,
            email,
            password,
            level_id: levelId,
          }),
        },
      );
      const result = await response.json();

      if (result.status === 'success') {
        setAlert({ type: 'success', message: 'User updated successfully!' });
        setTimeout(() => {
          onOpenChangeEditModal(false);
          router.push('/dashboard/users');
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userToEdit.id ? result.data : user,
            ),
          );
        }, 2000);
      } else {
        setAlert({
          type: 'danger',
          message: result.message || 'Failed to update user',
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setAlert({
        type: 'danger',
        message: 'An error occurred while updating the user',
      });
    }
  };

  return (
    <>
      <Modal
        backdrop={backdrop}
        isOpen={isOpenEditModal}
        placement='center'
        onOpenChange={(isOpen) => {
          onOpenChangeEditModal(isOpen);
          if (!isOpen) {
            setAlert(null);
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Edit User
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
                  placeholder="Enter user's name"
                  variant='bordered'
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
                <Input
                  label='Email'
                  placeholder="Enter user's email"
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
                  placeholder='Enter new password'
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
                  <SelectItem key='1' value='1'>
                    Admin
                  </SelectItem>
                  <SelectItem key='2' value='2'>
                    Author
                  </SelectItem>
                  <SelectItem key='3' value='3'>
                    Reader
                  </SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Close
                </Button>
                <Button color='primary' onPress={handleEditUser}>
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
