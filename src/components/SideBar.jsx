import { AtSignIcon, CalendarIcon, EditIcon } from "@chakra-ui/icons";
import { HStack, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import {FiUser} from 'react-icons/fi'
import {RiFolderOpenLine,RiDashboardLine} from 'react-icons/ri'
import {FaUserFriends} from 'react-icons/fa'


const SideBar = () => {
    return ( 
        <List pl='10px' pt='10px' fontSize="1.2em" spacing={0}>
          <ListItem>
            <NavLink to="/" >
              <HStack p='10px' border='2px' borderColor='transparent' _hover={{
                  color: "#374083",
                }}>
                <RiDashboardLine size={23} />
                <Text>Dashboard</Text>
              </HStack>
            </NavLink>
          </ListItem>
          <ListItem color="#3a3e54">
            <NavLink to="/profile">
              <HStack p='10px' border='2px' borderColor='transparent' _hover={{
                  color: "#374083",
                }}>
                <FiUser size={23} />
                <Text>Profile</Text>
              </HStack>
            </NavLink>
          </ListItem>
          <ListItem color="#3a3e54">
            <NavLink to="/staff">
              <HStack p='10px' border='2px' borderColor='transparent' _hover={{
                  color: "#374083",
                }}>
                <FaUserFriends size={23} />
                <Text>Staff</Text>
              </HStack>
            </NavLink>
          </ListItem>
          <ListItem color="#3a3e54">
            <NavLink to="/Patients">
              <HStack p='10px' border='2px' borderColor='transparent' _hover={{
                  color: "#374083",
                }}>
                <RiFolderOpenLine size={23} />
                <Text>Patients</Text>
              </HStack>
            </NavLink>
          </ListItem>
        </List>
     );
}
 
export default SideBar;