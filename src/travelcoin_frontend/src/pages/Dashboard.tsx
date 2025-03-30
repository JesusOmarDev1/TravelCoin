import { SignedIn, useAuth, UserButton, UserProfile } from '@clerk/clerk-react';
import { Box, Flex, Heading, Tabs, Text } from '@radix-ui/themes';
import { redirect } from 'react-router-dom';
import { cardsData } from '../data/viajes'; // Asegúrate de que esta ruta sea correcta

export default function Dashboard() {
  const auth = useAuth();

  // Redirigir si el usuario no está autenticado
  if (!auth.isSignedIn) {
    return redirect('/');
  }

  return (
    <Box p="4" className="w-full">
      <Flex justify="between" align="center" mb="4">
        <Heading>TravelCoin</Heading>
        <UserButton />
      </Flex>

      <Tabs.Root defaultValue="viajes">
        <Tabs.List>
          <Tabs.Trigger value="viajes">Viajes</Tabs.Trigger>
          <Tabs.Trigger value="perfil">Mi Perfil</Tabs.Trigger>
          <Tabs.Trigger value="transacciones">Mis Transacciones</Tabs.Trigger>
        </Tabs.List>

        <Box px="4" pt="3" pb="2">
          {/* Pestaña de Viajes */}
          <Tabs.Content value="viajes">
            <Box>
              <Heading size="3">Viajes Disponibles</Heading>
              <Box overflowX="auto" mt="10px">
                {/* Tabla de Viajes */}
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                      <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Título</th>
                      <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Descripción</th>
                      <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Itinerario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cardsData.map((viaje, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                        <td style={{ padding: "10px" }}>{viaje.title}</td>
                        <td style={{ padding: "10px" }}>{viaje.desc}</td>
                        <td style={{ padding: "10px" }}>
                          <Box>
                            {/* Mostrar el itinerario */}
                            {viaje.itinerary.map((item, i) => (
                              <Box key={i} mb="8px" style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                                <Text style={{ fontWeight: "bold" }}>{item.title}:</Text>
                                <Text>{item.desc}</Text>
                                <br />
                                <Text style={{ fontStyle: "italic", color: "#888" }}>Estado: {item.status}</Text>
                              </Box>
                            ))}
                          </Box>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Box>
          </Tabs.Content>

          {/* Pestaña de Transacciones */}
          <Tabs.Content value="transacciones">
            <Box>
              <Heading size="3">Mis Transacciones</Heading>
              <Box overflowX="auto" mt="10px">
                {/* Tabla de Transacciones vacía */}
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                      <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>ID</th>
                      <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Tipo</th>
                      <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Cantidad</th>
                      <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Aquí se llenarán las transacciones en el futuro */}
                    <tr>
                      <td  style={{ padding: "10px", textAlign: "center" }}>
                        No hay transacciones registradas.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Box>
            </Box>
          </Tabs.Content>

          <Tabs.Content value='perfil'>
            <UserProfile />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
