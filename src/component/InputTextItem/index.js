import React from 'react';
import {Input, Form} from "antd";

const FormItem = Form.Item;


export default class InputTextItem extends React.Component {

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
                        <Input disabled={disabled} placeholder={placeholder}/>
                    )
                }
            </FormItem>
        )
    }
}
