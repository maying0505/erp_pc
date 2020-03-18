import React, { Component } from "react";
import PropTypes from 'prop-types';
import "./chart.less";
// import echarts from 'echarts/lib/echarts';

export default class NoData extends Component {
    static propTypes = {
        title: PropTypes.string,
        noDataText: PropTypes.string,
    };

    static defaultProps = {
        title: '',
        noDataText: '暂无数据'
    };
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount(){ //预加载数据
  }

  render() {
    return (
        <div className="no_data_box">
            <div className="no_data">
                <div className="no_data_title">{this.props.title}</div>
                <div className="no_data_text">{this.props.noDataText}</div>
            </div>
        </div>
    );
  }
}
