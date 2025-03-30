// ViajesList.jsx
import { Box, Card, Flex, Heading, Text, Button, Badge } from '@radix-ui/themes';
import { useMetaMask } from '../context/MetaMaskContext';

export const ViajesList = () => {
  const { viajes, reservarViaje, balance, isAuthenticated } = useMetaMask();

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp / 1000000n)).toLocaleDateString();
  };

  return (
    <Box>
      <Heading size="4" mb="4">Viajes Disponibles</Heading>
      {isAuthenticated && (
        <Text size="2" mb="4">Tus TravelCoins: {balance.toString()}</Text>
      )}
      
      <Flex gap="4" wrap="wrap">
        {viajes.map((viaje) => (
          <Card key={viaje.id} style={{ width: '300px' }}>
            <Flex direction="column" gap="2">
              <Heading size="3">{viaje.titulo}</Heading>
              <Text color="gray">{viaje.destino}</Text>
              <Text>{viaje.descripcion}</Text>
              
              <Flex justify="between">
                <Text>Inicio: {formatDate(viaje.fechaInicio)}</Text>
                <Text>Fin: {formatDate(viaje.fechaFin)}</Text>
              </Flex>
              
              <Flex justify="between" align="center">
                <Text>Precio: {viaje.precio} ETH</Text>
                <Badge color={viaje.estado === 'Pendiente' ? 'green' : 'orange'}>
                  {viaje.estado}
                </Badge>
              </Flex>
              
              <Text>Cupos: {viaje.inscritos.length}/{viaje.cupoMaximo}</Text>
              <Text>Recompensa: {viaje.tokensRecompensa} TC</Text>
              
              {isAuthenticated && (
                <Button 
                  onClick={async () => {
                    const result = await reservarViaje(viaje.id);
                    alert(result.message);
                  }}
                  disabled={viaje.estado !== 'Pendiente'}
                >
                  Reservar
                </Button>
              )}
            </Flex>
          </Card>
        ))}
      </Flex>
    </Box>
  );
};