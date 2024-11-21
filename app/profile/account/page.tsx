'use client'

import React, { useEffect, useState } from 'react'
import { getAccountInfo } from "../actions"
import { AccountInfo } from "@/components/user/account-info"
import { AccountList } from "@/components/user/account-list"
import Loading from '@/components/create/loading'
import { useGlobalContext } from '@/app/globalContext'

export default function AccountPage() {
  const [loading, setLoading] = useState(true)
  const [accountInfo, setAccountInfo] = useState<any>()
  const [accountRecords, setAccountRecords] = useState<any>()
  const { userInfo } = useGlobalContext()

  useEffect(() => {
    (async() => {
      const { info, records } = await getAccountInfo(userInfo.id)
      setAccountInfo(info)
      setAccountRecords(records)
      setLoading(false)
    })()
  }, []);

  return (
    <>
    {loading ? (
      <div className="flex flex-row items-center justify-center min-h-screen">
        <Loading />
      </div>
    ) : (
      <div className="p-6 pt-24">
        <AccountInfo accountInfo={accountInfo} />
        <AccountList list={accountRecords} />
      </div>
    )}
    </>
  )
}