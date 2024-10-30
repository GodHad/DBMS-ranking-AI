import React from "react";
import { linkDetails } from "./__linkDetails";
import { HStack, Button, ButtonGroup } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NavItems = () => {
    return (
        <React.Fragment>
            <HStack
                display={{
                    base: "none",
                    sm: "none",
                    md: "flex",
                }}
                flexDir="row"
            >
                <ButtonGroup isAttached alignSelf="center">
                    {linkDetails.map(
                        (
                            item,
                            index
                        ) => (
                            <Button
                                key={index}
                                as={Link}
                                variant={"ghost"}
                                size="sm"
                                colorScheme="blue"
                                href={item.link}
                                passHref
                                _focus={{ boxShadow: "outline" }}
                            >
                                {item.name}
                            </Button>
                        )
                    )}
                </ButtonGroup>
            </HStack>
        </React.Fragment>
    );
};

export default NavItems;