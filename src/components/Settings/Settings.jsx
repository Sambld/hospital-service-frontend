import { Box, Icon, Text, Select, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { GoSettings } from "react-icons/go";
import { MdOutlineLanguage } from "react-icons/md";
import { TbSunMoon } from "react-icons/tb";
import { BsFillMoonFill } from "react-icons/bs";
import { FaSun } from "react-icons/fa";

const Settings = () => {

    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    return (
        <Box>
            <Box mb={5} mt={5} display='flex' justifyContent='center' alignItems='center' gap={2}>
                <Icon as={GoSettings} w={10} h={10} color='gray.500' />
                <Text textAlign="center" color="gray.500" fontSize={{ base: "md", lg: '3xl' }}>Settings</Text>
            </Box>
            <Box p={5} mt={5} display='flex' gap={2}>
                {/* Theme */}
                <Box
                    w='50%'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    border='2px'
                    borderColor='gray.200'
                    borderRadius='lg'
                    gap={5}
                    p={2}
                >
                    <Box display='flex' justifyContent='center' alignItems='center' gap={2}>
                        <Icon as={TbSunMoon} w={7} h={7} color='blue.900' />
                        <Text color='blue.900' fontSize={{ base: "md", lg: '2xl' }}>
                            Theme
                        </Text>
                    </Box>

                    <Box display='flex'  gap={2} w='100%'>
                        <Button colorScheme="gray" w='100%' leftIcon={<FaSun />} >
                            Light
                        </Button>
                        <Button colorScheme="gray" bg="blue.900" w='100%' color='white' leftIcon={<BsFillMoonFill />} >
                            Dark
                        </Button>

                    </Box>
                </Box>
                {/* Language */}
                <Box
                    w='50%'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    border='2px'
                    borderColor='gray.200'
                    borderRadius='lg'
                    gap={5}
                    p={2}
                >
                    <Box display='flex' justifyContent='center' alignItems='center' gap={2}>
                        <Icon as={MdOutlineLanguage} w={7} h={7} color='blue.900' />
                        <Text color='blue.900' fontSize={{ base: "md", lg: '2xl' }}>
                            Language
                        </Text>
                    </Box>

                    <Select textAlign="center" onChange={(e) => changeLanguage(e.target.value)} value={i18n.language} w='100%' color='blue.900' fontSize={{ base: "md", lg: '2xl' }}>
                        <option value="en">English</option>
                        <option value="ar">Arabic</option>
                        <option value="fr">French</option>
                    </Select>
                </Box>
            </Box>
            <Box display='flex' justifyContent='center' alignItems='center' p={5} pt={0}>
                <Button colorScheme="blue" w='100%'>
                    Save
                </Button>
            </Box>
        </Box>
    );
}

export default Settings;