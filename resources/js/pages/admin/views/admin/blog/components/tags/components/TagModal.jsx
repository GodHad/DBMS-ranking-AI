import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Icon,
  Text,
  useToast
} from '@chakra-ui/react'
import { useDisclosure, useColorModeValue } from '@chakra-ui/react'
import axios from '../../../../../../../../variables/axiosConfig';
import { Store } from 'react-notifications-component';

export default function TagModal({ tag, onopen, handleOnClose, handleOnUpdate }) {
  const toast = useToast();
  const { id, name } = tag;
  const { isOpen, onOpen, onClose } = useDisclosure()
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const [form, setForm] = useState({
    id,
    name
  })

  const handleChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleTag = async () => {
    if (!form.id) {
      const res = await axios.post('/api/blog/create-tag', form);
      if (res.data.success) {
        onClose()
        handleOnUpdate()
        toast({
          title: "Create new tag successfully",
          position: 'top-right',
          status: "success",
          insert: "top",
          duration: 5000,
          isClosable: true
        })
      } else {
        toast({
          title: "Failed to create new tag",
          position: 'top-right',
          status: "error",
          insert: "top",
          duration: 5000,
          isClosable: true
        })
      }
    } else {
      const res = await axios.post(`/api/blog/update-tag?id=${form.id}`, form);
      if (res.data.success) {
        onClose()
        handleOnUpdate()
        toast({
          title: "Update tag successfully",
          position: 'top-right',
          status: "success",
          insert: "top",
          duration: 5000,
          isClosable: true
        })
      } else {
        toast({
          title: "Failed to update tag",
          position: 'top-right',
          status: "error",
          insert: "top",
          duration: 5000,
          isClosable: true
        })
      }
    }
  }

  React.useEffect(() => {
    if (onopen > 0) onOpen();
  }, [onopen, onOpen])

  React.useEffect(() => {
    setForm({ id, name });
  }, [tag])

  const clearForm = () => {
    setForm({ id: null, name: '' })
  }

  const handleCloseModal = () => {
    onClose();
    clearForm();
    handleOnClose();
  }

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{!tag.id ? "Create" : "Update"} Tag</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'>
                Name<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant='auth'
                fontSize='sm'
                ms={{ base: "0px", md: "0px" }}
                type='email'
                placeholder='e.g. Relational Database'
                mb='24px'
                fontWeight='500'
                size='lg'
                name="name"
                value={form.name}
                onChange={handleChangeForm}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant={"brand"} mr={3} onClick={handleTag}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}