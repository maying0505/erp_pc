import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'antd';
import api from 'api'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'

const FormItem = Form.Item;
const Option = Select.Option

class InterestRateType extends React.Component {
    static propTypes = {
        defaultValue: PropTypes.string,
        form: PropTypes.object,
        fieldName: PropTypes.string,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        defaultValue: '1',
        disabled: false,
        fieldName: ''
    };
        constructor(props){
            super(props);
            this.state = {
                InterestRateTypeInfo : [],
                defaultValue: '1'
            }
        }
        componentDidMount(){ //预加载数据
            this.loadlists() //获取数据列表
            if (this.props.defaultValue) {
                this.setState({
                    defaultValue: this.props.defaultValue,
                })
            }
        }
        componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
            console.log(nextProps.defaultValue)
            if (nextProps.defaultValue) {
                this.setState({
                    defaultValue: nextProps.defaultValue,
                })
            }
        }
        loadlists(){ //请求数据函数
            request(api.InterestRateType,{},'get',session.get('token'))
              .then(res => {
                  console.log(JSON.stringify(res))
                  if (res.success){
                    this.setState({
                        InterestRateTypeInfo: res.data,
                    });
                  }
              })
          }
        onValuesChange = (values) => {
            console.log(values)
            // this.props.onInterestRateTypeChange(values,this.props.componentsIndex,this.props.componentsStyle)
        }
        showValue= (value) => {
            for (let item of this.state.InterestRateTypeInfo) {
                console.log(item.value,value)
               if (item.value === value)   return  item.label
            }
        }
        render() {
            // const { getFieldDecorator } = this.props.form;
            console.log(this.props)
            return (<span>
                    {this.props.ifShow ? <span>{this.showValue(this.state.defaultValue)}</span>:
                    <FormItem  className="middle-small-input">
                    {this.props.form.getFieldDecorator(this.props.fieldName,{initialValue: this.state.defaultValue})(
                        <Select  disabled={this.props.disabled} onChange={this.onValuesChange}>
                            {this.state.InterestRateTypeInfo.map((item) =>
                                <Option value={item.value} key={item.id}>{item.label}</Option>
                            )}
                        </Select>
                    )}
                    </FormItem>
                    }
                </span>
            ); 
        }
}
// const InterestRateType = Form.create()(InterestRateTypeFrom);
export default InterestRateType
