import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'antd';
import api from 'api'
import { request } from 'common/request/request.js'
import { local, session } from 'common/util/storage.js'

const FormItem = Form.Item
const Option = Select.Option

class StatusSelect extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        fieldName: PropTypes.string.isRequired,
    };

    static defaultProps = {
        
    };
    constructor(props) {
        super(props);
        this.state = {
            defaultValue: undefined,
            statusSelectInfo: []
        }
    }
    componentDidMount() { //预加载数据
        this.loadlists() //获取数据列表\
    }
    componentWillReceiveProps(nextProps) { //组件接收到新的props时调用
       
    }

    loadlists() { //请求数据函数
        request(api.searchStatusInfo, {}, 'get', session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                if (res.success) {
                    this.setState({
                        statusSelectInfo: res.data,
                    });
                }
            })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        console.log(this.props)
        return (
            <FormItem label="状态">
                {getFieldDecorator(this.props.fieldName, { initialValue: this.state.defaultValue })(
                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear={true}>
                        {this.state.statusSelectInfo.map((item) =>
                            <Option value={item.value} key={item.id}>{item.label}</Option>
                        )}
                    </Select>
                )}
            </FormItem>
        );
    }
}
export default StatusSelect
