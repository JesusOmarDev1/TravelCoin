// TransaccionesList.jsx
import { Box, Table, Heading, Text } from '@radix-ui/themes';
import { useMetaMask } from '../context/MetaMaskContext';
import { useEffect, useState } from 'react';

export const TransaccionesList = () => {
  const { actor, account } = useMetaMask();
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    const fetchTransacciones = async () => {
      if (!actor || !account) return;
      
      try {
        const trans = await actor.obtenerTransacciones(Principal.fromText(account));
        setTransacciones(trans);
      } catch (error) {
        console.error("Error fetching transacciones:", error);
      }
    };

    fetchTransacciones();
  }, [actor, account]);

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp / 1000000n)).toLocaleString();
  };

  return (
    <Box>
      <Heading size="4" mb="4">Historial de Transacciones</Heading>
      
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Tipo</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cantidad</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Fecha</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {transacciones.map((trans) => (
            <Table.Row key={trans.id}>
              <Table.Cell>{trans.tipo}</Table.Cell>
              <Table.Cell>{trans.cantidad.toString()} TC</Table.Cell>
              <Table.Cell>{formatDate(trans.fecha)}</Table.Cell>
              <Table.Cell>{trans.estado}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};