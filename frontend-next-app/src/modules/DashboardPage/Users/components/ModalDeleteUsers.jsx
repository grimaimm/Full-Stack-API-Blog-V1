import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

export default function ModalDeleteUsers({
  isOpenDeleteModal,
  onOpenChangeDeleteModal,
  backdrop,
  handleDeleteUser,
  deleteStatus, // Menambahkan status delete
  setDeleteStatus, // Fungsi untuk mengubah status delete
}) {
  const onDelete = async () => {
    await handleDeleteUser(); // Proses penghapusan user
    setDeleteStatus('success'); // Set status ke 'success' setelah berhasil dihapus
  };

  return (
    <Modal
      backdrop={backdrop}
      isOpen={isOpenDeleteModal}
      placement='center'
      onOpenChange={onOpenChangeDeleteModal}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>Delete Users</ModalHeader>
        <ModalBody>
          {deleteStatus === 'success' ? (
            <p>Pengguna telah berhasil dihapus!</p> // Teks setelah penghapusan berhasil
          ) : (
            <p>Apakah anda yakin ingin menghapus user ini?</p> // Teks sebelum penghapusan
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color={deleteStatus === 'success' ? 'primary' : 'danger'} // Ubah warna tombol berdasarkan status
            variant='flat'
            onPress={() => onOpenChangeDeleteModal(false)} // Menutup modal
          >
            Close
          </Button>
          {deleteStatus !== 'success' && (
            <Button
              color='danger'
              onPress={onDelete} // Tombol Hapus yang hanya muncul jika statusnya bukan 'success'
            >
              Hapus
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
