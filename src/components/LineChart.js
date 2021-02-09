import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['color'],
  data () {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        layout: {
          padding: {
            left: -6
          }
        },
        scales: {
          xAxes: [{
              ticks: {
                display: false
              },
              gridLines: {
                  display:false
              }
          }],
          yAxes: [{
              ticks: {
                display: true,
                fontColor: this.color
              },
              gridLines: {
                  display:false, // TODO make confiruable
                  drawBorder: false,
                  color: this.color
              }   
          }]
        },
        elements: {
          point:{
              radius: 0
          },
          line: {
            tension: 0.2
          }
        }
      }
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}