<template>
  <div class="dashboard">
    <div class="container">
      <h1>simple stock dashboard</h1>
      <p>{{ urlParams }}</p>
      <div class="card"
          v-for="symbol in urlParams.symbols"
          :key="symbol">
        <div>
          <div v-if="loadedSymbols.includes(symbol)">
            <div :class="(stockData[symbol].meta.regularMarketPrice > stockData[symbol].meta.chartPreviousClose ? 'card__content card__content--green' : 'card__content card__content--red')">
              <div class="card__content-text">
                <h4 class="current-price">{{ Math.round(stockData[symbol].meta.regularMarketPrice * 100)/100 }}</h4>
                <span class="currency">{{ stockData[symbol].meta.currency }}</span>
                <br>
                <span class="relative-to-previous">
                  {{ (stockData[symbol].meta.regularMarketPrice > stockData[symbol].meta.chartPreviousClose ? '+' : '-') }}
                  {{ stockData[symbol].previousAbs }}&nbsp;
                  (&nbsp;{{ stockData[symbol].previousPercent }}%&nbsp;)
                </span>
              </div>
              <div class="card__content-chart-wrapper">
                <line-chart :chart-data="getChartData(stockData[symbol], getStockColor(stockData[symbol]))" :color="getStockColor(stockData[symbol])"></line-chart>
              </div>
            </div>
            <div class="card__meta text-center">
              <h4>{{ stockData[symbol].meta.symbol }}</h4>
              <span class="text-muted">{{ stockData[symbol].meta.exchangeTimezoneName.replace('_', ' ') }}</span>
            </div>
          </div>
          <div v-else>
            <div class="card__content">
              loading...
            </div>
            <div class="card__meta text-center">
              <h4>{{ symbol }}</h4>
              <span class="text-muted">.. loading ..</span>
            </div>
          </div>
          <!--<span>{{ stockData[symbol].meta.regularMarketPrice }} - {{ stockData[symbol].meta.chartPreviousClose }}</span>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../js/Api'
import LineChart from '../components/LineChart'

export default {
  name: 'Dashboard',
  components: { LineChart },
  data () {
    return {
      urlParams: {
        symbols: null,
        range: null,
        region: null
      },
      stockData: {},
      loadedSymbols: []
    }
  },
  
  async mounted () {
    this.readParams()
    for (let symbol of this.urlParams.symbols) {
      this.stockData[symbol] = await Api.getStockChart(symbol, this.urlParams.range, this.urlParams.region)
      let previousAbsRaw = Math.abs(this.stockData[symbol].meta.regularMarketPrice - this.stockData[symbol].meta.chartPreviousClose)
      this.stockData[symbol].previousAbs = Math.round(previousAbsRaw * 100)/100
      this.stockData[symbol].previousPercent = Math.round((100 / this.stockData[symbol].meta.regularMarketPrice * previousAbsRaw ) * 100)/100 
      this.loadedSymbols.push(symbol)
    }
  },

  methods: {
    readParams () {
      let tempSymbols = this.$route.query.symbols
      this.urlParams.symbols = tempSymbols.split(',')
      this.urlParams.range = this.$route.query.range ? this.$route.query.range : '1d'
      this.urlParams.region = this.$route.query.region ? this.$route.query.region : 'US'
    },
    getStockColor (stockData) {
      return stockData.meta.regularMarketPrice > stockData.meta.chartPreviousClose ? '#12a124' : '#f24563'
    },
    getChartData (stockData, color) {
      return {
        labels: stockData.timestamp,
        datasets: [
          {
            label: 'close',
            data: stockData.indicators.quote[0].close,
            fill: false,
            borderColor: color
          }
        ]
      }
    }
  }
}
</script>
