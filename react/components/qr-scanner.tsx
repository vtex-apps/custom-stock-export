/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import QrReader from 'react-qr-scanner'
import { useCssHandles } from 'vtex.css-handles'
import { Spinner,Alert } from 'vtex.styleguide'

import UseEanGoToPDP from './UseEan/go-to-pdp'
import UseEanAddToCart from './UseEan/add-to-cart'
// eslint-disable-next-line prettier/prettier
import type { QrReaderProps } from '../typings/global'
import formatQr from '../utils/formatQr'

import '../style/camStyle.global.css'
import '../style/Loading.global.css'
import '../style/Success.global.css'

const CSS_HANDLES = ['qrContainer']

export default function QrContainer({setButtonUseQr, separator,eanIndex,action,mode}: QrReaderProps) {
  const delay = 3000
  const [result, setResult] = useState(null)  
  const [ean, setEan] = useState<string>('')

  const [prevData, setPrevData] = useState<any>(null)
  const handles = useCssHandles(CSS_HANDLES)
  const [useQr, setUseQr]: any = useState<boolean>(true)
  const [successAlert, setSuccessAlert]: any = useState<boolean>(false)

  useEffect(() => {
    if (!useQr) {
      setEan('')
    }
  }, [useQr])

  const handleScan = (data: any) => {
    if (data && data.text!==prevData?.text){
      setPrevData(data)
      setResult(data.text)
    }
  }
  
  const handleError = (err: any) => {
    console.error(err)
  }

  useEffect(() => {
    if(!result) return

    setEan(formatQr(result,separator,eanIndex))
  }, [result])

  const previewStyle = {
    heigth: 500,
    width: 500,
    display: 'flex',
    justifyContent: "center"
  }

  return (
    <div>
      {successAlert && (
        <div className="success-container">
          <Alert type="success" autoClose={1000}>
            {`Test`}
          </Alert>
        </div>
      )}
      {useQr && (
        <div>
      <div className={`${handles.QrContainer} camStyle`}>
        <QrReader
          delay={delay}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
        />   
      </div>
      {action==='go-to-pdp' && ean && <UseEanGoToPDP setSuccessAlert={null} setButton={setButtonUseQr} setUse = {setUseQr} ean={ean} type={'qr'} mode={mode} />}
      {action==='add-to-cart' && ean && <UseEanAddToCart setSuccessAlert={setSuccessAlert} setButton={setButtonUseQr} setUse = {setUseQr} ean={ean} type={'qr'} mode={mode} />}
      </div>
      )}
      {!useQr && (
        <div className="loading-container">
          <Spinner />
        </div>
      )}
      </div> 
  )
}