/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client, contract } from "./client";
import { useSendTransaction } from "thirdweb/react";
import { useEffect, useState } from "react";
import { prepareContractCall } from "thirdweb";

export default function Home() {
  const account = useActiveAccount();
  const { data: signs, refetch } = useReadContract({
    contract,
    method: "function getSigns() view returns ((string nickname, address owner)[])",
    params: []
  });
  const { mutate: sendTransaction, isPending, isSuccess, isError } = useSendTransaction();
  const [nickname, setNickname] = useState('');

  const signContract = async () => {
    if (nickname && account?.address) {
      const transaction = await prepareContractCall({
        contract,
        method: "function addSign(string _nickname, address _owner)",
        params: [nickname, account?.address],
      });

      sendTransaction(transaction);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      alert('Sign Collected Successfully!');
      refetch();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      alert('Try again!');
    }
  }, [isError]);

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <div className="flex justify-center mb-20">
          <div className="max-w-xl mx-auto mt-10">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-center">
                <ConnectButton
                  client={client}
                />
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-black mb-4 text-center">Signs</h2>
              <form action="#" method="POST" className="space-y-4">
                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">Nickname</label>
                  <input type="text" id="nickname" name="nickname" onChange={e => setNickname(e.target.value)} required
                    className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md
                      shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                  <button type="button"
                    onClick={signContract}
                    className="w-full
                      py-2 px-4 bg-blue-600
                    hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    { isPending ? "Signing..." : "Sign"}
                  </button>
                </div>
              </form>
            </div>

            <div className="max-w-lg mx-auto mt-10">
              {signs?.length ? (
                <ul className="grid grid-cols-1 gap-4">
                    {signs.map((sign, index) => (
                      <li
                        key={index}
                        className="bg-blue-100 p-4 text-black rounded-lg">
                          {`${sign.nickname} - ${sign.owner}`}
                      </li>
                    ))}
                </ul>
              ) : (
              <p>No signs</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
