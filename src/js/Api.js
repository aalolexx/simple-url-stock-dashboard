import axios from 'axios'
import ApiConstants from './ApiConstants'

class Api {
  constructor () {}

  static async getStockChart (symbol, range, region) {
    let interval
    switch (range) {
      case '1d':
        interval = '5m'
        break
      case '5d':
        interval = '60m'
        break
      default:
        interval = '1d'
        break
    }

    let options = {
      method: 'GET',
      url: ApiConstants.API_ENDPOINT + 'get-chart',
      params: {interval: interval, symbol: symbol, range: range, region: region},
      headers: {
        'x-rapidapi-key': ApiConstants.API_KEY,
        'x-rapidapi-host': ApiConstants.API_HOST
      }
    }
    
    try {
      let response = await axios.request(options)
      return response.data.chart.result[0]
    } catch (error) {
      console.log(error)
    }
  }
}

export default Api