import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'antd';
import api from 'api'
import { request } from 'common/request/request.js'
import { local, session } from 'common/util/storage.js'

const FormItem = Form.Item
const Option = Select.Option

class ProductSelect extends React.Component {
    static propTypes = {
        proNameInfo: PropTypes.string,
        proCategoryInfo: PropTypes.string,
        proStyleInfo: PropTypes.string,
        form: PropTypes.object.isRequired,
        fieldName: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        fieldText: PropTypes.string,
    };

    static defaultProps = {
        proNameInfo: '',
        proCategoryInfo: '',
        proStyleInfo: '',
        disabled: false,
        fieldText: '产品'
    };
    constructor(props) {
        super(props);
        this.state = {
            ProductSelectInfo: [],
            defaultValue: undefined

        }
    }
    componentDidMount() { //预加载数据
        this.loadlists() //获取数据列表\
        if (this.props.proNameInfo) {
            if (this.props.proNameInfo.length > 0) {
                this.setState({
                    defaultValue: this.props.proNameInfo
                })
            }
        }
    }
    componentWillReceiveProps(nextProps) { //组件接收到新的props时调用
        console.log(nextProps.props)
        if (nextProps.proNameInfo) {
            if (nextProps.proNameInfo.length > 0) {
                this.setState({
                    defaultValue: nextProps.proNameInfo
                })
            }
        }
    }

    loadlists() { //请求数据函数
        request(api.ProductSelectInfo, {}, 'get', session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                if (res.success) {
                    this.setState({
                        ProductSelectInfo: res.data,
                    });
                }
            })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        console.log(this.props)
        return (
            <FormItem label={this.props.fieldText}>
                {getFieldDecorator(this.props.fieldName, { initialValue: this.state.defaultValue })(
                    <Select placeholder="请选择借款产品" style={{ width: '100%' }} disabled={this.props.disabled} allowClear={true}>
                        {this.state.ProductSelectInfo.map((item) =>
                            <Option value={item.proName} key={item.id}>{item.proName}</Option>
                        )}
                    </Select>
                )}
            </FormItem>
        );
    }
}
export default ProductSelect
