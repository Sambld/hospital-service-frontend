import { Container, Heading, Text } from "@chakra-ui/react";
import {MdDashboard} from 'react-icons/md'


const Dashboard = () => {
    return ( 
        <Container>
            <Heading>Dashboard</Heading>
            <Text>Dashboard page</Text>
            <MdDashboard />
        </Container>
     );
}
 
export default Dashboard;