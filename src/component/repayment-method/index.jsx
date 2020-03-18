import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'antd';
import api from 'api'
import { request } from 'common/request/request.js'
import { local, session } from 'common/util/storage.js'

const FormItem = Form.Item;
const Option = Select.Option

class RepaymentMethod extends React.Component {
    static propTypes = {
        defaultValue: PropTypes.string,
        form: PropTypes.object,
        ifShow : PropTypes.bool,
        fieldName: PropTypes.string,
    };

    static defaultProps = {
        defaultValue: undefined,
        ifShow: false,
        fieldName: ''
    };
    constructor(props) {
        super(props);
        this.state = {
            RepaymentMethodInfo: [],
            defaultValue: undefined
        }
    }
    componentWillMount() { //预加载数据
        this.loadlists() //获取数据列表
        this.setState({
            defaultValue: this.props.defaultValue,
        })
    }
    componentWillReceiveProps(nextProps) { //组件接收到新的props时调用
        console.log(nextProps.defalutValue, '-------------------')
        this.setState({
            defaultValue: nextProps.defaultValue,
        })
    }

    loadlists() { //请求数据函数
        request(api.repaymentType, {}, 'get', session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                if (res.success) {
                    this.setState({
                        RepaymentMethodInfo: res.data,
                    });
                }

            })
    }
    showValue = (value) => {
        for (let item of this.state.RepaymentMethodInfo) {
            console.log(item.value, value)
            if (item.value === value) return item.label
        }
    }
    render() {
        // const { getFieldDecorator } = this.props.form;
        console.log(this.props)
        return (
            <span>
                {this.props.ifShow ? <span>{this.showValue(this.state.defaultValue)}</span> :
                    <FormItem label="还款方式">
                        {this.props.form.getFieldDecorator(this.props.fieldName, { initialValue: this.state.defaultValue })(
                            <Select disabled={this.props.disabled} placeholder="请选择还款方式" style={{ width: '100%' }} allowClear={true}>
                                {this.state.RepaymentMethodInfo.map((item) =>
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
export default RepaymentMethod
