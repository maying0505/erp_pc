import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'antd';
import api from 'api'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'

const FormItem = Form.Item;
const Option = Select.Option

class LoanTermUnit extends React.Component {
    static propTypes = {
        defaultValue: PropTypes.string,
        disabled: PropTypes.bool,
        index: PropTypes.number,
        fieldName: PropTypes.string,
        serviceDeadlineUnitChange: PropTypes.func,
        deadlineUnitChange: PropTypes.func,
    };

    static defaultProps = {
        defaultValue: '1',
        disabled: false,
        fieldName: '',
        index: 0,
        serviceDeadlineUnitChange: ()=>{},
        deadlineUnitChange: ()=>{}
    };
        constructor(props){
            super(props);
            props.serviceDeadlineUnitChange(this.serviceDeadlineUnitChange);
            this.state = {
                LoanTermUnitInfo: [],
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
            console.log(nextProps,'+++++++++++++')
            if (nextProps.defaultValue) {
                this.setState({
                    defaultValue: nextProps.defaultValue,
                })
            }
        }
        serviceDeadlineUnitChange = (value,fieldName) => {
            this.props.form.setFieldsValue({[fieldName]: value});
        }
        loadlists(){ //请求数据函数
            request(api.loanTermUnit,{},'get',session.get('token'))
              .then(res => {
                  console.log(JSON.stringify(res))
                  if (res.success){
                    this.setState({
                        LoanTermUnitInfo: res.data,
                    });
                  }
              })
          }
        onValuesChange = (values) => {
            console.log(values)
            this.props.deadlineUnitChange(values,this.props.index)
        }
        showValue= (value) => {
            for (let item of this.state.LoanTermUnitInfo) {
                console.log(item.value,value)
               if (item.value === value)   return  item.label
            }
        }
        render() {
            // const { getFieldDecorator } = this.props.form;
            console.log(this.props)
            return (<span>
                {this.props.ifShow ? <span>{this.showValue(this.state.defaultValue)}</span>:
                <FormItem  className="small-input">
                    {this.props.form.getFieldDecorator(this.props.fieldName,{initialValue: this.state.defaultValue})(
                        <Select  disabled={this.props.disabled} onChange={(e) =>this.onValuesChange(e)}>
                            {this.state.LoanTermUnitInfo.map((item) =>
                                <Option value={item.value} key={item.id}>{item.label}</Option>
                            )}
                        </Select>
                    )}
                </FormItem>}
                </span>
            ); 
        }
}
// const LoanTermUnit = Form.create()(LoanTermUnitFrom);
export default LoanTermUnit
