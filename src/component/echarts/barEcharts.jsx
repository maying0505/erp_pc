import React, { Component } from "react";
import PropTypes from 'prop-types';
import "./chart.less";
import ReactEcharts from "echarts-for-react";

export default class BarEcharts extends Component {
    static propTypes = {
        markPosition: PropTypes.string,
        seriesType: PropTypes.string,
        seriesName: PropTypes.string,
        legendData: PropTypes.array,
        xAxisName: PropTypes.string,
        xAxisData:  PropTypes.array,
        xAxisType: PropTypes.string,
        yAxisType: PropTypes.string,
        titleText: PropTypes.string,
        seriesData: PropTypes.array,
        color: PropTypes.array,
        legendLeft: PropTypes.string,
    };

    static defaultProps = {
        legendLeft: '200px',
        markPosition: 'top',
        seriesType: 'bar',
        seriesData: [],
        titleText: '',
        yAxisType: 'value',
        xAxisType: 'category',
        seriesName: '',
        legendData: [],
        xAxisName: '',
        xAxisData: [],
        color: ["rgb(216, 151, 235)","rgb(216, 11, 235)"],
    };
    constructor(props) {
      super(props);
      this.state = {
          seriesDataBefore: [],
          seriesData: [],
      };
    }
  
    componentWillMount(){ //预加载数据
      this.propsDo(this.props)
    }
  
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
          this.propsDo(nextProps)
    }
  
    propsDo = (props) => {
      if (props.seriesData !== this.state.seriesDataBefore) {
          let seriesDataBefore = [];
          const {normalSeries} = this.state;
          props.seriesData.forEach((item,index) =>{
              console.log('item',item);
              console.log('index',index);
              const obj = {
                  data: item,
                  name: props.legendData[index],
                  type: props.seriesType,
              };
              seriesDataBefore.push(obj);
          })
          console.log('seriesDataBefore',seriesDataBefore)
          this.setState({
              seriesData: seriesDataBefore,
              seriesDataBefore: props.seriesData
          })
      }
    }
    getOption() {
      const { legendLeft, markPosition, seriesType, color, titleText, yAxisType, xAxisType, seriesName, legendData, xAxisName, xAxisData } = this.props;
      const { seriesData } = this.state;
      let option = {
        backgroundColor: "#fff",
        color: color,
        title: [
          {
            text: titleText,
            left: "24px",
            top: "6%",
            textStyle: {
              fontWeight: "bold",
              fontSize: '15'
            }
          }
        ],
        tooltip: {
          trigger: "axis",
          // formatter: function (params) {
          //     console.log('params',params);
          //     return params;
          // }
        },
        grid: {
          // left: "6%",
          // width: "90%",
          // backgroundColor: "rgba(128, 128, 128, 0.5)",
          borderColor: "#ddd",
          bottom: 100,
          show: true,
        },
        legend: {
          top: "7%",
          left: legendLeft,
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: "gray",
            fontSize: 14
          },
          data: legendData
        },
        xAxis: {
          type: xAxisType,
          name: xAxisName,
          data: xAxisData,
          axisLabel:{
            interval: 0,
            show:true,
            rotate: 40
            // formatter:function(val){
            //     return val.split("").join("\n");
            // }
          },
          axisTick: {
              show: false
          },
          axisLine: {
              show: false
          },
        },
        yAxis: {
          type: yAxisType,
          axisLine: {
              show: false
          },
          axisTick: {
              show: false
          },
        },
        series: seriesData
      };
      return option;
    }
  render() {
    return (
        <div className="echarts">
          <ReactEcharts option={this.getOption()} />
        </div>
    );
  }
}
