import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux'
import { contribute, createWithdrawRequest } from '../redux/interactions';
import { etherToWei } from '../helper/helper';
import { toastSuccess, toastError } from '../helper/toastMessage'

const colorMaker = (state) => {
  if (state === 'Fundraising') {
    return 'bg-cyan-500'
  } else if (state === 'Expired') {
    return 'bg-red-500'
  } else {
    return 'bg-emerald-500'
  }
}

const FundRiserCard = ({ props, pushWithdrawRequests }) => {
  const dateFormat = new Date();
  const day = dateFormat.getDate();
  const month = dateFormat.getMonth() + 1;
  const year = dateFormat.getFullYear();
  const today = new Date(`${month}/${day}/${year}`);
 

  const [isDeadline, setIsDeadline] = useState(false);

  useEffect(() => {
    const splittedDate = props.deadline.split("/");
    

    const day = parseInt(splittedDate[0]);
    const month = parseInt(splittedDate[1]);
    const year = parseInt(splittedDate[2]);

    const deadline = new Date(`${month}/${day}/${year}`);
    if (today.getTime() <= deadline.getTime()) setIsDeadline(true);
    
  }, [])
  const currentDate = `${dateFormat.getDate()}/${dateFormat.getMonth()}/${dateFormat.getFullYear()}`;
  console.log(currentDate == props.deadline)

  const [btnLoader, setBtnLoader] = useState(false)
  const [amount, setAmount] = useState(0)
  const dispatch = useDispatch();
  const crowdFundingContract = useSelector(state => state.fundingReducer.contract)
  const account = useSelector(state => state.web3Reducer.account)
  const web3 = useSelector(state => state.web3Reducer.connection)

  const contributeAmount = (projectId, minContribution) => {

    if (amount < minContribution) {
      toastError(`Minimum contribution amount is ${minContribution}`);
      return;
    }

    setBtnLoader(projectId)
    const contributionAmount = etherToWei(amount);

    const data = {
      contractAddress: projectId,
      amount: contributionAmount,
      account: account
    }
    const onSuccess = () => {
      setBtnLoader(false)
      setAmount(0)
      toastSuccess(`Successfully contributed ${amount} ETH`)
    }
    const onError = (message) => {
      setBtnLoader(false)
      toastError(message)
    }
    contribute(crowdFundingContract, data, dispatch, onSuccess, onError)
  }

  const requestForWithdraw = (projectId) => {
    console.log(amount)
    try {

      setBtnLoader(projectId)
      const contributionAmount = etherToWei(amount);

      const data = {
        description: `${amount} ETH requested for withdraw`,
        amount: contributionAmount,
        recipient: account,
        account: account
      }
      const onSuccess = (data) => {
        setBtnLoader(false)
        setAmount(0)
        if (pushWithdrawRequests) {
          pushWithdrawRequests(data)
        }
        toastSuccess(`Successfully requested for withdraw ${amount} ETH`)
      }
      const onError = (message) => {
        setBtnLoader(false)
        toastError(message)
      }
      createWithdrawRequest(web3, projectId, data, onSuccess, onError)
    } catch (error) {
      toastError("Terjadi Kesalahan")
      setBtnLoader(false)
    }
  }

  return (
    <div className="card relative overflow-hidden my-4">
      <div className={`ribbon ${isDeadline ? colorMaker(props.state) : 'bg-emerald-500'}`}>{isDeadline ? props.state : "Successfull"}</div>
      <Link href={`/project-details/${props.address}`} >
        <h1 className="font-sans text-xl text-gray font-semibold hover:text-sky-500 hover:cursor-pointer">{props.title}</h1>
      </Link>
      <p className="font-sans text-sm text-stone-800 tracking-tight">{props.description}</p>
      <div className="flex flex-col lg:flex-row">
        <div className="inner-card my-6 w-full lg:w-2/5">
          <p className="text-md font-bold font-sans text-gray">Kontribusi yang ditargetkan</p>
          <p className="text-sm font-bold font-sans text-gray-600 ">{props.goalAmount} ETH </p>
          <p className="text-md font-bold font-sans text-gray">Deadline</p>
          <p className="text-sm font-bold font-sans text-gray-600 ">{props.deadline}</p>
        </div>
        <div className="inner-card my-6 w-full lg:w-3/5">
          {
            isDeadline ? (
              props.state != "Successful" ? (
                <>
                  <label className="text-sm text-gray-700 font-semibold">Jumlah kontribusi :</label>
                  <div className="flex flex-row">
                    <input type="number" placeholder="Type here" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={btnLoader === props.address} className="input rounded-l-md" />

                    <button className="button"
                      onClick={() => contributeAmount(props.address, props.minContribution)}
                      disabled={btnLoader === props.address}
                    >
                      {btnLoader === props.address ? "Loading..." : "Contribute"}
                    </button>

                  </div>
                  <p className="text-sm text-red-600"> <span className="font-bold">NOTE : </span> Jumlah minimal kontribusi {props.minContribution} ETH </p>
                </>
              ) : (
                <>
                  <p className="text-md font-bold font-sans text-gray">Contract balance</p>
                  <p className="text-sm font-bold font-sans text-gray-600 ">{props.contractBalance} ETH </p>

                  {
                    props.creator === account ?
                      <>
                        <label className="text-sm text-gray-700 font-semibold">Withdraw request :</label>
                        <div className="flex flex-row">
                          <input type="number" max={props.currentAmount} min={0} placeholder="Type here" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={btnLoader === props.address} className="input rounded-l-md" />
                          <button className="button" onClick={() => requestForWithdraw(props.address)}>
                            {btnLoader === props.address ? "Loading..." : "Withdraw"}
                          </button>
                        </div>
                      </>
                      : ""
                  }

                </>
              )
            ) : (
              <>
                <p className="text-md font-bold font-sans text-gray">Contract balance</p>
                <p className="text-sm font-bold font-sans text-gray-600 ">{props.contractBalance} ETH </p>

                {
                  props.creator === account ?
                    <>
                      <label className="text-sm text-gray-700 font-semibold">Withdraw request :</label>
                      <div className="flex flex-row">
                        <input type="number" max={props.currentAmount} min={0} placeholder="Type here" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={btnLoader === props.address} className="input rounded-l-md" />
                        <button className="button" onClick={() => requestForWithdraw(props.address)}>
                          {btnLoader === props.address ? "Loading..." : "Withdraw"}
                        </button>
                      </div>
                    </>
                    : ""
                }

              </>
            )
            
          }
        </div>
      </div>

      {
        props.state !== "Successful" && isDeadline ?
          <div className="w-full bg-gray-200 rounded-full">
            <div className="progress" style={{ width: `${props.progress}%` }}> {props.progress}% </div>
          </div>
          : ""
      }

    </div>
  )
}

export default FundRiserCard