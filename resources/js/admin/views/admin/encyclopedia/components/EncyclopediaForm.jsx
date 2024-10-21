import React, { useState, useEffect } from 'react'
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Box,
    useToast,
    useColorModeValue
} from '@chakra-ui/react'
import { useQueryClient, useMutation } from 'react-query';
import { createEncyclopedia, updateEncyclopedia } from '../requests/use-request';
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertFromHTML, convertToRaw, EditorState, Modifier, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { CustomInput } from '../../../../components/form/CustomInput';

export default function EncyclopediaForm({ encyclopedia, setOpenedPage }) {
    const queryClient = useQueryClient();
    const toast = useToast();
    const textColor = useColorModeValue("grey", "white");
    const brandStars = useColorModeValue("brand.500", "brand.400");

    const {
        id,
        title,
        content
    } = encyclopedia;

    const [form, setForm] = useState({
        id,
        title,
        content
    })

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const onEditorStateChange = function (editorState) {
        setEditorState(editorState);
        setForm((prevState) => (
            { ...prevState, content: draftToHtml(convertToRaw(editorState.getCurrentContent())) }
        ))
    };

    const createEncyclopediaMutation = useMutation(createEncyclopedia, {
        onSuccess: () => {
            queryClient.invalidateQueries('encyclopedias');
            setOpenedPage(0)
            toast({
                title: "Create new Encyclopedia successfully",
                position: 'top-right',
                status: "success",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        },
        onError: ({ errors }) => {
            toast({
                title: "Failed to create Encyclopedia",
                description: errors,
                position: 'top-right',
                status: "success",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const updateEncyclopediaMutation = useMutation(updateEncyclopedia, {
        onSuccess: () => {
            queryClient.invalidateQueries('encyclopedias');
            setOpenedPage(0)
            toast({
                title: "Update Encyclopedia successfully",
                position: 'top-right',
                status: "success",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        },
        onError: ({ errors }) => {
            toast({
                title: "Failed to update Encyclopedia successfully",
                description: errors,
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const handleEncyclopedia = () => {
        if (!form.id) createEncyclopediaMutation.mutate({ encyclopedia: form });
        else updateEncyclopediaMutation.mutate({ encyclopedia: form });
    }

    const handleChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handlePastedText = (text, html, editorState) => {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();

        const newContentState = Modifier.insertText(contentState, selection, text);

        const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
        setEditorState(newEditorState);

        return true;
    };

    useEffect(() => {
        setForm({
            id,
            title,
            content
        });
    }, [encyclopedia])

    useEffect(() => {
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();

        const contentWithColor = Modifier.applyInlineStyle(
            currentContent,
            selection,
            'COLOR_' + textColor
        );
        const newEditorState = EditorState.push(editorState, contentWithColor, 'change-inline-style');
        setEditorState(newEditorState);

    }, [textColor, editorState]);

    useEffect(() => {
        if (form.content) {
            const blocksFromHTML = convertFromHTML(form.content);
            const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, [])

    return (
        <Box p={"20px"}>
            <Text mb={"32px"} fontSize={22}>{!encyclopedia.id ? "Create" : "Update"} Encyclopedia</Text>
            <FormControl>
                <CustomInput title="Encyclopedia Title" name="title" value={form.title} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
            </FormControl>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                editorStyle={{ color: textColor, minHeight: 300 }}
                onEditorStateChange={onEditorStateChange}
                handlePastedText={handlePastedText}
                toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'history'],
                    inline: { inDropdown: false },
                    blockType: { inDropdown: true },
                    fontSize: { inDropdown: true },
                    list: { inDropdown: false },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: false },
                    history: { inDropdown: false },
                    // Remove image and embed
                    image: { visible: false },
                    embed: { visible: false }
                }}
            />
            <Button variant={"brand"} mt={3} mr={3} onClick={handleEncyclopedia}>
                Save
            </Button>
            <Button mt={3} onClick={() => setOpenedPage(0)}>Cancel</Button>
        </Box>
    )
}
