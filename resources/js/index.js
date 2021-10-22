/**
 * 指令loading
 */
Vue.prototype.$loading = {
  show: function () {
    if (document.querySelector('#vue-loading')) return
    var LoadingTip = Vue.extend({
      template: `<div id="vue-loading" style="position: fixed;top: 0;right: 0;bottom:0;left: 0;z-index: 99999;display: flex;justify-content: center;align-items: center;padding-bottom: 120px;background: rgba(0,0,0,.08);"><img src="/resources/img/loading.gif" style="height: 50px"></div>`
    })
    var tpl = new LoadingTip().$mount().$el
    document.body.appendChild(tpl)
    document.querySelector('#vue-loading').addEventListener('touchmove', function (e) {
      e.stopPropagation()
      e.preventDefault()
    })
  },
  hide: function() {
    var tpl = document.querySelector('#vue-loading')
    if (!tpl) return
    document.body.removeChild(tpl)
  }
}
/**
 * 指令toast
 */
var toastVMStatus = false
Vue.prototype.$toast = function ({iconType , msg, ...other}) {
  if (toastVMStatus) return
  toastVMStatus = true
  var toastTpl = Vue.extend({
    template: `<div id="vue-taost" style="z-index: 99999; position: fixed;top: 0;right: 0;bottom: 0;left: 0;background: rgba(0, 0, 0, .2);display: flex;justify-content: center;align-items: center;">
      <div style="padding: 10px;background: #ffffff;border-radius: 8px; width: 270px;display:flex;flex-direction: column;align-items: center;">
        <div style="padding-bottom: 15px;display:flex;justify-content: space-between;width: 100%">
          <span></span>
          <img style="width: 15px;height: 15px;display:block" src="/resources/img/close.png" @click="toastClick">
        </div>
        <img style="height:125px;display:block" :src="'/resources/img/' + iconType + '.png'">
        <p style="text-align: center;color: #333;padding: 30px 0 15px 0;">{{msg}}</p>
      </div>
    </div>`,
    data: function () {
      return {
        msg: msg || '',
        iconType: iconType || 'success'
      }
    },
    methods: {
      toastClick () {
        var tpl = document.querySelector('#vue-taost')
        if (!tpl) return
        toastVMStatus = false
        document.body.removeChild(tpl)
      }
    }
  })
  var toastVM = new toastTpl();
  var tpl = toastVM.$mount().$el;
  document.body.appendChild(tpl);
  document.querySelector('#vue-taost').addEventListener('touchmove', function (e) {
    e.stopPropagation()
    e.preventDefault()
  })
}
/**
 * 
 * @param {入参时间戳} timestamp 
 * @param {转化格式类型} format 
 * @returns 
 */
var timestampFormat = function timestampFormat (timestamp, format)  {
  var result = ''
  timestamp = window.parseInt(timestamp, 10)
  if (!timestamp) {
    result = '-'
  } else if (format === 'interval') {
    var diff = (now - timestamp) / 1000
    if (diff < 60) {
      // 一分钟内
      result = '刚刚'
    } else if ((diff < 60 * 60) && (diff >= 60)) {
      // 超过十分钟少于1小时
      result = Math.floor(diff / 60) + '分钟前'
    } else if ((diff < 60 * 60 * 24) && (diff >= 60 * 60)) {
      // 超过1小时少于24小时
      result = Math.floor(diff / 60 / 60) + '小时前'
    } else if ((diff < 60 * 60 * 24 * 3) && (diff >= 60 * 60 * 24)) {
      // 超过1天少于3天内
      return Math.floor(diff / 60 / 60 / 24) + '天前'
    } else {
      // 超过3天
      result = moment(timestamp).format('YYYY.MM.DD HH:mm')
    }
  } else if (format) {
    result = moment(timestamp).format(format)
  } else {
    result = moment(timestamp).format('YYYY.MM.DD HH:mm:ss')
  }
  return result
}

// chart
Vue.component('yl-chart', {
  template: '#yl-chart',
  name: 'yl-chart',
  props: {
    options: Object,
    theme: String,
    initOptions: Object,
    group: String,
    autoResize: Boolean
  },
  data:function () {
    return {
      chart: null
    }
  },
  computed: {
    // Only recalculated when accessed from JavaScript.
    // Won't update DOM on value change because getters
    // don't depend on reactive values
    width: {
      cache: false,
      get () {
        return this.chart.getWidth()
      }
    },
    height: {
      cache: false,
      get () {
        return this.chart.getHeight()
      }
    },
    isDisposed: {
      cache: false,
      get () {
        return this.chart.isDisposed()
      }
    }
  },
  watch: {
    // use assign statements to tigger "options" and "group" setters
    options: {
      handler (options) {
        if (!this.chart && options) {
          this.$_init()
        } else {
          this.chart.setOption(this.options, true)
        }
      },
      deep: true
    },
    group: {
      handler (group) {
        this.chart.group = group
      }
    }
  },
  methods: {
    // provide a explicit merge option method
    mergeOptions (options) {
      this.$_delegateMethod('setOption', options)
    },
    // just delegates ECharts methods to Vue component
    // use explicit params to reduce transpiled size for now
    resize (options) {
      this.$_delegateMethod('resize', options)
    },
    dispatchAction (payload) {
      this.$_delegateMethod('dispatchAction', payload)
    },
    convertToPixel (finder, value) {
      return this.$_delegateMethod('convertToPixel', finder, value)
    },
    convertFromPixel (finder, value) {
      return this.$_delegateMethod('convertFromPixel', finder, value)
    },
    containPixel (finder, value) {
      return this.$_delegateMethod('containPixel', finder, value)
    },
    showLoading (type, options) {
      this.$_delegateMethod('showLoading', type, options)
    },
    hideLoading () {
      this.$_delegateMethod('hideLoading')
    },
    getDataURL (options) {
      return this.$_delegateMethod('getDataURL', options)
    },
    getConnectedDataURL (options) {
      return this.$_delegateMethod('getConnectedDataURL', options)
    },
    clear () {
      this.$_delegateMethod('clear')
    },
    dispose () {
      this.$_delegateMethod('dispose')
    },
    $_delegateMethod (name, ...args) {
      if (!this.chart) {
        Vue.util.warn(`Cannot call [${name}] before the chart is initialized. Set prop [options] first.`, this)
        return
      }
      return this.chart[name](...args)
    },
    $_init () {
      if (this.chart) {
        return
      }
      var chart = echarts.init(this.$el, this.theme, this.initOptions)
      if (this.group) {
        chart.group = this.group
      }
      chart.setOption(this.options, true)
      // expose ECharts events as custom events
      // ACTION_EVENTS.forEach(event => {
      //   chart.on(event, params => {
      //     this.$emit(event, params)
      //   })
      // })
      // MOUSE_EVENTS.forEach(event => {
      //   chart.on(event, params => {
      //     this.$emit(event, params)
      //     // for backward compatibility, may remove in the future
      //     this.$emit('chart' + event, params)
      //   })
      // })
      // if (this.autoResize) {
      //   this.__resizeHanlder = debounce(() => {
      //     chart.resize()
      //   }, 100, { leading: true })
      //   window.addEventListener('resize', this.__resizeHanlder)
      // }
      this.chart = chart
    }
  },
  mounted: function () {
    // auto init if `options` is already provided
    if (this.options) {
      this.$_init()
    }
  },
  beforeDestroy: function () {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }
    this.dispose()
  },
  connect: function (group) {
    if (typeof group !== 'string') {
      group = group.map(chart => chart.chart)
    }
    echarts.connect(group)
  },
  disconnect: function (group) {
    echarts.disConnect(group)
  },
  registerMap: function (...args) {
    echarts.registerMap(...args)
  },
  registerTheme: function (...args) {
    echarts.registerTheme(...args)
  }
});
// 业务功能页面
window.onload = function() {
  'use strict';
  var mock = {
    "count": 183,
    "list": [
        {
            "count": 5,
            "datetime": 1621267200000
        },
        {
            "count": 10,
            "datetime": 1621353600000
        },
        {
            "count": 29,
            "datetime": 1621440000000
        },
        {
            "count": 9,
            "datetime": 1621526400000
        },
        {
            "count": 1,
            "datetime": 1621612800000
        },
        {
            "count": 90,
            "datetime": 1621699200000
        },
        {
            "count": 2,
            "datetime": 1621785600000
        },
        {
            "count": 199,
            "datetime": 1621872000000
        },
        {
            "count": 12,
            "datetime": 1621958400000
        },
        {
            "count": 21,
            "datetime": 1622044800000
        },
        {
            "count": 89,
            "datetime": 1622131200000
        },
        {
            "count": 77,
            "datetime": 1622217600000
        },
        {
            "count": 90,
            "datetime": 1622304000000
        },
        {
            "count": 12,
            "datetime": 1622390400000
        },
        {
            "count": 9,
            "datetime": 1622476800000
        },
        {
            "count": 90,
            "datetime": 1622563200000
        },
        {
            "count": 82,
            "datetime": 1622649600000
        },
        {
            "count": 0,
            "datetime": 1622736000000
        },
        {
            "count": 22,
            "datetime": 1622822400000
        },
        {
            "count": 0,
            "datetime": 1622908800000
        }
    ],
    "viewCount": 0,
    "viewPeoples": 0
  }
  var LineOptions = {
    title: {
      left: '2%',
      top: '3%'
    },
    legend: {
      bottom: '3%',
      data: []
    },
    grid: {
      left: '3%',
      right: '3%',
      top: '6%',
      bottom: '13%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br>查看次数：{c}'
    },
    xAxis: [
      {
        type: 'category',
        data: [],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false,
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        minInterval: 1,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false,
          alignWithLabel: true
        },
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      }
    ],
    series: [
      {
        name: '',
        type: 'line',
        smooth: true,
        symbolSize: 1,
        itemStyle: {
          color: '#04a6e9',
          opacity: 0
        },
        emphasis: {
          borderColor: '#04a6e9',
          opacity: 1
        },
        lineStyle: {
          color: '#04a6e9',
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#04a6e9'
          }, {
            offset: 1,
            color: '#fff'
          }], false)
        },
        data: []
      }
    ]
  }

  var barOptions = {
    title: {
      left: '2%',
      top: '3%'
    },
    legend: {
      bottom: '3%',
      data: []
    },
    grid: {
      left: '3%',
      right: '3%',
      top: '6%',
      bottom: '13%',
      containLabel: true
    },
    tooltip: {
      formatter: '{a}<br>{b}：{c}'
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        interval: 0
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false,
        alignWithLabel: true
      }
    },
    yAxis: {
      minInterval: 1,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false,
        alignWithLabel: true
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      type: 'bar',
      barMaxWidth: 35,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: '#3ddcf2'
        }, {
          offset: 1,
          color: '#04a6e9'
        }])
      }
    }]
  }


  var jumpPage = {
    template: '#jump-template',
    data: function() {
      return {
        timeChartOptions: LineOptions,
        cityChartOptions: barOptions,
        tableData: mock.list
      }
    },
    filters: {
      timestampFormat
    },
    methods: {
      getLineMock () {
        var _data = mock
        var _numLookList = _data.list
        var _numLookX = []
        var _numLookY = []
        _numLookList.forEach(function (item) {
          var _datetime = timestampFormat(item.datetime, 'YYYY.MM.DD')
          _numLookX.push(_datetime)
          _numLookY.push(item.count)
        })
        this.$refs.numLookLineChart['mergeOptions']({
          // title: {
          //   text: '当日查看次数'
          // },
          legend: {
            data: [{
              name: '当日499次数'
            }]
          },
          xAxis: [{
            data: _numLookX
          }],
          series: [{
            name: '当日499次数',
            data: _numLookY
          }]
        })
      },
      getBarMock() {
        var _data = mock
        var _numLookList = _data.list
        var _cityX = []
        var _cityY = []
        if (_numLookList) {
          _numLookList.forEach(function (item) {
            var _datetime = timestampFormat(item.datetime, 'YYYY.MM.DD')
            _cityX.push(_datetime)
            _cityY.push(item.count)
          })
          this.$refs.numLookBarChart['mergeOptions']({
            // title: {
            //   text: _cityData.title
            // },
            legend: {
              data: [{
                name: '当日499次数'
              }]
            },
            xAxis: [{
              data: _cityX
            }],
            series: [{
              name: '当日499次数',
              data: _cityY
            }]
          })
        }
      }
    },
    mounted: function() {
      this.getLineMock()
      this.getBarMock()
    }
  };
  // 路由配置
  var _routes = [
    {
      path: '/',
      component: jumpPage,
      meta:{
        title: '合意贷'
      }
      // redirect: '/404'
    }
  ];
  // 创建路由
  var _router = new VueRouter({
    scrollBehavior: function (to, from, savedPosition) {
      return { x: 0, y: 0 }
    },
    routes: _routes
  });

  _router.beforeEach (function (to, from, next) {
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next();
    // if (!to.meta.skipAuth) {
    //   if (!jwt) {
    //     location.reload()
    //   } else {
    //     next();
    //   }
    // } else {
    //   next();
    // }
  });

  // 创建vue实例
  var createVue = function () {
    new Vue({
      delimiters: ['[[', ']]'],
      router: _router,
      componentName: 'app'
    }).$mount('#app');

    Vue.use(vant.Lazyload);
  };
  createVue();
};
