/*
* @Create by John on 2018/02/26
* @desc 分公司
* */

import React from 'react';
import PropTypes from 'prop-types';
import {Form, Select} from 'antd';
import api from 'api';
import {request} from 'common/request/request.js';
import {session} from 'common/util/storage.js';

const FormItem = Form.Item;
const Option = Select.Option;

// const BranchOfficeSelectOptionArr = [
//     {id: 0, value: '1', label: '昆明分公司'},
//     {id: 1, value: '2', label: '武汉分公司'},
//     {id: 2, value: '3', label: '北京分公司'},
//     {id: 3, value: '4', label: '长春分公司'},
// ];



export default class BranchOffice extends React.Component {

    static  propTypes = {
        label: PropTypes.string,
        disabled: PropTypes.bool,
        initialValue: PropTypes.string,
        fieldName: PropTypes.string.isRequired,
        form: PropTypes.object.isRequired,
    };

    static defaultProps = {
        label: '分公司',
        disabled: false,
        initialValue: undefined,
        placeholder: '请选择分公司',
    };

    state = {
        optionArr: [],
    };

    componentDidMount() {
        this._getBranchOfficeList();
    }

    _getBranchOfficeList = () => {
        request(api.branchOffice, {}, 'get', session.get('token'))
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
                // this.setState({optionArr: BranchOfficeSelectOptionArr});
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
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                        )}
                    </Select>
                )}
            </FormItem>
        )
    }
}
