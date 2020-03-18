import React from 'react';
import PropTypes from 'prop-types';
import {Form, Input, DatePicker} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
import locale from "antd/lib/date-picker/locale/zh_CN";

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const dataTimeFormat = 'YYYY-MM-DD HH:mm';

class NewDatePicker extends React.Component {
    static propTypes = {
        defaultValue: PropTypes.string,
        label: PropTypes.string,
        disabled: PropTypes.bool,
        isRequired: PropTypes.bool,
        fieldName: PropTypes.string.isRequired,
        form: PropTypes.object.isRequired,
    };

    static defaultProps = {
        disabled: false,
        isRequired: false,
        defaultValue: undefined,
        label: '申请日期'
    };

    constructor(props) {
        super(props);
        this.state = {
            defaultTime: this.props.defaultValue ? moment(`${this.props.defaultValue}`, dateFormat) : undefined,
        }
    }

    componentWillReceiveProps(nextProps) { //组件接收到新的props时调用
        console.log('nextProps.defaultValue', nextProps.defaultValue);
        if (nextProps.defaultValue) {
            this.setState({
                defaultTime: moment(`${nextProps.defaultValue}`, dateFormat),
            }, function () {

            });
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {defaultTime} = this.state;
        const {isRequired, disabled, label, showTime = false} = this.props;
        return (
            // <Form layout="inline">
            <FormItem label={label}>
                {
                    getFieldDecorator(this.props.fieldName, {
                        initialValue: defaultTime,
                        rules: [
                            {required: isRequired, message: '*必填'}
                        ]
                    })(
                        <DatePicker
                            locale={locale}
                            disabled={disabled}
                            style={{width: '100%'}}
                            placeholder={`--请输入${label}--`}
                            format={showTime ? dataTimeFormat : dateFormat}
                            showTime={showTime}
                        />
                    )}
            </FormItem>
            // </Form>
        );
    }
}

export default NewDatePicker
