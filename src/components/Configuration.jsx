import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
    Flex,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Select,
    IconButton,
    Image,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    SlideFade,
    Alert,
    AlertIcon,
    Stack,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons'
import { priceList } from '../resources/priceList';

const Configuration = ({ onClose, isOpen, currentMember, setCurrentMember }) => {

    const [updatedData, setUpdatedData] = useState({ weightsAccess: "", weightsCost: 0, spinningAccess: "", spinningCost: 0, saunaAccess: "", saunaCost: 0, poolAccess: "", poolCost: 0 });
    const [totalCost, setTotalCost] = useState(0);
    const uploadRef = useRef();
    const [successAlert, setSuccessAlert] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    useEffect(() => {
        setTotalCost((updatedData.weightsCost || 0) + (updatedData.spinningCost || 0) + (updatedData.saunaCost || 0) + (updatedData.poolCost || 0))

    }, [updatedData]);


    function addDays(days) {
        let date = Date()
        let result = new Date(date)
        result.setDate(result.getDate() + Number(days))
        return `${result.getDate()}/${result.getMonth() + 1}/${result.getFullYear()}`
    }

    async function update(e) {

        let dataForUpdate = { email: currentMember.email, weightsAccess: updatedData.weightsAccess || currentMember.weightsAccess, spinningAccess: updatedData.spinningAccess || currentMember.spinningAccess, saunaAccess: updatedData.saunaAccess || currentMember.saunaAccess, poolAccess: updatedData.poolAccess || currentMember.poolAccess, isActive: false }

        if (dataForUpdate.weightsAccess || dataForUpdate.spinningAccess || dataForUpdate.saunaAccess || dataForUpdate.poolAccess) {
            dataForUpdate.isActive = true
        }
        await fetch("http://localhost:3030/members/membership-configuration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(dataForUpdate)
        });

        setUpdatedData({ weightsAccess: "", spinningAccess: "", saunaAccess: "", poolAccess: "" })

        setButtonLoading(true)
        setTimeout(() => {
            setSuccessAlert(true)
            setTimeout(() => {
                setSuccessAlert(false)
                setButtonLoading(false)
                onClose()
                location.reload()
            }, 1000);
        }, 1000);

    };
    async function refreshImage() {
        let result = await fetch("http://localhost:3030/members/get-profile-pic", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(currentMember)
        });
        result = await result.json();
        return result.profilePic
    };
    async function handleUpload(e) {
        if (e.target.files[0]) {

            let data = new FormData();
            data.append("profilePic", e.target.files[0])
            data.append("email", currentMember.email)
            await fetch("http://localhost:3030/members/profile-pic", {
                method: "POST",
                body: data
            });
            let newPicDir = await refreshImage()
            setCurrentMember((prev) => ({ ...prev, profilePic: newPicDir }))
        }
    };

    function handleClose() {
        onClose()
        location.reload()

    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} motionPreset='scale' size="3xl" isCentered closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent display="flex" h="auto" bg="brand.platinum" flexDirection="column" justify="center" align="space-between"
                m="auto" border='2px' borderColor="brand.golden" borderRadius="15" shadow="base">

                <Box w="full" h="75px" p="0" bg="brand.purple" borderRadius="15" borderBottomRadius="0" pl="4px"  >
                    <Heading fontSize="3xl" color="brand.gray"  >Welcome back, <Text as="span" fontSize="5xl" color="brand.golden">{currentMember.lastName}</Text></Heading>
                </Box>
                <Flex p="5" borderTop="2px" borderColor="brand.golden">
                    <Flex flexDirection="column" w="full" p="2" my={4}>
                        <Flex pt="13px" >
                            <Image boxSize="230" objectFit='cover' border='2px'
                                borderColor="brand.golden" borderRadius='full' src={currentMember.profilePic}></Image>
                            <IconButton
                                onClick={() => uploadRef.current.click()}
                                border='1px'
                                borderColor="brand.purple"
                                borderRadius="50"
                                bg="brand.golden"
                                w={6}
                                h={6}
                                variant='outline'
                                aria-label='Search database'
                                icon={< Search2Icon />}

                            >  </IconButton >
                            <Input type="file" name="profilePic" ref={uploadRef} display="none" onChange={handleUpload}></Input>
                        </Flex>
                        <Flex mt="auto" >
                            <Box display="flex" flexDirection="column">
                                <Text as="b" fontSize="2xl">Name: </Text>
                                <Text as="b" fontSize="2xl">DNI:</Text>
                                <Text as="b" fontSize="2xl">Email: </Text>
                                <Text as="b" fontSize="2xl">Status: </Text>
                            </Box>
                            <Box display="flex" flexDirection="column">
                                <Text color="brand.gray" fontSize="2xl" >{currentMember.lastName}</Text>
                                <Text color="brand.gray" fontSize="2xl" >{currentMember.DNI}</Text>
                                <Text color="brand.gray" fontSize="2xl" >{currentMember.email}</Text>
                                <Text color="brand.gray" fontSize="2xl" >{currentMember.isActive ? <Text as="span" color="brand.golden" ml="3px" > Active </Text> : "Not Active"}</Text>
                            </Box>
                        </Flex>
                    </Flex>
                    <Flex flexDirection="column" w="full" p="2" my={4} >
                        <Heading fontSize="4xl" as="b" >Manage access</Heading>
                        <FormControl>
                            <FormControl>
                                <FormLabel fontSize="2xl" color="brand.purple">Weights</FormLabel>

                                {currentMember.weightsAccess ? <FormLabel color="brand.golden" fontSize="lg" >Access granted until {currentMember.weightsAccess}</FormLabel> : <Select name="weightsAccess" placeholder='Select your plan' border="1px" borderColor="brand.purple" borderRadius="15" bg="brand.gray" color="brand.purple" onChange={(e) => setUpdatedData((prev) => ({ ...prev, weightsAccess: addDays(e.target.value), weightsCost: priceList.weights[e.target.value] }))}>
                                    <option value={30} >30 days plan $50</option>
                                    <option value={60}>60 days plan $80</option>
                                    <option value={90}>90 days plan $120</option>

                                </Select>}
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="2xl" color="brand.purple" >Spinning</FormLabel>
                                {currentMember.spinningAccess ? <FormLabel color="brand.golden" fontSize="lg">Access granted until {currentMember.spinningAccess}</FormLabel> : <Select name="spinningAccess" placeholder='Select your plan' border="1px" borderColor="brand.purple" borderRadius="15" bg="brand.gray" color="brand.purple" onChange={(e) => setUpdatedData((prev) => ({ ...prev, spinningAccess: addDays(e.target.value), spinningCost: priceList.spinning[e.target.value] }))}>
                                    <option value={30}>30 days plan $80</option>
                                    <option value={60}>60 days plan $110</option>
                                    <option value={90}>90 days plan $150</option>

                                </Select>}
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="2xl" color="brand.purple">Sauna</FormLabel>
                                {currentMember.saunaAccess ? <FormLabel color="brand.golden" fontSize="lg">Access granted until {currentMember.saunaAccess}</FormLabel> : <Select name="saunaAccess" placeholder='Select your plan' border="1px" borderColor="brand.purple" borderRadius="15" bg="brand.gray" color="brand.purple" onChange={(e) => setUpdatedData((prev) => ({ ...prev, saunaAccess: addDays(e.target.value), saunaCost: priceList.sauna[e.target.value] }))}>
                                    <option value={30}>30 days plan $20</option>
                                    <option value={60}>60 days plan $35</option>
                                    <option value={90}>90 days plan $50</option>

                                </Select>}
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="2xl" color="brand.purple">Pool</FormLabel>
                                {currentMember.poolAccess ? <FormLabel color="brand.golden" fontSize="lg">Access granted until {currentMember.poolAccess}</FormLabel> : <Select name="poolAccess" placeholder='Select your plan' border="1px" borderColor="brand.purple" borderRadius="15" bg="brand.gray" color="brand.purple" onChange={(e) => setUpdatedData((prev) => ({ ...prev, poolAccess: addDays(e.target.value), poolCost: priceList.pool[e.target.value] }))}>
                                    <option value={30}>30 days plan $50</option>
                                    <option value={60}>60 days plan $80</option>
                                    <option value={90}>90 days plan $120</option>

                                </Select>}
                            </FormControl>
                            <Flex flexDirection="column" mt="auto" >
                                <Button fontSize="2xl" bg="brand.purple" color="brand.golden" h="50px" w="100%" m="2px" border="1px" borderColor="brand.golden" borderRadius="15" onClick={handleClose}  >
                                    Exit
                                </Button>
                                <Button fontSize="2xl" bg="brand.purple" color="brand.golden" h="50px" w="100%" m="2px" border="1px" borderColor="brand.golden" borderRadius="15" onClick={update} isDisabled={totalCost ? false : true} isLoading={buttonLoading ? true
                                    : false}
                                    loadingText='Submitting' >
                                    Update membership
                                </Button>
                                <Box h="8px">
                                    {totalCost ? <SlideFade in={true} offsetY='20px' >
                                        <Stack spacing={3}  >
                                            <Alert fontSize="xl" status='warning' bg="none" color="brand.purple">
                                                <AlertIcon boxSize="20px" />
                                                {`Update cost: $ ${totalCost}`}
                                            </Alert>
                                        </Stack>
                                    </SlideFade> : null}
                                    {successAlert ? <SlideFade in={true} offsetY='20px' >
                                        <Stack spacing={3}  >
                                            <Alert fontSize="xl" status="success" bg="none" color="brand.golden">
                                                <AlertIcon boxSize="20px" />
                                                {`Update Successful`}
                                            </Alert>
                                        </Stack>
                                    </SlideFade> : null}
                                </Box>
                            </Flex>
                        </FormControl>
                    </Flex>
                </Flex>
            </ModalContent >
        </Modal >

    )
};

export { Configuration }




