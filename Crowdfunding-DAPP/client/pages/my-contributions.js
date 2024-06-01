import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import authWrapper from '../helper/authWrapper';
import { getMyContributionList } from '../redux/interactions';
import Link from 'next/link';

const MyContributions = () => {
  const [tab, setTab] = useState(0);

  const crowdFundingContract = useSelector(
    (state) => state.fundingReducer.contract
  );
  const account = useSelector((state) => state.web3Reducer.account);

  const projectsList = useSelector((state) => state.projectReducer.projects);

  const myProjectsList = projectsList?.filter(
    (data) => data?.creator === account
  );

  console.log(myProjectsList);

  const [contributions, setContributions] = useState(null);

  useEffect(() => {
    (async () => {
      if (crowdFundingContract) {
        var res = await getMyContributionList(crowdFundingContract, account);
        console.log(res);
        setContributions(res);
      }
    })();
  }, [crowdFundingContract]);

  return (
    <div className='flex flex-col px-2 lg:px-12 gap-3'>
      <div className='flex justify-center items-center mt-10'>
        <div
          className={`${tab === 0 ? 'bg-[#F7C984]' : ''
            } flex flex-col justify-center items-center
          h-20 border shadow-md w-full cursor-pointer`}
          onClick={() => setTab(0)}
        >
          <span
            className='text-lg font-bold text-green-900
            leading-5'
          >
            {contributions?.length ?? 0}
          </span>
          <span>Contributes</span>
        </div>
        <div
          className={`${tab === 1 ? 'bg-[#F7C984]' : ''
            } flex flex-col justify-center items-center
          h-20 border shadow-md w-full cursor-pointer`}
          onClick={() => setTab(1)}
        >
          <span
            className='text-lg font-bold text-green-900
            leading-5'
          >
            {myProjectsList?.length ?? 0}
          </span>
          <span>My Projects</span>
        </div>
        <div
          className='flex flex-col justify-center items-center
          h-20 border shadow-md w-full'
        >
          <span
            className='text-lg font-bold text-green-900
            leading-5'
          >
            {contributions?.reduce((a, b) => a + b.amount, 0)} ETH
          </span>
          <span>Total Donated</span>
        </div>
      </div>
      {tab === 0 && <ContributesTab contributions={contributions} />}
      {tab === 1 && <MyProjectTab myProjectsList={myProjectsList} />}
    </div>
  );
};

export default authWrapper(MyContributions);

const ContributesTab = ({ contributions }) => {
  const projectsList = useSelector((state) => state.projectReducer.projects);

  const filteredProject = (currentAddress) =>
    projectsList?.filter((data) => data.address === currentAddress);

  return (
    <div className='flex flex-wrap lg:flex-row '>
      {contributions ? (
        contributions.length > 0 ? (
          contributions.map((data, i) => (
            <Link key={i} href={`/project-details/${data.projectAddress}`}>
              <div className='inner-card my-2 flex flex-row w-full lg:w-1/4 cursor-pointer'>
                <div className='lg:w-1/5 flex justify-center items-center'>
                  <div className='p-6 w-8 h-8 mx-auto my-auto rounded-md bg-slate-300 '></div>
                </div>
                <div className='lg:w-4/5'>
                  <p className='text-md font-bold text-gray-800 w-40 truncate'>
                    {filteredProject(data.projectAddress)?.[0]?.title}
                  </p>
                  <p className='text-md font-bold text-gray-800 w-40 truncate'>
                    {data.projectAddress}
                  </p>

                  <p className='text-md font-bold text-gray-500'>
                    {data.amount} ETH
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className='text-center'>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            You didn't contributed in any project yet !
          </p>
        )
      ) : (
        <div className='w-full'>
          {' '}
          <Loader />
        </div>
      )}
    </div>
  );
};

const MyProjectTab = ({ myProjectsList }) => {
  return (
    <div className='flex flex-wrap lg:flex-row '>
      {myProjectsList ? (
        myProjectsList.length > 0 ? (
          myProjectsList.map((data, i) => (
            <Link key={i} href={`/project-details/${data.address}`}>
              <div className='inner-card my-2 flex flex-row w-full lg:w-1/4 cursor-pointer'>
                <div className='lg:w-1/5 flex justify-center items-center'>
                  <div className='p-6 w-8 h-8 mx-auto my-auto rounded-md bg-slate-300 '></div>
                </div>
                <div className='lg:w-4/5'>
                  <p className='text-md font-bold text-gray-800 w-40 truncate'>
                    {data.title}
                  </p>
                  <p className='text-md font-bold text-gray-800 w-40 truncate'>
                    {data.deadline}
                  </p>
                  <p className='text-md font-bold text-gray-800 w-40 truncate'>
                    {data.state}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className='text-center'>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            You haven't created any project!
          </p>
        )
      ) : (
        <div className='w-full'>
          {' '}
          <Loader />
        </div>
      )}
    </div>
  );
};
