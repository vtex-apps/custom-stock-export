/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import { Spinner, ModalDialog } from 'vtex.styleguide'
import { useLazyQuery, useMutation } from 'react-apollo'
// eslint-disable-next-line prettier/prettier
import type {
  MessageDescriptor} from 'react-intl';
import { useIntl, defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { usePixel } from 'vtex.pixel-manager'
import { addToCart as ADD_TO_CART } from 'vtex.checkout-resources/Mutations'
import type { OrderForm as OrderFormType } from 'vtex.checkout-graphql'
import { OrderForm } from 'vtex.order-manager'

import type {
  ModalType,
  UseEanProps,
  SkuDataType,
  OrderFormContext,
  ListMultipleProduct,
} from '../../typings/global'
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

export default function UseEanAddToCart({
  setSuccessAlert,
  setButton,
  setUse,
  ean,
  type,
  mode,
}: UseEanProps) {
  const [skuData, setSkuData] = useState<SkuDataType>()

  const [modalResult, setModalResult] = useState(false)
  const [messageModal, setMessageModal] = useState<string>('')
  const [modalType, setModalType] = useState<ModalType>()
  const [listErrorMultipleProduct, setListErrorMultipleProduct] = useState<
    ListMultipleProduct[]
  >([])

  const [
    messageErrorMultipleProductModal,
    setMessageErrorMultipleProductModal,
  ] = useState<string>('')

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
  const {
    orderForm: { items: itemsOrderform },
  } = OrderForm.useOrderForm()

  const intl = useIntl()

  let messagesInternationalization: any

  if (type === 'qr') {
    messagesInternationalization = defineMessages({
      messageModalError: { id: 'store/qr-reader.messageModalError' },
      theProduct: { id: 'store/reader.theProduct' },
      addToCartSucces: { id: 'store/reader.addToCartSucces' },
      retry: { id: 'store/reader.retry' },
      cancel: { id: 'store/reader.cancel' },
      theSku: { id: 'store/reader.theSku' },
      doesNotExistInTheProduct: { id: 'store/reader.doesNotExistInTheProduct' },
      scannedEanMatches: { id: 'store/reader.scannedEanMatches' },
      differentProducts: { id: 'store/reader.differentProducts' },
      reviewCatalog: { id: 'store/reader.reviewCatalog' },
    })
  } else if (type === 'barcode') {
    messagesInternationalization = defineMessages({
      messageModalError: { id: 'store/barcode-reader.messageModalError' },
      theProduct: { id: 'store/reader.theProduct' },
      addToCartSucces: { id: 'store/reader.addToCartSucces' },
      retry: { id: 'store/reader.retry' },
      cancel: { id: 'store/reader.cancel' },
      theSku: { id: 'store/reader.theSku' },
      doesNotExistInTheProduct: { id: 'store/reader.doesNotExistInTheProduct' },
      scannedEanMatches: { id: 'store/reader.scannedEanMatches' },
      differentProducts: { id: 'store/reader.differentProducts' },
      reviewCatalog: { id: 'store/reader.reviewCatalog' },
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

  const { push } = usePixel()
  const { setOrderForm }: OrderFormContext = OrderForm.useOrderForm()

  const [addToCart, { error: mutationError }] = useMutation<
    { addToCart: OrderFormType },
    { items: [] }
  >(ADD_TO_CART)

  const callAddToCart = async (items: any) => {
    const mutationResult = await addToCart({
      variables: {
        items: items.map((item: any) => {
          return {
            ...item,
          }
        }),
      },
    })

    if (mutationError) {
      console.error(mutationError)

      return
    }

    // Update OrderForm from the context
    mutationResult.data && setOrderForm(mutationResult.data.addToCart)
    const adjustSkuItemForPixelEvent = (item: any) => {
      return {
        skuId: item.id,
        quantity: item.quantity,
      }
    }

    // Send event to pixel-manager
    const pixelEventItems = items.map(adjustSkuItemForPixelEvent)

    push({
      event: 'addToCart',
      items: pixelEventItems,
    })
  }

  useEffect(() => {
    const queryParam = ean

    getSkuQuery({ variables: { ean: queryParam } })
  }, [])

  useEffect(() => {
    if (!loadingGetSku && !errorGetSku && !dataGetSku) return
    if (loadingGetSku) {
      setMessageModal(``)
      setListErrorMultipleProduct([])
      setMessageErrorMultipleProductModal(``)
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

      setSkuData(sku)
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

    // eslint-disable-next-line vtex/prefer-early-return
    if (dataGetProduct) {
      const { data } = dataGetProduct.getProductBySpecificationFilter

      if (data.length > 0) {
        if (data.length === 1) {
          const [{ MultipleEan, linkText, items, productName }] = data

          if (MultipleEan) {
            const skuFinded = findSkuOfMultipleEan(MultipleEan, ean)

            const itemFinded = items.find((item) => item.itemId === skuFinded)

            if (itemFinded) {
              const { nameComplete } = itemFinded

              const skuTemp: SkuDataType = {
                Id: skuFinded,
                NameComplete: nameComplete,
                DetailUrl: `${linkText}/p`,
              }

              setSkuData(skuTemp)
            } else {
              setMessageModal(
                `${translateMessage(
                  messagesInternationalization.theSku
                )} ${skuFinded} ${translateMessage(
                  messagesInternationalization.doesNotExistInTheProduct
                )} ${productName}`
              )
              setModalType('error')
            }
          } else {
            setMessageModal(
              `${translateMessage(
                messagesInternationalization.messageModalError
              )}`
            )
            setModalType('error')
          }
        } else {
          const tempListErrorMultipleProduct: ListMultipleProduct[] = data.map(
            (product) => {
              return {
                productName: product.productName,
                productLink: product.linkText,
              }
            }
          )

          setMessageModal(
            `${translateMessage(
              messagesInternationalization.scannedEanMatches
            )} ${data.length} ${translateMessage(
              messagesInternationalization.differentProducts
            )}`
          )
          setListErrorMultipleProduct(tempListErrorMultipleProduct)
          setMessageErrorMultipleProductModal(
            `${translateMessage(messagesInternationalization.reviewCatalog)}`
          )
          setModalType('errorMultipleProduct')
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
    setSuccessAlert?.(
      `${translateMessage(messagesInternationalization.theProduct)} ${
        skuData.NameComplete
      } ${translateMessage(messagesInternationalization.addToCartSucces)}`
    )
    setUse(false)

    const quantityInOrderForm: number = itemsOrderform.find(
      (item: any) => item.id === skuData.Id
    )?.quantity

    callAddToCart([
      {
        id: parseInt(skuData.Id, 10),
        quantity: quantityInOrderForm ? quantityInOrderForm + 1 : 1,
        seller: '1',
      },
    ])
    setTimeout(() => {
      setUse(true)
    }, 1000)
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
            {messageModal === '' && (
              <div className="loading-container">
                <Spinner />
              </div>
            )}
          </div>
        </ModalDialog>
      )}
      {modalType === 'errorMultipleProduct' && (
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
            <div
              className={`${handles.listErrorMutipleProductText} f4 f3-ns fw3 gray c-action-primary fw5 mb5`}
            >
              {listErrorMultipleProduct.map(
                (product: ListMultipleProduct, index: number) => (
                  <li className="ma0 ml5" key={index}>
                    <a href={`${product.productLink}/p`}>
                      {product.productName}
                    </a>
                  </li>
                )
              )}
            </div>
            <span
              className={`${handles.modalReaderMessagesErrorText} f3 f3-ns fw3 gray c-action-primary fw5`}
            >
              {messageErrorMultipleProductModal}
            </span>
            {messageModal === '' && (
              <div className="loading-container">
                <Spinner />
              </div>
            )}
          </div>
        </ModalDialog>
      )}
    </div>
  )
}
