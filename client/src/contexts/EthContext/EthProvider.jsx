import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async (artifact) => {
    if (!window.ethereum) {
      console.error("MetaMask not detected. Please install MetaMask.");
      return;
    }

    if (artifact) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" }); // ✅ Request access
        const accounts = await web3.eth.getAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;
        
        let address, contract;
        if (artifact.networks[networkID]) {
          address = artifact.networks[networkID].address;
          contract = new web3.eth.Contract(abi, address);
        } else {
          console.warn(`Contract not deployed on network ID ${networkID}`);
        }

        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contract }
        });
      } catch (err) {
        console.error("Error initializing Web3:", err);
      }
    }
  }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require("../../contracts/SimpleStorage.json");
        init(artifact);
      } catch (err) {
        console.error("Error loading contract:", err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    if (window.ethereum) {
      events.forEach(e => window.ethereum.on(e, handleChange));
    }
    
    return () => {
      if (window.ethereum) {
        events.forEach(e => window.ethereum.removeListener(e, handleChange));
      }
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{ state, dispatch }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
