import MessageBoxChat from './MessageBox';
import {
    Box,
    Button,
    Flex,
    Icon,
    Img,
    Spinner,
    Text,
    Textarea,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdAutoAwesome, MdPerson } from 'react-icons/md';
import Bg from '../../../../assets/img/bg-chat-image.png';
import { useMutation } from 'react-query';
import axios from '../../../../variables/axiosConfig';
import Card from '../../../../components/card/Card';

const sendMessageToChatBot = async (message) => {
    const res = await axios.post('/api/send-message-to-chat-bot', { message });
    return res;
}

export default function Chat() {
    const toast = useToast();
    const maxCodeLength = 500;
    const [inputOnSubmit, setInputOnSubmit] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [outputCode, setOutputCode] = useState('');
    const [loading, setLoading] = useState(false);

    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
    const inputColor = useColorModeValue('navy.700', 'white');
    const brandColor = useColorModeValue('brand.500', 'white');
    const textColor = useColorModeValue('navy.700', 'white');
    let secondaryText = useColorModeValue('gray.700', 'gray.500');
    const placeholderColor = useColorModeValue(
        { color: 'gray.500' },
        { color: 'whiteAlpha.600' },
    );

    const sendChatMutation = useMutation(sendMessageToChatBot, {
        onSuccess: async (response) => {
            const data = response.data;
            if (!data) {
                setLoading(false);
                toast({
                    title: 'No response data received.',
                    position: 'top-right',
                    status: "warning",
                    insert: "top",
                    duration: 5000,
                    isClosable: true
                })
                return;
            }

            const answer = data.answer;

            const displayWithChunkEffect = async (text) => {
                let displayedText = '';
                for (const char of text) {
                    displayedText += char;
                    setOutputCode(displayedText);
                    await new Promise((resolve) => setTimeout(resolve, 10));
                }
            }

            await displayWithChunkEffect(answer);
            setLoading(false);
        },
        onError: () => {
            setLoading(false);
            toast({
                title: 'An error occurred while researhing. Please try again later.',
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        },
    })

    const handleChange = (event) => {
        setInputCode(event.target.value);
    };

    const handleTranslate = () => {
        setInputOnSubmit(inputCode);

        if (!inputCode) {
            toast({
                title: 'Please enter your message.',
                position: 'top-right',
                status: "warning",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
            return;
        }

        if (inputCode.length > maxCodeLength) {
            toast({
                title: `Please enter sentences less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
                position: 'top-right',
                status: "warning",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
            return;
        }

        setLoading(true);
        setInputCode('');

        sendChatMutation.mutate(inputCode);
    };

    return (
        <Flex
            w="100%"
            pt={{ base: '70px', md: '0px' }}
            direction="column"
            position="relative"
        >
            <Img
                src={Bg}
                position={'absolute'}
                w="350px"
                left="50%"
                top="50%"
                transform={'translate(-50%, -50%)'}
            />
            <Flex
                direction="column"
                mx="auto"
                w={{ base: '100%', md: '100%', xl: '100%' }}
                minH={{ base: '75vh', '2xl': '85vh' }}
                maxW={{ base: '75vh', '2xl': '85vh' }}
                border={'1px solid'}
                borderColor={borderColor}
                borderRadius={'lg'}
            >
                <Flex
                    direction="column"
                    w="100%"
                    ml={'20px'}
                    display={'flex'}
                    mb={'auto'}
                >
                    <Flex w="100%" align={'center'} mb="10px" display={outputCode ? 'flex' : 'none'}>
                        <Flex
                            borderRadius="full"
                            justify="center"
                            align="center"
                            bg={'transparent'}
                            border="1px solid"
                            borderColor={borderColor}
                            me="20px"
                            h="40px"
                            minH="40px"
                            minW="40px"
                            zIndex={'2'}
                        >
                            <Icon
                                as={MdPerson}
                                width="20px"
                                height="20px"
                                color={brandColor}
                            />
                        </Flex>
                        <Flex
                            p="22px"
                            border="1px solid"
                            borderColor={borderColor}
                            borderRadius="14px"
                            w={{ base: '75%', md: "85%" }}
                            zIndex={'2'}
                        >
                            <Text
                                color={textColor}
                                fontWeight="600"
                                fontSize={{ base: 'sm', md: 'md' }}
                                lineHeight={{ base: '24px', md: '26px' }}
                            >
                                {inputOnSubmit}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex w="100%">
                        <Flex
                            borderRadius="full"
                            justify="center"
                            align="center"
                            bgGradient={"linear(to-r, #2ac349, #018cc1)"}
                            me="20px"
                            h="40px"
                            minH="40px"
                            minW="40px"
                            display={outputCode ? 'flex' : 'none'}
                        >
                            <Icon
                                as={MdAutoAwesome}
                                width="20px"
                                height="20px"
                                color="white"
                            />
                        </Flex>
                        {!loading ? <MessageBoxChat output={outputCode} /> : (
                            <Card
                                px="22px !important"
                                pl="22px !important"
                                color={textColor}
                                w={{ base: '75%', md: "85%" }}
                                fontSize={{ base: 'sm', md: 'md' }}
                                lineHeight={{ base: '24px', md: '26px' }}
                                maxH={'100vh'}
                                overflow={'auto'}
                                fontWeight="500"
                                sx={{
                                    '&::-webkit-scrollbar': {
                                        width: '8px',
                                        height: '8px',
                                        backgroundColor: 'transparent', // Change to transparent or the desired color
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: borderColor, // Color for the scrollbar thumb
                                        borderRadius: '20px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.15)', // Track color, adjust as needed
                                        borderRadius: '20px',
                                    },
                                }}
                            >
                                <Spinner />
                            </Card>
                        )}
                    </Flex>
                </Flex>
                {/* Chat Input */}
                <Text textColor={secondaryText} textAlign={'center'}>Sometimes I am not smart enough. I am still learning.</Text>
                <Box bottom={0} width={'full'}>
                    <Flex ms={{ base: '0px', xl: '60px' }} mt="20px" justifyContent={'center'} alignItems={'center'}>
                        <Textarea
                            minH="54px"
                            border="1px solid"
                            borderColor={borderColor}
                            borderRadius="45px"
                            p="15px 20px"
                            me="10px"
                            fontSize="sm"
                            fontWeight="500"
                            _focus={{ borderColor: 'none' }}
                            color={inputColor}
                            _placeholder={placeholderColor}
                            placeholder="Type your message here..."
                            value={inputCode}
                            onChange={handleChange}
                            sx={{
                                '&::-webkit-scrollbar': {
                                    width: '8px',
                                    height: '8px',
                                    backgroundColor: 'transparent', // Change to transparent or the desired color
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: borderColor, // Color for the scrollbar thumb
                                    borderRadius: '20px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.15)', // Track color, adjust as needed
                                    borderRadius: '20px',
                                },
                            }}
                        />
                        <Button
                            variant="primary"
                            py="20px"
                            px="16px"
                            fontSize="sm"
                            borderRadius="45px"
                            ms="auto"
                            w={{ base: '160px', md: '210px' }}
                            bg='linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important'
                            h="54px"
                            _hover={{
                                boxShadow:
                                    '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
                                _disabled: {
                                    bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
                                },
                            }}
                            color={'white'}
                            onClick={handleTranslate}
                            isLoading={loading ? true : false}
                        >
                            Submit
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </Flex>
    );
}
