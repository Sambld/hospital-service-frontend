import { HStack, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { RiFolderOpenLine, RiDashboardLine } from 'react-icons/ri'
import { FaUserFriends } from 'react-icons/fa'
import { BsFileEarmarkMedical } from 'react-icons/bs'
import { MdOutlineMedicalServices, MdOutlineSick } from 'react-icons/md'
import { useState } from "react";
import { useEffect } from "react";

const SideBarItems = (user) => {
  let items = [
    { name: 'Dashboard', icon: <RiDashboardLine size={23} />, link: '/' },
    { name: 'Patients', icon: <MdOutlineSick size={23} />, link: '/patients' },
  ];
  try {
    if (user.role === 'administrator') {
      items.push({ name: 'Staff', icon: <FaUserFriends size={23} />, link: '/staff' });
      items.push({ name: 'Prescriptions', icon: <BsFileEarmarkMedical size={23} />, link: '/prescriptions' })
      items.push({ name: 'Medicines', icon: <MdOutlineMedicalServices size={23} />, link: '/medicines' })
    } else if (user.role === 'doctor') {
      items.push({ name: 'Medical Records' , icon: <RiFolderOpenLine size={23} />, link: '/medical-records' });
    } else if (user.role === 'nurse') {
    } else if (user.role === 'pharmacist') {
      items.push({ name: 'Prescriptions', icon: <BsFileEarmarkMedical size={23} />, link: '/prescriptions' })
      items.push({ name: 'Medicines', icon: <MdOutlineMedicalServices size={23} />, link: '/medicines' })
    }
      return items;
  } catch { return items; }
}

const SideBar = ({ user }) => {
  const [SidebarItem, setSidebarItem] = useState(SideBarItems(user));

  useEffect(() => {
    setSidebarItem(SideBarItems(user));
  }, [user])

  return (
    <List pl={{base:'0px',lg:'10px'}} pt='10px' fontSize="1.2em" spacing={0}>
      {SidebarItem && SidebarItem.map((item, index) => (
        <ListItem color="#3a3e54" key={index}>
          <NavLink to={item.link} >
            <HStack p='10px' border='2px' borderColor='transparent' _hover={{
              color: "#374083",
            }}>
              {item.icon}
              {/* if is below lg then don't show text */}
              <Text display={{ base: 'none', lg: 'block' }}>{item.name}</Text>
            </HStack>
          </NavLink>
        </ListItem>
      ))}
    </List>
  );
}

export default SideBar;