import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { connectWithWallet } from '../helper/helper';
import { loadAccount } from '../redux/interactions';

export default function Home() {

  const router = useRouter();
  const dispatch = useDispatch();
  const web3 = useSelector(state => state.web3Reducer.connection)

  const connect = async () => {
    const onSuccess = async () => {
      await loadAccount(web3, dispatch)
      router.push('/dashboard')
    }
    connectWithWallet(onSuccess)
  }

  useEffect(() => {
    (async () => {
      if (web3) {
        const account = await loadAccount(web3, dispatch)
        if (account.length > 0) {
          router.push('/dashboard')
        }
      }
    })()
  }, [web3])

  return (
    <div className="flex flex-col items-center justify-center my-40">
      {/* <img
        src="/Crowdfunding-DAPP/client/logometamask.png"  
        alt="MetaMask Logo"
        className="w-16 h-16 mb-4"
      /> */}
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Welcome to Crowdfunding Platform</h1>
      <p className="text-lg mb-8 text-gray-600 text-center">
        Connect your MetaMask wallet to get started. If you don't have MetaMask installed,
        <a
          href="https://metamask.io/download.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          install the MetaMask extension
        </a>
        first.
      </p>
      <button
        className="p-4 text-lg font-bold text-white rounded-md w-56 bg-[#8D8DAA] hover:bg-[#b1b1d6] focus:outline-none focus:ring focus:border-blue-300"
        onClick={() => connect()}
      >
        Connect to MetaMask
      </button>
      {/* {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>} */}
    </div>
  )
}



// import React, { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { useDispatch, useSelector } from 'react-redux';
// import { connectWithWallet } from '../helper/helper';
// import { loadAccount } from '../redux/interactions';

// export default function Home() {

//   const router = useRouter();
//   const dispatch = useDispatch();
//   const web3 = useSelector(state => state.web3Reducer.connection)

//   const connect = () =>{
//     const onSuccess = () =>{
//       loadAccount(web3,dispatch)
//       router.push('/dashboard')
//     }
//     connectWithWallet(onSuccess)
//   }

//   useEffect(() => {
//      (async()=>{
//       if(web3){
//         const account = await loadAccount(web3,dispatch)
//         if(account.length > 0){
//           router.push('/dashboard')
//         }
//       }
//      })()
//   }, [web3])
  

//   return (
//     <div className="flex flex-col items-center justify-center my-40">
//     <button className="p-4 my-10 text-lg font-bold text-white rounded-md w-56 bg-[#8D8DAA] drop-shadow-md hover:bg-[#b1b1d6] hover:drop-shadow-xl" onClick={()=>connect()}>Connect to MetaMask</button>
//     {/* {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>} */}

//   </div>
//   )
// }
