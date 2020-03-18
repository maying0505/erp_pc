/**
 * @Create by John on 2018/03/29
 * @Desc 输入组件
 * */

import React from 'react';
import PropTypes from 'prop-types';
import {Form, InputNumber} from 'antd';

const FormItem = Form.Item;

export default class InputNumberItem extends React.Component {

    static propTypes = {
        isRequired: PropTypes.bool,
        placeholder: PropTypes.string,
        initialValue: PropTypes.number,
        disabled: PropTypes.bool,
        label: PropTypes.string.isRequired,
        form: PropTypes.object.isRequired,
        fieldName: PropTypes.string.isRequired,
        numberInput: PropTypes.bool,
    };

    static defaultProps = {
        placeholder: '请输入',
        isRequired: false,
        disabled: false,
        initialValue: undefined,
        numberInput: false,
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {placeholder, label, fieldName, isRequired, disabled, initialValue, display, marginBottom, onChange = null} = this.props;
        const ds = display ? display : 'inline-flex';
        const mb = marginBottom === '0' ? null : '12px';
        return (
            <FormItem style={{display: ds, marginBottom: mb}} label={label}>
                {
                    getFieldDecorator(fieldName, {
                        rules: [
                            {required: isRequired, message: '*必填'}
                        ],
                        initialValue: initialValue,
                    })(
                        <InputNumber
                            placeholder={placeholder}
                            disabled={disabled}
                            addonAfter='元'
                            min={0}
                            onChange={onChange ? (value) => onChange(value) : null}
                            style={{width: '100%'}}
                        />
                    )
                }
            </FormItem>
        )
    }
}
