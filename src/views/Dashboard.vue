<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <h1>simple stock dashboard</h1>
      <p>{{ urlParams }}</p>
      <div class="card__container">
        <div class="card"
            v-for="symbol in urlParams.symbols"
            :key="symbol">
          <div>
            <div v-if="loadedSymbols.includes(symbol) && stockData[symbol]">
              <div :class="isStockPlus(stockData[symbol]) ? 'card__content card__content--green' : 'card__content card__content--red'">
                <div class="card__content-text">
                  <h4 class="current-price">{{ stockData[symbol].quote.latestPrice }}</h4>
                  <span class="currency">$</span><!-- todo aeh check other currencies -->
                  <br>
                  <span class="relative-to-previous">
                    {{ getStockDifference(stockData[symbol]).change }}&nbsp;
                    (&nbsp;{{ getStockDifference(stockData[symbol]).changePercent }}%&nbsp;)
                  </span>
                </div>
                <div class="card__content-chart-wrapper">
                  <line-chart :chart-data="getChartData(stockData[symbol], getStockColor(stockData[symbol]))" :color="getStockColor(stockData[symbol])"></line-chart>
                </div>
              </div>
              <div class="card__meta text-center">
                <h4>{{ stockData[symbol].quote.companyName }}</h4>
                <span class="text-muted">{{ stockData[symbol].quote.symbol }}</span>
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
          </div>
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
        range: null
      },
      stockData: {},
      loadedSymbols: []
    }
  },
  
  async mounted () {
    this.readParams()
    for (let symbol of this.urlParams.symbols) {
      let range = this.urlParams.range != '1d' ? this.urlParams.range : null
      this.stockData[symbol] = await Api.getStockChart(symbol, range)
      this.loadedSymbols.push(symbol)
    }
  },

  methods: {
    readParams () {
      let tempSymbols = this.$route.query.symbols
      this.urlParams.symbols = tempSymbols ? tempSymbols.split(',') : []
      this.urlParams.range = this.$route.query.range ? this.$route.query.range : '1d'
    },
    getStockColor (stockData) {
      return this.isStockPlus(stockData) ? '#12a124' : '#f24563'
    },
    isStockPlus (stockData) {
      let stockDifference = this.getStockDifference(stockData)
      return stockDifference.first < stockDifference.last 
    },
    getStockDifference (stockData) {
      let dataSetObject = stockData['intraday-prices'] ? 'intraday-prices' : 'chart'
      let firstClose = stockData[dataSetObject][0].close
      let lastClose = stockData[dataSetObject][stockData[dataSetObject].length - 1].close
      console.log(firstClose, lastClose)
      let change = Math.round((lastClose - firstClose) * 100)/100
      let changePercent = Math.round((100 / lastClose * change) * 100)/100
      return {
        first: firstClose,
        last: lastClose,
        change: change,
        changePercent: changePercent
      }
    },
    getChartData (stockData, color) {
      let dataSetObject = stockData['intraday-prices'] ? 'intraday-prices' : 'chart'
      let labels = stockData[dataSetObject].map((item) => item.date)
      let data = stockData[dataSetObject].map((item) => item.close)
      return {
        labels: labels,
        datasets: [
          {
            label: 'close',
            data: data,
            fill: false,
            borderColor: color
          }
        ]
      }
    }
  }
}
</script>
