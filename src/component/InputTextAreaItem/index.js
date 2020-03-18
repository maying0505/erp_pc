import React from 'react';
import {Input, Form} from "antd";

const FormItem = Form.Item;


export default class InputTextAreaItem extends React.Component {

    render() {
        const {getFieldDecorator} = this.props.form;
        const {placeholder, label, fieldName, isRequired, initialValue, disabled = false,} = this.props;
        return (
            <FormItem label={label}>
                {
                    getFieldDecorator(fieldName, {
                        initialValue: initialValue,
                        rules: [
                            {required: isRequired, message: '*必填'}
                        ]
                    })(
                        <Input.TextArea
                            disabled={disabled}
                            placeholder={placeholder}
                            autosize={{minRows: 6, maxRows: 12}}
                        />
                    )
                }
            </FormItem>
        )
    }
}
