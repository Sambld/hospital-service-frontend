import { HStack, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { RiFolderOpenLine, RiDashboardLine } from 'react-icons/ri'
import { FaUserFriends } from 'react-icons/fa'
import { useState } from "react";

const SideBarItems = (user) => {
  let items = [
    { name: 'Dashboard', icon: <RiDashboardLine size={23} />, link: '/' },
  ];
  if (user.role === 's') {
    items.push({ name: 'Staff', icon: <FaUserFriends size={23} />, link: '/staff' });
    items.push({ name: 'Patients', icon: <RiFolderOpenLine size={23} />, link: '/patients' });
  } else if (user.role === 'd') {
    items.push({ name: 'Patients', icon: <RiFolderOpenLine size={23} />, link: '/patients' });
  } else if (user.role === 'n') {
    items.push({ name: 'Patients', icon: <RiFolderOpenLine size={23} />, link: '/patients' });
  } else if (user.role === 'p') {
    items.push({ name: 'Patients', icon: <RiFolderOpenLine size={23} />, link: '/patients' });
  }else return null;
  return items;

}

const SideBar = ({ user }) => {
  const [SidebarItem, setSidebarItem] = useState(SideBarItems(user));

  return (
    <List pl='10px' pt='10px' fontSize="1.2em" spacing={0}>
      {SidebarItem && SidebarItem.map((item, index) => (
        <ListItem color="#3a3e54" key={index}>
          <NavLink to={item.link} >
            <HStack p='10px' border='2px' borderColor='transparent' _hover={{
              color: "#374083",
            }}>
              {item.icon}
              <Text>{item.name}</Text>
            </HStack>
          </NavLink>
        </ListItem>
      ))}
    </List>
  );
}

export default SideBar;