import {saveAs} from './filesaver'

const jsonToCSV = records => {
  const columns = []
  // get list of all columns across all records (as some record lists contain mixed structures)
  records.forEach(rec => {
    const newKeys = Object.keys(rec).filter(
      key => columns.indexOf(key) === -1 && typeof rec[key] !== 'function'
    )
    if (newKeys.length > 0) {
      columns.push(...newKeys)
    }
  })
  console.log(columns)

  // map col name to col idx
  const colToIdx = columns.reduce((accumulated, curCol, curIdx) => {
    accumulated[curCol] = curIdx
    return accumulated
  }, {})

  // build and return csv string from array of column values
  const toCsvString = stringArr =>
    stringArr.map(
      (val, idx) =>
        `"${typeof val === 'object' ? JSON.stringify(val) : val}"${
          idx === stringArr.length - 1 ? ',' : ''
        }`
    )

  const numCols = columns.length
  const headerCsv = toCsvString(columns)

  return records.reduce((csvStr, curRec) => {
    const row = new Array(numCols)
    row.fill('')

    Object.keys(curRec).forEach(key => (row[colToIdx[key]] = curRec[key]))
    csvStr = `${csvStr}\n${toCsvString(row)}`

    return csvStr
  }, headerCsv)
}

const exportCSV = records => {
  const csvData = jsonToCSV(records)
  const autoByteOrderMark = true
  saveAs(
    new Blob(['\ufeff', csvData], {type: 'text/csv;charset=utf-8'}),
    'stellar-export.csv',
    autoByteOrderMark
  )
}

export {exportCSV, jsonToCSV}
