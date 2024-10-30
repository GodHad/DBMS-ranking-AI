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
  Text,
  useToast
} from '@chakra-ui/react'
import { useDisclosure, useColorModeValue } from '@chakra-ui/react'
import axios from 'axios';
import { Store } from 'react-notifications-component';

export default function CategoryModal({ category, onopen, handleOnClose, handleOnUpdate }) {
  const toast = useToast();
  const { id, title, shortname } = category;
  const { isOpen, onOpen, onClose } = useDisclosure()
  const textColor = useColorModeValue("navy.700", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const [form, setForm] = useState({
    id,
    title,
    shortname,
  })

  const handleChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleCategory = async () => {
    if (!form.id) {
      const res = await axios.post('/api/create-category', form);
      if (res.data.success) {
        onClose()
        handleOnUpdate()
        toast({
          title: "You create new category successfully.",
          position: 'top-right',
          status: "success",
          insert: "top",
          duration: 5000,
          isClosable: true
        })
      } else {
        toast({
          title: "Failed to create new category.",
          position: 'top-right',
          status: "error",
          insert: "top",
          duration: 5000,
          isClosable: true
        })
      }
    } else {
      const res = await axios.post(`/api/update-category?id=${form.id}`, form);
      if (res.data.success) {
        onClose()
        handleOnUpdate()
        toast({
          title: "You update new category successfully.",
          position: 'top-right',
          status: "success",
          insert: "top",
          duration: 5000,
          isClosable: true
        })
      } else {
        toast({
          title: "Failed to update category.",
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
    setForm({ id, title, shortname });
  }, [category])

  const clearForm = () => {
    setForm({ id: null, title: '', shortname: '' })
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
          <ModalHeader>{!category.id ? "Create" : "Update"} Category</ModalHeader>
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
                placeholder='Relational Database'
                mb='24px'
                fontWeight='500'
                size='lg'
                name="title"
                value={form.title}
                onChange={handleChangeForm}
              />
              <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'>
                Short Name<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant='auth'
                fontSize='sm'
                ms={{ base: "0px", md: "0px" }}
                type='email'
                placeholder='Relational'
                mb='24px'
                fontWeight='500'
                size='lg'
                name="shortname"
                value={form.shortname}
                onChange={handleChangeForm}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant={"brand"} mr={3} onClick={handleCategory}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}