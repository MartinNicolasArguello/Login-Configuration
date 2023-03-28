import { useState } from "react";
import {
    Flex,
    Input,
    Button,
    Stack,
    Box,
    FormControl,
    useDisclosure,
    Alert,
    AlertIcon,
    SlideFade
} from "@chakra-ui/react";
import { Configuration } from "./Configuration";
import { Logo } from "./Logo";
const MemberLogin = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accessBlock, setAccessBlock] = useState(false);
    const [currentMember, setCurrentMember] = useState({});
    async function access(e) {
        let item = { email, password };
        let result = await fetch("http://localhost:3030/members/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(item)
        });
        result = await result.json();

        if (result.token) {
            setCurrentMember(result.member);
            setAccessBlock(false)
            setEmail("")
            setPassword("")
            onOpen()
        }
        else {
            setAccessBlock(true)
        }
    }
    return (
        <>
            <Stack
                flexDir="column"
                mb="2"
                justifyContent="center"
                alignItems="center"
                mt="30"
            >
                <Box w="450px">
                    <Stack
                        spacing={4}
                        p="1rem"
                        backgroundColor="brand.platinum"
                        boxShadow="md"
                        border='2px' borderColor="brand.golden" shadow="base" borderRadius="10"
                    >
                        <Flex justifyContent="center">
                            <Logo color="brand.purple" border="brand.golden" />
                        </Flex>
                        <form >
                            <FormControl id="email">
                                <Input name="email" w="100%" type="email" placeholder="email address" border="2px" borderColor="brand.purple" focusBorderColor="brand.golden" isRequired
                                    onChange={(e) => setEmail(e.target.value)} m="1px" />
                            </FormControl>
                            <FormControl id="password">
                                <Input
                                    name="password"
                                    w="100%"
                                    type="password"
                                    placeholder="Password"
                                    border="2px" borderColor="brand.purple" focusBorderColor="brand.golden"
                                    isRequired
                                    onChange={(e) => setPassword(e.target.value)}

                                    m="1px"
                                />
                            </FormControl>
                            <Button
                                bg="brand.purple" color="brand.golden" w="full" h="50px" fontSize="2xl" mt="10px" border='2px' borderColor="brand.golden" borderRadius="15"
                                onClick={access}
                            >
                                Access
                            </Button>
                        </form>
                    </Stack>
                </Box>
                <SlideFade in={accessBlock} offsetY='20px'>
                    <Stack spacing={3}  >
                        <Alert status='error' background="brand.purple" color="brand.golden">
                            <AlertIcon boxSize="20px" />
                            Invalid email or password
                        </Alert>
                    </Stack>
                </SlideFade>
                <Configuration isOpen={isOpen} onClose={onClose} currentMember={currentMember} setCurrentMember={setCurrentMember} />
            </Stack>
        </>
    );
};
export { MemberLogin }


