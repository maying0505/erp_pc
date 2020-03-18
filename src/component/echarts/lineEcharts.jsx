import React, { Component } from "react";
import PropTypes from 'prop-types';
import "./chart.less";
import ReactEcharts from "echarts-for-react";
// import echarts from 'echarts/lib/echarts';

export default class LineEcharts extends Component {
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
        dataZoomShow: PropTypes.bool,
        chartName: PropTypes.string,
        tooltipShowSeriesName: PropTypes.array,
        tooltipShowData: PropTypes.array,
        dataUnit: PropTypes.string,
        yAxisAxisLabel: PropTypes.object,
    };

    static defaultProps = {
        yAxisAxisLabel: {formatter:'{value}'},
        tooltipShowSeriesName: [],
        tooltipShowData: [],
        chartName: '',
        dataZoomShow: false,
        legendLeft: '200px',
        markPosition: 'top',
        seriesType: 'line',
        seriesData: [],
        titleText: '',
        yAxisType: 'value',
        xAxisType: 'category',
        seriesName: '',
        legendData: [],
        xAxisName: '',
        xAxisData: [],
        color: ["rgb(216, 151, 235)","rgb(216, 11, 235)"],
        dataUnit: '',

    };
  constructor(props) {
    super(props);
    this.state = {
        seriesDataBefore: [],
        seriesData: [],
        dataZoom: null,
    };
  }

  componentWillMount(){ //预加载数据
    this.propsDo(this.props)
    this.props.dataZoomShow ? this.setState({
        dataZoom: [{
            type: 'slider',
            show: true, //flase直接隐藏图形
            xAxisIndex: [0],
            left: '9%', //滚动条靠左侧的百分比
            bottom: -5,
            start: 0,//滚动条的起始位置
            end: 30 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
          }]
    }) : null
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
    const { dataUnit, yAxisAxisLabel, tooltipShowSeriesName, tooltipShowData, legendLeft, markPosition, seriesType, color, titleText, yAxisType, xAxisType, seriesName, legendData, xAxisName, xAxisData } = this.props;
    const { dataZoom, seriesData } = this.state;
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
        formatter: function (params) {
            let text = params[0].name + '</br>'
            params.map((item,index)=>
                 text += `${tooltipShowData.length > 0 && tooltipShowData[index] ? '<span><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + item.seriesName + ':'+'&nbsp'+'&nbsp'+item.data+'</br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + tooltipShowSeriesName[index] + ':'+'&nbsp'+'&nbsp'+ tooltipShowData[index][item['dataIndex']]+'</br></span>' : '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + item.seriesName + ':'+'&nbsp'+'&nbsp'+item.data+dataUnit+'</br>'}`
            )
            return text
        }
      },
      dataZoom: dataZoom,
      grid: {
        // left: "6%",
        // width: "90%",
        bottom: 100,
        // backgroundColor: "rgba(128, 128, 128, 0.5)",
        borderColor: "#ddd",
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
        boundaryGap: true,
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
        axisLabel: yAxisAxisLabel
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
