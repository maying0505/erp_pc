import React from 'react';
import {DatePicker, Form, Button} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';

const FormItem = Form.Item;
const {RangePicker} = DatePicker;

const TimeFormat = 'HH:mm';
const DateTimeFormat = 'YYYY-MM-DD HH:mm';


export default class MyRangePicker extends React.Component {

    state = {
        duration: null,
        value: [],
        dateString: [],
    };

    componentDidMount() {
        const {initialValue} = this.props;
        if (initialValue) {
            const duration = moment(initialValue.endTime).diff(moment(initialValue.beginTime), 'hours');
            this.setState({
                duration,
            });
        }
    }

    _onChange = (value, dateString) => {
        let duration = null;
        if (value.length > 0) {
            duration = value[1].diff(value[0], 'hours');
            this._setFieldsValue({
                    beginTime: dateString[0],
                    endTime: dateString[1],
                    duration: duration,
                }
            );
        }
        this.setState({
            duration,
            value,
            dateString,
        });
    };

    _setFieldsValue = (obj) => {
        const {form: {setFieldsValue}, fieldName} = this.props;
        const valueObj = {
            beginTime: obj.beginTime,
            endTime: obj.endTime,
            duration: obj.duration,
        };
        setFieldsValue({[fieldName]: valueObj});
    };

    _onOk = (value) => {
        if (value.length > 0) {
            this._setFieldsValue({
                    beginTime: moment(value[0]).format(DateTimeFormat),
                    endTime: moment(value[1]).format(DateTimeFormat),
                    duration: moment(value[1]).diff(moment(value[0]), 'hours'),
                }
            );
        }
    };

    render() {
        const {placeholder, label, fieldName, initialValue, isRequired, disabled, form: {getFieldDecorator}} = this.props;
        const {duration} = this.state;
        const durationStr = duration !== null ? `${duration}时` : '--';
        const iv = function () {
            if (initialValue) {
                return [moment(initialValue.beginTime), moment(initialValue.endTime)];
            } else {
                return undefined;
            }
        }();
        const v = function () {
            if (initialValue) {
                return initialValue;
            } else {
                return undefined;
            }
        }();
        console.log('v', v);
        return (
            <FormItem label={label}>
                {
                    getFieldDecorator(fieldName, {
                        initialValue: v,
                        rules: [
                            {required: isRequired, message: '*必填'}
                        ]
                    })(
                        <div/>
                    )
                }
                {
                    getFieldDecorator(`${fieldName}_tempField`, {
                        initialValue: iv,
                        rules: [
                            {required: isRequired, message: '*必填'}
                        ]
                    })(
                        <RangePicker
                            locale={locale}
                            disabled={disabled}
                            format={DateTimeFormat}
                            showTime={{format: TimeFormat}}
                            placeholder={[placeholder[0], placeholder[1]]}
                            onChange={this._onChange}
                            onOk={this._onOk}
                        />
                    )
                }
                <Button>
                    时长：{durationStr}
                </Button>
            </FormItem>
        )
    }
}
