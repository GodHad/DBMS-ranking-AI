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

export default function CategoryModal({ category, onopen, handleOnClose, handleOnUpdate }) {
  const toast = useToast();
  const { id, name } = category;
  const { isOpen, onOpen, onClose } = useDisclosure()
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const [form, setForm] = useState({
    id,
    name,
  })

  const handleChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleCategory = async () => {
    if (!form.id) {
      const res = await axios.post('/api/blog/create-category', form);
      if (res.data.success) {
        onClose()
        handleOnUpdate()
        toast({
          title: "Create new category successfully",
          position: 'top-right',
          status: "success",
          insert: "top",
          duration: 5000,
          isClosable: true
        })
      } else {
        toast({
          title: "Failed to create new category",
          position: 'top-right',
          status: "error",
          insert: "top",
          duration: 5000,
          isClosable: true
        })
      }
    } else {
      const res = await axios.post(`/api/blog/update-category?id=${form.id}`, form);
      if (res.data.success) {
        onClose()
        handleOnUpdate()
        toast({
          title: "Update category successfully",
          position: 'top-right',
          status: "success",
          insert: "top",
          duration: 5000,
          isClosable: true
        })
      } else {
        toast({
          title: "Failed to update category",
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
  }, [category])

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