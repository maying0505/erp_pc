/**
 * @Create by John on 2018/04/02
 * @Desc 文档模板下载
 * */

'use strict';
import React from 'react';
import {Card, Form, Spin, Row, Col, Checkbox, message, Button} from 'antd';

import './index.scss';

import api from 'common/util/api';
import {request} from 'common/request/request';
import {local, session} from 'common/util/storage';

const CheckboxGroup = Checkbox.Group;
const ColMd = 8;
const ColSm = 24;

export default class TemplateDownload extends React.Component {

    state = {
        isLoading: false,
        optionsList: [],
        indeterminate: true,
        checkAll: false,
    };

    componentDidMount() {
        this._commonFavoriteFileList();
    }

    _commonFavoriteFileList = () => {
        if (!this.state.isLoading) {
            this.setState({isLoading: true});
        }
        request(api.commonFavoriteFileList, {}, 'get', session.get('token'))
            .then(res => {
                if (res.success && res.data && res.data.length > 0) {
                    this.setState({optionsList: res.data});
                } else {
                    if (res.message) {
                        message.warn(res.message);
                    } else {
                        message.warn('请求失败');
                    }
                }
                this.setState({isLoading: false});
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({isLoading: false});
            });
    };

    _onDownPress = (downloadUrl) => {
        const triggerDelay = 100;
        const removeDelay = 1000;
        if (!downloadUrl) {
            return;
        }
        let item = {downloadUrl};
        this._createIFrame(item, triggerDelay, removeDelay);
    };


    _createIFrame = (item, triggerDelay, removeDelay) => {
        setTimeout(() => {
            const iFrame = document.createElement('iframe');
            iFrame.style.display = 'none';
            iFrame.src = item.downloadUrl;
            document.body.appendChild(iFrame);
            setTimeout(() => {
                document.body.removeChild(iFrame);
            }, removeDelay);
        }, triggerDelay);
    };


    render() {
        const {optionsList} = this.state;
        return (
            <div className='table-list'>
                <Card bordered={false}>
                    <h1>文档模板下载</h1>
                    <Spin spinning={this.state.isLoading}>
                        <div style={{width: '100%'}}>
                            <Form layout='inline' className='ant-form-my padding15'>
                                <Row style={{width: '100%'}}>
                                    {
                                        optionsList.length > 0 &&
                                        optionsList.map((item, index) => {
                                            const {downloadUrl, fileName} = item;
                                            return (
                                                <Col sm={ColSm} md={ColMd} span={8} key={`optionsList_key${index}`}>
                                                    <div
                                                        className='downLoad-div'
                                                        onClick={() => this._onDownPress(downloadUrl)}>
                                                        {fileName}
                                                    </div>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </Form>
                        </div>
                    </Spin>
                </Card>
            </div>
        )
    }
}
