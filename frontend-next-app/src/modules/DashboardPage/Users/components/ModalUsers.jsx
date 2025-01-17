import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

export default function ModalSuccessDelete({
  isOpenSuccessModal,
  onOpenChangeSuccessModal,
}) {
  return (
    <Modal
      isOpen={isOpenSuccessModal}
      onOpenChange={onOpenChangeSuccessModal}
      backdrop='blur'
      placement='center'
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>Success</ModalHeader>
        <ModalBody>
          <p>Pengguna telah berhasil dihapus!</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color='primary'
            onPress={() => onOpenChangeSuccessModal(false)}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
