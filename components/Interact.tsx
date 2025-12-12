'use client'
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { fundMeAbi, fundMeAddress } from '../lib/abi/FundMe'

export default function Interact() {
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState('0.01')
  const [amountError, setAmountError] = useState<string>('')
  const [modalTitle, setModalTitle] = useState<string>('')
  const [modalMessage, setModalMessage] = useState<ReactNode>('')
  const modalRef = useRef<HTMLDivElement | null>(null)
  const { data: hash, isPending, error, writeContract } = useWriteContract()
  const { data: balance } = useReadContract({
    abi: fundMeAbi,
    address: fundMeAddress,
    functionName: 'getOwner'
  })
  const chainId = useChainId()
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isConfirmError,
    error: confirmError
  } = useWaitForTransactionReceipt({ hash })

  const openModal = (title: string, message: ReactNode) => {
    setModalTitle(title)
    setModalMessage(message)
    const m = (window as any).bootstrap?.Modal
    if (m && modalRef.current) {
      const instance = m.getOrCreateInstance(modalRef.current)
      instance.show()
    }
  }

  const validateAmount = (value: string) => {
    if (!value || isNaN(Number(value))) return 'Enter a valid number'
    if (Number(value) <= 0) return 'Amount must be greater than 0'
    return ''
  }

  useEffect(() => {
    if (error) {
      openModal('Transaction Error', error.message || 'Unknown error')
    }
  }, [error])

  const txUrl = (id: number | undefined, h?: `0x${string}`) => {
    if (!id || !h) return ''
    if (id === 1) return `https://etherscan.io/tx/${h}`
    if (id === 11155111) return `https://sepolia.etherscan.io/tx/${h}`
    return ''
  }

  useEffect(() => {
    if (isConfirmError && confirmError) {
      openModal('Transaction Failed', confirmError.message || 'Unknown error')
    } else if (isConfirmed && receipt && hash) {
      const url = txUrl(chainId, hash)
      openModal(
        'Transaction Confirmed',
        <div>
          <div className="mb-2">Transaction confirmed</div>
          <div className="mb-2 d-flex align-items-center">
            <span className="me-2">Hash:</span>
            <code className="text-break">{hash}</code>
            <button
              className="btn btn-sm btn-outline-secondary ms-2"
              onClick={() => navigator.clipboard?.writeText(hash)}
            >
              Copy
            </button>
          </div>
          <div className="mb-2">Block: {String((receipt as any).blockNumber)}</div>
          {url && (
            <a href={url} target="_blank" rel="noreferrer">
              View on Etherscan
            </a>
          )}
        </div>
      )
    }
  }, [isConfirmed, isConfirmError, confirmError, receipt, hash, chainId])

  const onFund = () => {
    if (!isConnected) {
      openModal('Wallet Not Connected', 'Please connect your wallet to continue.')
      return
    }
    if (!fundMeAddress) {
      openModal('Contract Not Configured', 'Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local and restart the dev server.')
      return
    }
    const v = validateAmount(amount)
    setAmountError(v)
    if (v) {
      openModal('Invalid Amount', v)
      return
    }
    writeContract({
      abi: fundMeAbi,
      address: fundMeAddress,
      functionName: 'fund',
      value: parseEther(amount)
    })
  }

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Interact</h5>
              <div className="mb-3">
                <label className="form-label">Amount (ETH)</label>
                <input
                  className={`form-control ${amountError ? 'is-invalid' : ''}`}
                  value={amount}
                  onChange={e => {
                    setAmount(e.target.value)
                    setAmountError(validateAmount(e.target.value))
                  }}
                />
                {amountError && <div className="invalid-feedback">{amountError}</div>}
              </div>
              <button className="btn btn-primary" onClick={onFund} disabled={!isConnected || isPending || !!amountError}>
                {isPending || isConfirming ? 'Sending...' : 'Fund'}
              </button>
              {hash && <div className="mt-3">Tx: {hash}</div>}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Status</h6>
              <div>Address: {address || '-'}</div>
              <div>Owner: {balance ? balance : '-'}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" tabIndex={-1} ref={modalRef}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalTitle}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', wordBreak: 'break-word' }}>
              {typeof modalMessage === 'string' ? <p className="text-break">{modalMessage}</p> : modalMessage}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
