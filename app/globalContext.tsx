'use client'
import {
  useState,
  createContext,
  useContext,
  useMemo,
  useEffect,
  ReactNode
} from 'react'

const GlobalContext = createContext<any>({})

export const useGlobalContext = () => useContext<any>(GlobalContext)

export const GlobalContextProvider = function ({
  children
}: {
  children: ReactNode
}) {
  const [createId, setCreateId] = useState('')
  const [queryData, setQueryData] = useState<AudioReq|null>(null)
  const [generateStatus, setGenerateStatus] = useState('')

  return (
    <GlobalContext.Provider
      value={{
        createId,
        setCreateId,
        queryData,
        setQueryData,
        generateStatus,
        setGenerateStatus
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
