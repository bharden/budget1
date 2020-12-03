<script>
  import { Doughnut, mixins } from 'vue-chartjs'
  const { reactiveProp } = mixins
  export default {
    extends: Doughnut,
    mixins: [ reactiveProp ],
    data () {
      return {
        options: {
          legend: {
            display: true,
          },
          responsive: true,
          maintainAspectRatio: false,
          // onClick: this.addCost
        }
      }
    },
    // methods: {
    //   addCost() {
    //     this.$emit('on-receive')
    //   }
    // },
    mounted () {
      this.renderChart(this.chartData, this.options)
    }
  }
</script>
