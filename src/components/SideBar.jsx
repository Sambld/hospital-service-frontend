import { HStack, List, ListIcon, ListItem, Spacer, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { RiFolderOpenLine, RiDashboardLine } from 'react-icons/ri'
import { FiUsers } from 'react-icons/fi'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { BsFileEarmarkMedical } from 'react-icons/bs'
import { MdOutlineMedicalServices, MdOutlineSick } from 'react-icons/md'
import { useState } from "react";
import { useEffect } from "react";
import { AiOutlineBarChart } from "react-icons/ai";
import { SiChatbot } from "react-icons/si";

// Translation
import { useTranslation } from "react-i18next";

const SideBarItems = (user) => {
  let items = [
    { name: 'sideBar.dashboard', icon: <RiDashboardLine size={23} />, link: '/' },
  ];
  try {
    if (user.role === 'administrator') {
      items.push({ name: 'sideBar.staff', icon: <HiOutlineUserGroup size={23} />, link: '/staff' });
    } else if (user.role === 'doctor') {
      items.push({ name: 'sideBar.patients', icon: <MdOutlineSick size={23} />, link: '/patients' });
      items.push({ name: 'sideBar.medicalRecords' , icon: <RiFolderOpenLine size={23} />, link: '/medical-records' });
      items.push({ name: 'sideBar.statistics', icon: <AiOutlineBarChart size={23} />, link: '/statistics' })
    } else if (user.role === 'nurse') {
      items.push({ name: 'sideBar.patients', icon: <MdOutlineSick size={23} />, link: '/patients' });
      items.push({ name: 'sideBar.statistics', icon: <AiOutlineBarChart size={23} />, link: '/statistics' })
    } else if (user.role === 'pharmacist') {
      items.push({ name: 'sideBar.prescriptions', icon: <BsFileEarmarkMedical size={23} />, link: '/prescriptions' })
      items.push({ name: 'sideBar.medicines', icon: <MdOutlineMedicalServices size={23} />, link: '/medicines' })
      items.push({ name: 'sideBar.statistics', icon: <AiOutlineBarChart size={23} />, link: '/statistics' })
    }
      
      return items;
  } catch { return items; }
}

const SideBar = ({ user }) => {

  const { t,i18n } = useTranslation();

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
              <Text display={{ base: 'none', lg: 'block' }}>
                {t(item.name)}
                </Text>
            </HStack>
          </NavLink>
        </ListItem>
      ))}

    </List>
  );
}

export default SideBar;