

import { useEffect } from "react"
import useSWR from "swr"

const adminAddresses = {
  "0xa075585816515fa3c6145fdd41bb53b18628df720548c9dd22709df630cacdc6": true,
  "0x65041ef3e229c39a2584bfa02f8e9523da6ad2b6a7909a6d785d4cf070879650": true
}

export const handler = (web3, provider) => () => {

  const { data, mutate, ...rest } = useSWR(() =>
    web3 ? "web3/accounts" : null,
    async () => {
      const accounts = await web3.eth.getAccounts()
      const account = accounts[0]

      if (!account) {
        throw new Error("Cannot retreive an account. Please refresh the browser.")
      }

      return account
    }
  )

  useEffect(() => {
    const mutator = accounts => mutate(accounts[0] ?? null)
    provider?.on("accountsChanged", mutator)

    return () => {
      provider?.removeListener("accountsChanged", mutator)
    }
  }, [provider])

  return {
    data,
    isAdmin: (
      data &&
      adminAddresses[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...rest
  }
}