// UserProfile.jsx
import { Box, Card, Flex, Heading, Text, Button } from '@radix-ui/themes';
import { useMetaMask } from '../context/MetaMaskContext';

export const UserProfile = () => {
  const { account, userData, balance } = useMetaMask();

  if (!userData) return null;

  return (
    <Card>
      <Heading size="4">Tu Perfil</Heading>
      <Flex direction="column" gap="2" mt="4">
        <Text>Wallet: {account.substring(0, 6)}...{account.substring(38)}</Text>
        <Text>Nombre: {userData.nombre || 'No especificado'}</Text>
        <Text>TravelCoins: {balance.toString()}</Text>
        <Text>Viajes realizados: {userData.historialViajes.length}</Text>
        <Text>Actividades completadas: {userData.historialActividades.length}</Text>
      </Flex>
    </Card>
  );
};