import React from 'react';

import Cookies from 'js-cookie';
import { useDisclosure } from '@heroui/modal';
import { useRouter } from 'next/router';
import TableUsers from './TableUsers';
import ModalAddUsers from './ModalAddUsers';
import ModalDeleteUsers from './ModalDeleteUsers';
import ModalEditUsers from './ModalEditUsers';

export default function ListUsers() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenEditModal,
    onOpen: onOpenEdit,
    onOpenChange: onOpenChangeEdit,
  } = useDisclosure();
  const [users, setUsers] = React.useState([]);
  const [backdrop, setBackdrop] = React.useState('blur');
  const [userIdToDelete, setUserIdToDelete] = React.useState(null); // ID user yang akan dihapus
  const [deleteStatus, setDeleteStatus] = React.useState(null);
  const [userToEdit, setUserToEdit] = React.useState(null);

  const router = useRouter();

  // Fetch Users data dari API
  React.useEffect(() => {
    const fetchUsers = async () => {
      const accessToken = Cookies.get('access_token');
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            // credentials: 'include',
            withCredentials: true,
          },
        );
        const result = await response.json();
        
        if (result.status === 'success' && Array.isArray(result.data)) {
          setUsers(result.data); // Atur state dengan data yang benar
        } else {
          console.error('Failed to fetch users.');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fungsi untuk menghapus pengguna
  const handleDeleteUser = async () => {
    const accessToken = Cookies.get('access_token');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userIdToDelete}`,
        {
          withCredentials: true,
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const result = await response.json();

      if (result.status === 'success') {
        setUsers(users.filter((user) => user.id !== userIdToDelete)); // Menghapus dari state
        // onOpenChangeDelete(false); // Menutup modal
      } else {
        console.error('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user.');
    }
  };

  return (
    <>
      <TableUsers
        users={users}
        onPressAddUser={onOpen}
        onPressDeleteUser={(userId) => {
          setUserIdToDelete(userId); // Set ID pengguna yang akan dihapus
          setDeleteStatus(null); // Reset status delete
          onOpenDelete(); // Buka modal delete
        }}
        onPressEditUser={(user) => {
          setUserToEdit(user); // Set data user yang akan diedit
          onOpenEdit();
        }}
      />

      <ModalAddUsers
        setUsers={setUsers}
        backdrop={backdrop}
        isOpenAddModal={isOpen}
        onOpenChangeAddModal={onOpenChange}
      />

      <ModalDeleteUsers
        backdrop={backdrop}
        isOpenDeleteModal={isOpenDeleteModal}
        onOpenChangeDeleteModal={onOpenChangeDelete}
        handleDeleteUser={handleDeleteUser} // Kirim fungsi handleDeleteUser ke modal
        deleteStatus={deleteStatus} // Kirim status delete
        setDeleteStatus={setDeleteStatus} // Kirim fungsi untuk mengubah status delete
      />

      <ModalEditUsers
        backdrop={backdrop}
        isOpenEditModal={isOpenEditModal}
        onOpenChangeEditModal={onOpenChangeEdit}
        userToEdit={userToEdit}
        setUsers={setUsers}
      />
    </>
  );
}
