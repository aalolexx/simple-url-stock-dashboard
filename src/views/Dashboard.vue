<template>
  <div class="dashboard">
    <div class="container">
      <h1>simple stock dashboard</h1>
      {{ urlParams }}
      <div v-for="symbol in urlParams.symbols" :key="symbol">
        <span v-if="stockData[symbol]">{{ stockData[symbol].meta.regularMarketPrice }} - {{ stockData[symbol].meta.chartPreviousClose }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../js/Api'

export default {
  name: 'Dashboard',
  data () {
    return {
      urlParams: {
        symbols: null,
        range: null,
        region: null
      },
      stockData: {
        updateFlat: 0
      }
    }
  },
  
  async mounted () {
    this.readParams()
    for (let symbol of this.urlParams.symbols) {
      this.stockData[symbol] = await Api.getStockChart(symbol, this.urlParams.range, this.urlParams.region)
      this.stockData.updateFlat ^= 1
    }
  },

  methods: {
    readParams () {
      let tempSymbols = this.$route.query.symbols
      this.urlParams.symbols = tempSymbols.split(',')
      this.urlParams.range = this.$route.query.range ? this.$route.query.range : '1d'
      this.urlParams.region = this.$route.query.region ? this.$route.query.region : 'US'
    }
  }
}
</script>
