const formatQr = (qr, separator, eanIndex) => {
  return qr.split(separator)[eanIndex]
}

export default formatQr
