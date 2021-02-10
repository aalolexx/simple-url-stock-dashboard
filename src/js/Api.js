import axios from 'axios'
import ApiConstants from './ApiConstants'

class Api {
  constructor () {}

  static async getStockChart (symbol, range) {
    let options = {
      method: 'GET',
      url: ApiConstants.API_ENDPOINT + symbol + '/batch',
      params: {
        types: 'quote,' + (range ? 'chart' : 'intraday-prices'),
        range: range,
        token: ApiConstants.API_KEY
      }
    }
    
    try {
      let response = await axios.request(options)
      return response.data
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

export default Api