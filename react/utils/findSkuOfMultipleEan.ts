const findSkuOfMultipleEan = (MultipleEan, ean) => {
  const skuWithEanArray = MultipleEan[0].split('-')

  const [skuWithEanFinded] = skuWithEanArray.filter(sku => sku.includes(ean))

  return skuWithEanFinded.replace(ean, '').replace(':', '')
}

export default findSkuOfMultipleEan
