import React,{useState, useEffect} from 'react';
import web3modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import Router,{ useRouter } from "next/router";

// INTERNAL IMPORT
import {VotingAddress, VotingAddressABI} from './constants';


// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');
// INFURA IS NOT FREE, SO NOW WE HAVE TO USE PINATA ----->





const fetchContract = (signerOrProvider) => 
 new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider); // fetching contract 


export const VotingContext = React.createContext();

export const VotingProvider = ({children}) => {
    const votingTitle = "My first smart contract App";
    const router = useRouter();
    const [currentAccount, setCurrentAccount] = useState('');
    const [candidateLength, setCandidateLength] = useState('');
    const pushCandidate = [];         // data of a candidate stored in this array
    const candidateIndex = [];

    const [candidateArray, setCandidateArray] = useState(pushCandidate);  // data of all candidate's in an array


    // -----X ------- X --- END OF CANDIDATE DATA ----X--------X-------------

    const [error, setError] = useState('');
    const highestVote = [];



    // -----X ------- X --- VOTER SECTION ----X--------X-------------
    const pushVoter = [];
    const [voterArray, setVoterArray] = useState(pushVoter);
    const [voterLength, setVoterLength] = useState('');
    const [voterAddress, setVoterAddress] = useState([]);


    // ------x--- CONNECTING METAMASK ---- x----
    const checkIfWalletIsConnected = async()=>{
      if(!window.ethereum) return setError("Please Install MetaMask");

      const account = await window.ethereum.request({method: "eth_accounts"});

      if(account.length()){
        setCurrentAccount(account[0]);
      }else{
        setError("Please Install MetaMask & Connect, Reload");
      }
    };

    // --x-- CONNECT WALLET
    const connectWallet = async()=>{
      if(!window.ethereum) return setError("Please Install MetaMask");

      const account = await window.ethereum.request({method: "eth_requestAccounts"});

      setCurrentAccount(account[0]);
    };

    // ----x--- UPLOAD TO IPFS VOTER IMAGE--

    const uploadToIPFS = async (file) => {
      if (file) {
        try {
          const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
          const formData = new FormData();
          formData.append("file", file);
          const response = await axios.post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              "pinata_api_key": "fc4a59a1775bc816c944",
              "pinata_secret_api_key": "65d70533443f78c0f23276ff1ada399da9ba95b5e1576e43111b2e38ba508cf8",
            },
          });
          const hash = response.data.IpfsHash;
          const imgHash = `https://gateway.pinata.cloud/ipfs/${hash}`;
          return imgHash;
        } catch (error) {
          console.error("Error uploading file to IPFS using Pinata: ", error);
        }
      }
    };

    ///// ----- CREATE VOTER 
    const createVoter = async(formInput, fileUrl, router)=>{
      try {
        const {name, address, position} = formInput;
        if(!name || !address || !position) 
          return setError("Input Data is missing");

        // CONNECTING SMART CONTRACT
        const web3Modal = new web3modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);
        console.log(contract);

      } catch (error) {
        setError("Error in creating voter");
      }
    }


    return <VotingContext.Provider value={{votingTitle, checkIfWalletIsConnected, connectWallet,uploadToIPFS,createVoter,}}>{children}</VotingContext.Provider>;
};


const Voter = () => {
  return (
    <div>Voter</div>
  )
}
