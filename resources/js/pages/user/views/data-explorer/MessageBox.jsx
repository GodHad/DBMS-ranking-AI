import ReactMarkdown from 'react-markdown';
import { useColorModeValue } from '@chakra-ui/react';
import Card from '../../../../components/card/Card';

export default function MessageBox(props) {
    const { output } = props
    const textColor = useColorModeValue('navy.700', 'white')
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
    return (
        <Card
            display={output ? 'flex' : 'none'}
            px="22px !important"
            pl="22px !important"
            color={textColor}
            width="85%"
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
            <ReactMarkdown className="font-medium" style={{ width: '100%', overflow: 'auto', height: 'calc(100% - 300px)' }}>
                {output ? output : ''}
            </ReactMarkdown>
        </Card>
    )
}
