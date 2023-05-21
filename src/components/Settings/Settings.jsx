import { Box, Icon, Text, Select, Button, useToast, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { Form } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { GoSettings } from "react-icons/go";
import { MdOutlineLanguage } from "react-icons/md";
import { TbSunMoon } from "react-icons/tb";
import { BsFillMoonFill } from "react-icons/bs";
import { FaSun } from "react-icons/fa";

const Settings = ({ onClose }) => {
    const toast = useToast();
    const { t, i18n } = useTranslation();
    const { colorMode, toggleColorMode } = useColorMode()

    const [language, setLanguage] = useState(i18n.language);
    const [theme, setTheme] = useState(colorMode);

    const changeLanguage = () => {
        if (language != i18n.language) {
            localStorage.setItem('language', language);
            toast({
                title:  t('global.reloading'),
                status: 'loading',
                duration: 3000
            });
            window.location.reload();
        } else {
            toast({
                title: t('settings.settingsChanged'),
                status: 'success',
                duration: 3000
            });
            onClose();
        }

    };

    const changeTheme = () => {
        if (theme != colorMode) {
            toggleColorMode();
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        try {
            changeTheme();
            changeLanguage();

        } catch (err) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });

        }

    };
    return (
        <Form onSubmit={handleSubmit}>
            <Box mb={5} mt={5} display='flex' justifyContent='center' alignItems='center' gap={2}>
                <Icon as={GoSettings} w={10} h={10} color={useColorModeValue('gray.500', 'gray.50')} />
                <Text textAlign="center" color={useColorModeValue('gray.500', 'gray.50')} fontSize={{ base: "md", lg: '3xl' }}>
                    {t('navbar.settings')}
                </Text>
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
                        <Icon as={TbSunMoon} w={7} h={7} color={useColorModeValue('blue.900', 'white')} />
                        <Text
                            color={useColorModeValue('blue.900', 'white')}
                            fontSize={{ base: "md", lg: '2xl' }}
                        >
                            {t('navbar.theme')}
                        </Text>
                    </Box>

                    <Box display='flex' gap={2} w='100%'>
                        <Button colorScheme="gray" w='100%' leftIcon={<FaSun />} isDisabled={theme === 'light'} onClick={() => setTheme('light')}>
                            {t('navbar.light')}
                        </Button>
                        <Button colorScheme="gray" bg="blue.900" w='100%' color='white' leftIcon={<BsFillMoonFill />} isDisabled={theme === 'dark'} onClick={() => setTheme('dark')}>
                            {t('navbar.dark')}
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
                        <Icon as={MdOutlineLanguage} w={7} h={7} color={useColorModeValue('blue.900', 'white')} />
                        <Text color={useColorModeValue('blue.900', 'white')} fontSize={{ base: "md", lg: '2xl' }}>
                            {t('navbar.language')}
                        </Text>
                    </Box>

                    <Select
                        textAlign="center"
                        onChange={(e) => setLanguage(e.target.value)}
                        value={language}
                        w='100%'
                        color={useColorModeValue('blue.900', 'white')}
                        fontSize={{ base: "md", lg: '2xl' }}
                        cursor='pointer'
                    >
                        <option value="en">
                            {t('navbar.languageList.en')}
                        </option>
                        <option value="ar">
                            {t('navbar.languageList.ar')}
                        </option>
                        <option value="fr">
                            {t('navbar.languageList.fr')}
                        </option>
                    </Select>
                </Box>
            </Box>
            <Box display='flex' justifyContent='center' alignItems='center' p={5} pt={0}>
                <Button colorScheme="blue" w='100%' type="submit">
                    {t('global.save')}
                </Button>
            </Box>
        </Form>
    );
}

export default Settings;