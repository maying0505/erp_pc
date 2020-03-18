/**
 * @Create by John on 2018/03/29
 * @Desc 用于放款的凭证
 * */

import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Divider, Button} from 'antd';

import InputItem from '../inputItem';
import ImgUpload from '../img-upload';


const ColMd = 12;
const ColSm = 20;

export default class Voucher extends React.Component {

    static propTypes = {
        title: PropTypes.string,

        disabled: PropTypes.bool,
        imgDelete: PropTypes.bool,
        imgFileList: PropTypes.array.isRequired,

        form: PropTypes.object.isRequired,
        inputLabel: PropTypes.string.isRequired,
        inputFieldName: PropTypes.string.isRequired,
        oneTimeCharge: PropTypes.number,
        downloadButtonTitle: PropTypes.string,
        downloadFunc: PropTypes.func,
    };

    static defaultProps = {
        title: null,
        disabled: false,
        imgDelete: true,
        downloadButtonTitle: '',
        downloadFunc: () => null,
    };

    _onDownloadPress = () => {
        const {downloadButtonTitle, downloadFunc} = this.props;
        downloadButtonTitle && downloadFunc && downloadFunc();
    };

    render() {
        const {
            title, form,
            inputLabel, inputFieldName, inputInitialValue,
            imgFileList, disabled, onPicturesWallChange, imgDelete,
            oneTimeCharge, downloadButtonTitle,
        } = this.props;
        return (
            <div className='padding15'>
                {
                    title && <div className="white-title">
                        <p>
                            {this.props.title}：
                            {
                                downloadButtonTitle &&
                                <Button
                                    className='green-style'
                                    style={{marginRight: '10px'}}
                                    onClick={this._onDownloadPress}
                                >
                                    {downloadButtonTitle}
                                </Button>
                            }
                        </p>
                        <Divider/>
                    </div>
                }
                {
                    !isNaN(oneTimeCharge) && typeof oneTimeCharge === 'number' &&
                    <div className='white-title'>应收费用：<span color={'#999aa7'}>{oneTimeCharge.toFixed(2)}</span> 元</div>
                }
                <Row type='flex' align='middle'>
                    <InputItem
                        form={form}
                        label={inputLabel}
                        disabled={disabled}
                        fieldName={inputFieldName}
                        initialValue={inputInitialValue}
                    />
                </Row>
                <Row style={{width: '100%'}}>
                    <ImgUpload
                        disabled={disabled}
                        isDelete={imgDelete}
                        defaultFileList={imgFileList}
                        onPicturesWallChange={onPicturesWallChange}
                    />
                </Row>
            </div>
        )
    }
}
