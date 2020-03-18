/**
 * @Create by John on 2018/03/26
 * @desc 财务列表状态
 * */

import React from 'react';
import PropTypes from 'prop-types';
import {Form, Select} from 'antd';
import api from 'api';
import {request} from 'common/request/request.js';
import {session} from 'common/util/storage.js';

const FormItem = Form.Item;
const Option = Select.Option;

const StatusSelectOptionArr = [
    {id: 0, value: '1', label: '待审核'},
    {id: 1, value: '2', label: '待签约'},
    {id: 2, value: '3', label: '待放款'},
    {id: 3, value: '4', label: '待还款'},
    {id: 4, value: '5', label: '待复核'},
];

export default class FinanceStatus extends React.Component {

    static propTypes = {
        label: PropTypes.string,
        disabled: PropTypes.bool,
        initialValue: PropTypes.string,
        fieldName: PropTypes.string.isRequired,
    };

    static defaultProps = {
        label: '状态',
        disabled: false,
        initialValue: undefined,
        placeholder: '请选择状态',
    };

    state = {
        optionArr: [],
    };

    componentDidMount() {
        this._getBranchOfficeList();
    }

    _getBranchOfficeList = () => {
        request(api.financeStatus, {}, 'get', session.get('token'))
            .then(res => {
                if (res.success) {
                    let newData = [];
                    res.data.forEach((item, index) => {
                        newData.push({
                            id: index,
                            value: item.value,
                            label: item.label,
                        });
                    });
                    this.setState({optionArr: newData,});
                }
            })
            .catch(err => {
                // this.setState({optionArr: StatusSelectOptionArr});
            });
    };

    render() {
        const {label, fieldName, form, initialValue, disabled, placeholder} = this.props;
        return (
            <FormItem label={label}>
                {form.getFieldDecorator(fieldName, {initialValue: initialValue})(
                    <Select
                        disabled={disabled}
                        placeholder={placeholder}
                        style={{width: '100%'}}
                        allowClear={true}
                    >
                        {this.state.optionArr.map((item) =>
                            <Option value={item.value} key={item.id}>{item.label}</Option>
                        )}
                    </Select>
                )}
            </FormItem>
        )
    }
}
