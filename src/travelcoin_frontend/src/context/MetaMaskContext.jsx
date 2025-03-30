// MetaMaskContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/travelcoin_backend';

const MetaMaskContext = createContext();

export const MetaMaskProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [viajes, setViajes] = useState([]);
  const [balance, setBalance] = useState(0);

  const fetchUserData = async () => {
    if (!actor || !account) return;
    
    try {
      const data = await actor.obtenerUsuario(Principal.fromText(account));
      setUserData(data);
      if (data) {
        const bal = await actor.obtenerBalance(Principal.fromText(account));
        setBalance(bal);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchViajes = async () => {
    if (!actor) return;
    
    try {
      const viajesData = await actor.obtenerViajesDisponibles();
      setViajes(viajesData);
    } catch (error) {
      console.error("Error fetching viajes:", error);
    }
  };

  const connectMetaMask = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) throw new Error('MetaMask no detectado');
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const currentAccount = accounts[0];
      setAccount(currentAccount);

      const agent = new HttpAgent({ 
        host: import.meta.env.VITE_DFX_NETWORK === 'ic' 
          ? 'https://ic0.app' 
          : 'http://localhost:4943'
      });

      if (import.meta.env.VITE_DFX_NETWORK !== 'ic') {
        await agent.fetchRootKey();
      }

      const actorInstance = Actor.createActor(idlFactory, {
        agent,
        canisterId: import.meta.env.VITE_TRAVELCOIN_CANISTER_ID,
      });

      setActor(actorInstance);

      // Registrar usuario si no existe
      const userExists = await actorInstance.obtenerUsuario(Principal.fromText(currentAccount));
      if (!userExists) {
        await actorInstance.registrarUsuario(null);
      }

      setIsAuthenticated(true);
      await fetchUserData();
      await fetchViajes();

    } catch (error) {
      console.error("Error conectando MetaMask:", error);
      resetState();
    } finally {
      setLoading(false);
    }
  };

  const reservarViaje = async (viajeId) => {
    if (!actor || !account) return;
    
    try {
      const result = await actor.reservarViaje(viajeId);
      if (result.ok) {
        await fetchUserData();
        await fetchViajes();
        return { success: true, message: result.ok };
      } else {
        return { success: false, message: result.err };
      }
    } catch (error) {
      console.error("Error reservando viaje:", error);
      return { success: false, message: "Error al procesar la reserva" };
    }
  };

  const resetState = () => {
    setAccount(null);
    setIsAuthenticated(false);
    setActor(null);
    setUserData(null);
    setViajes([]);
    setBalance(0);
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        resetState();
      } else if (accounts[0] !== account) {
        connectMetaMask();
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [account]);

  return (
    <MetaMaskContext.Provider 
      value={{ 
        account, 
        isAuthenticated, 
        actor, 
        userData,
        viajes,
        balance,
        connectMetaMask, 
        reservarViaje,
        fetchUserData,
        fetchViajes,
        loading 
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = () => useContext(MetaMaskContext);