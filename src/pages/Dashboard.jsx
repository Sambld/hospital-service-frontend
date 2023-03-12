import { Container, Heading, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, Text } from "@chakra-ui/react";
import { MdDashboard } from 'react-icons/md'


const Dashboard = () => {
    return (
        <Container>
            <StatGroup p='10px' border='2px' borderColor='gray.300' borderRadius='xl'>
                <Stat>
                    <StatLabel>Sent</StatLabel>
                    <StatNumber>345,670</StatNumber>
                    <StatHelpText>
                        <StatArrow type='increase' />
                        23.36%
                    </StatHelpText>
                </Stat>

                <Stat>
                    <StatLabel>Clicked</StatLabel>
                    <StatNumber>45</StatNumber>
                    <StatHelpText>
                        <StatArrow type='decrease' />
                        9.05%
                    </StatHelpText>
                </Stat>
            </StatGroup>
        </Container>
    );
}

export default Dashboard;