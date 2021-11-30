import React, { useEffect } from 'react'
import type { Result } from '@zxing/library';
import { BrowserBarcodeReader } from '@zxing/library'

const BarCodeScanner = ({onUpdate}: {
  onUpdate(err: unknown, result: Result | undefined): void
}): JSX.Element => {
  const codeReader = new BrowserBarcodeReader()  

  useEffect(() => {
    codeReader.listVideoInputDevices().then(devices => {
      console.info('devices', devices)
      let deviceSuggested: MediaDeviceInfo 
      
      if (devices.length === 1){
        deviceSuggested = devices[0]
      } else if (devices.length > 1) {
        deviceSuggested = devices.filter(device => device.label.includes('back') && device.label.includes('0'))[0] ? devices.filter(device => device.label.includes('back') && device.label.includes('0'))[0] : devices.filter(device => device.label.includes('back'))[0] 
      } else {
        deviceSuggested =  {deviceId: '', label: '', groupId: '', kind: 'videoinput', toJSON: () => {}}
      } 

      const {deviceId} = deviceSuggested

      codeReader.decodeOnceFromVideoDevice(deviceId, 'video')
      .then(result => {
        onUpdate(null, result)
      })
      .catch(e => {
        onUpdate(e, undefined)
      })
    })

    return (): void => {
      codeReader.reset()
    }
  }, [codeReader])

  return (
    <div id="scanner-container">
      <video id="video" className="dbrScanner-video" playsInline />
    </div>
  )
}

export default BarCodeScanner
