import React from 'react';
import {Checkbox, Form} from 'antd';
import './index.scss';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

export default class MyCheckbox extends React.Component {

    _onChange = (value) => {
        const {form: {setFieldsValue}, fieldName} = this.props;
        const v = value.toString();
        setFieldsValue({[fieldName]: v});
    };

    render() {
        const {childArr, label, fieldName, initialValue, isRequired, disabled, form: {getFieldDecorator}} = this.props;
        return (
            <FormItem label={label}>
                {
                    getFieldDecorator(fieldName, {
                        initialValue: initialValue ? initialValue.toString() : undefined,
                        rules: [
                            {required: isRequired, message: '*必填'}
                        ]
                    })(
                        <div/>
                    )
                }
                {
                    getFieldDecorator(`${fieldName}_tempField`, {
                        initialValue,
                        rules: [
                            {required: isRequired, message: '*必填'}
                        ]
                    })(
                        <CheckboxGroup
                            disabled={disabled}
                            onChange={this._onChange}
                        >
                            {
                                childArr.map((item, index) => {
                                    return (
                                        <Checkbox key={`checkbox_key_${index}`} value={item.value}>
                                            {item.text}
                                        </Checkbox>
                                    )
                                })
                            }
                        </CheckboxGroup>
                    )
                }
            </FormItem>
        );
    }
}
