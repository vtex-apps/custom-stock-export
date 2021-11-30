/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import { Spinner, ModalDialog, Modal } from 'vtex.styleguide'
import { useLazyQuery } from 'react-apollo'
// eslint-disable-next-line prettier/prettier
import type {
  MessageDescriptor} from 'react-intl';
import { useIntl, defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import type { ModalType, UseEanProps, SkuDataType } from '../../typings/global'
import getDataSku from '../../graphql/getSku.gql'
import getProduct from '../../graphql/getProduct.gql'
import findSkuOfMultipleEan from '../../utils/findSkuOfMultipleEan'

import '../../style/Loading.global.css'

const CSS_HANDLES = [
  'modalReaderMessagesError',
  'modalReaderMessagesErrorText',
  'modalReaderMessagesSucces',
  'modalReaderMessagesSuccesText',
  'listErrorMutipleProductText',
]

export default function UseEanGoToPDP({
  setButton,
  setUse,
  ean,
  type,
  mode,
}: UseEanProps) {
  const [skuData, setSkuData] = useState<SkuDataType>()
  const [isRedirect, setIsRedirect] = useState<boolean>(false)

  const [modalResult, setModalResult] = useState(false)
  const [messageModal, setMessageModal] = useState<string>('')
  const [modalType, setModalType] = useState<ModalType>()

  const [
    getSkuQuery,
    { loading: loadingGetSku, error: errorGetSku, data: dataGetSku },
  ] = useLazyQuery(getDataSku)

  const [
    getProductQuery,
    {
      loading: loadingGetProduct,
      error: errorGetProduct,
      data: dataGetProduct,
    },
  ] = useLazyQuery(getProduct)

  const handles = useCssHandles(CSS_HANDLES)

  const intl = useIntl()

  let messagesInternationalization: any

  if (type === 'qr') {
    messagesInternationalization = defineMessages({
      messageModalError: { id: 'store/qr-reader.messageModalError' },
      messageModalSucces: { id: 'store/reader.messageModalSucces' },
      retry: { id: 'store/reader.retry' },
      cancel: { id: 'store/reader.cancel' },
    })
  } else if (type === 'barcode') {
    messagesInternationalization = defineMessages({
      messageModalError: { id: 'store/barcode-reader.messageModalError' },
      messageModalSucces: { id: 'store/reader.messageModalSucces' },
      retry: { id: 'store/reader.retry' },
      cancel: { id: 'store/reader.cancel' },
    })
  }

  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  const openModalResult = () => {
    setModalResult(true)
  }

  const closeModalResult = () => {
    setModalResult(false)
  }

  useEffect(() => {
    const queryParam = ean

    getSkuQuery({ variables: { ean: queryParam } })
  }, [])

  useEffect(() => {
    if (!loadingGetSku && !errorGetSku && !dataGetSku) return
    if (loadingGetSku) {
      setMessageModal(``)
      openModalResult()
    }

    if (errorGetSku) {
      if (mode === 'singleEan') {
        setMessageModal(
          `${translateMessage(messagesInternationalization.messageModalError)}`
        )
        setModalType('error')
      } else if (mode === 'multipleEan') {
        const queryParam = ean

        getProductQuery({ variables: { ean: queryParam } })
      }
    }

    if (dataGetSku) {
      const sku: SkuDataType = dataGetSku.getSku.data
      const productName: string = sku.NameComplete

      setMessageModal(
        `${translateMessage(
          messagesInternationalization.messageModalSucces
        )} ${productName}`
      )
      setModalType('success')
      setSkuData(sku)
    } else {
      null
    }
  }, [loadingGetSku, errorGetSku, dataGetSku])

  useEffect(() => {
    if (!loadingGetProduct && !errorGetProduct && !dataGetProduct) return
    if (loadingGetProduct) {
      setMessageModal(``)
      openModalResult()
    }

    if (errorGetProduct) {
      setMessageModal(
        `${translateMessage(messagesInternationalization.messageModalError)}`
      )
      setModalType('error')
    }

    if (dataGetProduct) {
      const { data } = dataGetProduct.getProductBySpecificationFilter

      if (data.length > 0) {
        const [{ MultipleEan, linkText, items }] = data

        if (MultipleEan) {
          const skuFinded = findSkuOfMultipleEan(MultipleEan, ean)

          const { nameComplete } = items.find(
            (item) => item.itemId === skuFinded
          )

          const skuTemp: SkuDataType = {
            Id: skuFinded,
            NameComplete: nameComplete,
            DetailUrl: `${linkText}/p`,
          }

          setMessageModal(
            `${translateMessage(
              messagesInternationalization.messageModalSucces
            )} ${nameComplete}`
          )
          setModalType('success')
          setSkuData(skuTemp)
        } else {
          setMessageModal(
            `${translateMessage(
              messagesInternationalization.messageModalError
            )}`
          )
          setModalType('error')
        }
      } else {
        setMessageModal(
          `${translateMessage(messagesInternationalization.messageModalError)}`
        )
        setModalType('error')
      }
    }
  }, [loadingGetProduct, errorGetProduct, dataGetProduct])

  useEffect(() => {
    if (!skuData) return

    // eslint-disable-next-line vtex/prefer-early-return
    if (!isRedirect) {
      const skuLink = `${skuData.DetailUrl}?skuId=${skuData.Id}`

      setIsRedirect(true)
      window.location.replace(skuLink)
    }
  }, [skuData])

  return (
    <div>
      {modalType === 'error' && (
        <ModalDialog
          centered
          isOpen={modalResult}
          confirmation={{
            label: translateMessage(messagesInternationalization.retry),
            onClick: () => {
              closeModalResult()
              setUse(false)
              setTimeout(() => {
                setUse(true)
              }, 1000)
            },
          }}
          cancelation={{
            onClick: () => {
              closeModalResult()
              setButton(false)
            },
            label: translateMessage(messagesInternationalization.cancel),
          }}
          onClose={() => {
            closeModalResult()
          }}
        >
          <div className={`${handles.modalReaderMessagesError}`}>
            <span
              className={`${handles.modalReaderMessagesErrorText} f3 f3-ns fw3 gray c-action-primary fw5`}
            >
              {messageModal}
            </span>
            {(isRedirect || messageModal === '') && (
              <div className="loading-container">
                <Spinner />
              </div>
            )}
          </div>
        </ModalDialog>
      )}
      {modalType === 'success' && (
        <Modal
          centered
          isOpen={modalResult}
          onClose={() => {
            closeModalResult()
          }}
        >
          <div className={`${handles.modalReaderMessagesSucces}`}>
            <span
              className={`${handles.modalReaderMessagesSuccesText} f3 f3-ns fw3 gray c-action-primary fw5`}
            >
              {messageModal}
            </span>
            {(isRedirect || messageModal === '') && (
              <div className="loading-container">
                <Spinner />
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
