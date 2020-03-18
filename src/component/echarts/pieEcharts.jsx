import React, { Component } from "react";
import PropTypes from 'prop-types';
import "./chart.less";
import ReactEcharts from "echarts-for-react";

export default class PieEcharts extends Component {
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
        graphicText: PropTypes.string,
    };

    static defaultProps = {
        graphicText: '',
        legendLeft: '200px',
        markPosition: 'top',
        seriesType: 'pie',
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
                value: item,
                name: props.legendData[index],
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
    const { graphicText, legendLeft, markPosition, seriesType, color, titleText, yAxisType, xAxisType, seriesName, legendData, xAxisName, xAxisData } = this.props;
    const { seriesData } = this.state;
    let option = {
        backgroundColor: "#fff",
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
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            show: false,
            x: 'left',
            data: legendData
        },
        graphic:{
            type:'text',
            left:'center',
            top:'center',
            style:{
                text: graphicText,
                textAlign:'center',
                fill:'#000',
                font: 'bolder 1em "Microsoft YaHei", sans-serif',
                width:30,
                height:30
            }
        },
        series: [
            {
                name: titleText,
                type: 'pie',
                radius: ['50%', '70%'],
                labelLine: {
                    normal: {
                        length: 20,
                        length2: 70,
                    }
                },
                label: {
                    normal: {
                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                        backgroundColor: '#eee',
                        borderColor: '#aaa',
                        borderWidth: 1,
                        borderRadius: 4,
                        // shadowBlur:3,
                        // shadowOffsetX: 2,
                        // shadowOffsetY: 2,
                        // shadowColor: '#999',
                        // padding: [0, 7],
                        rich: {
                            a: {
                                color: '#999',
                                lineHeight: 22,
                                align: 'center'
                            },
                            // abg: {
                            //     backgroundColor: '#333',
                            //     width: '100%',
                            //     align: 'right',
                            //     height: 22,
                            //     borderRadius: [4, 4, 0, 0]
                            // },
                            hr: {
                                borderColor: '#aaa',
                                width: '100%',
                                borderWidth: 0.5,
                                height: 0
                            },
                            b: {
                                fontSize: 14,
                                lineHeight: 22
                            },
                            per: {
                                color: '#eee',
                                backgroundColor: '#334455',
                                padding: [2, 4],
                                borderRadius: 2
                            }
                        }
                    }
                },
                color: color,
                data: seriesData
            }
        ]
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
