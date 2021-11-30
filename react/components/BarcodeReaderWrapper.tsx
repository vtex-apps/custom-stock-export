/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {useState} from 'react'
import { useCssHandles } from 'vtex.css-handles'
import type {
  MessageDescriptor} from 'react-intl';
import {
  useIntl,
  defineMessages,
} from 'react-intl'
import { Button } from 'vtex.styleguide'

import BarcodeContainer from './barcode-scanner'

const CSS_HANDLES = ['barcodeReaderWrapper']

const BarcodeReaderWrapper: StorefrontFunctionComponent<any> = ({action, mode}) => {
  const [useBarcode, setUseBarcode]: any = useState<boolean>(false)

  const intl = useIntl()

  const messagesInternationalization = defineMessages({
    buttonOpenReader: { id: 'store/barcode-reader.buttonOpenReaderBarcode' },
  })

  const translateMessage = (message: MessageDescriptor) =>
  intl.formatMessage(message)


  const onclickBarcodeReader = () => {
    setUseBarcode(!useBarcode)
  }


  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.BarcodeReader} c-muted-1 db tc`}>
      <div className="mb4">
        <Button variation="primary" onClick={onclickBarcodeReader}>
        {`${translateMessage(messagesInternationalization.buttonOpenReader)}`}
        </Button>
      </div>
      {useBarcode && <BarcodeContainer setButtonUseBarcode={setUseBarcode} action={action} mode={mode}/>}
    </div>  
  )
}

export default BarcodeReaderWrapper