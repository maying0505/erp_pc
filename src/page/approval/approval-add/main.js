import React from 'react';
import './index.scss';
import {Col, message, Row, Spin, Button} from 'antd';
import {ApplyListAsset as ass} from "../assets";
import {MyTitle, MyButton} from '../components';

import {request} from 'common/request/request';
import {session} from 'common/util/storage';
import api from 'common/util/api';
import ApprovalModal from '../approval-modal';


const ColConfig = {
    sm: 24,
    md: 6,
};

export default class Main extends React.Component {

    state = {
        isLoading: false,
        modalVisible: false,
        approvalArr: [],
        listId: null,
        title: '',

    };

    componentDidMount() {
        this._getAllApproval();
    }

    _getAllApproval = () => {
        this._setIsLoading(true);
        request(api.getAllApproval, {}, 'get', session.get('token'))
            .then(res => {
                let msg = '';
                let approvalArr = [];
                if (res.success) {
                    approvalArr = [...res.data];
                    msg = res.message ? res.message : '获取成功';
                } else {
                    msg = res.message ? res.message : '请求失败';
                }
                this.setState({
                    approvalArr,
                    isLoading: false,
                });
                message.info(msg);
            })
            .catch(err => {
                this._setIsLoading(false);
                message.error('请求服务异常');
            });
    };

    _setIsLoading = (value = false) => {
        this.setState({
            isLoading: value,
        });
    };

    _setModalVisible = (modalVisible, refresh) => {
        this.setState({
            modalVisible,
        });
    };

    _onPress = (title, listId) => {
        this.setState({
            title,
            listId,
            modalVisible: true,
        });
    };

    _renderApproval = () => {
        const {approvalArr} = this.state;
        let ele = [];
        approvalArr.forEach((item, index) => {
            const {type, typeName, list} = item;
            ele.push(
                <div className='title-view' style={{marginTop: '15px'}} key={`${index}`}>
                    <Row type='flex' justify='start' align='middle'>
                        <Col>
                            <MyTitle title={typeName} type='bar'/>
                        </Col>
                    </Row>
                </div>
            );
            if (list.length > 0) {
                ele.push(
                    <Row className='row-view' key={`list_key_${index}`}>
                        {
                            list.map((cItem, i) => {
                                return (
                                    <Col {...ColConfig} key={`${cItem.id}_${i}`}>
                                        <div
                                            className='btn-view'
                                            onClick={() => this._onPress(`${typeName}-${cItem.title}`, cItem.id)}
                                        >
                                            {cItem.title}
                                        </div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                );
            }
        });
        return ele;
    };

    render() {
        const {history} = this.props;
        const {isLoading, approvalArr, modalVisible, listId, title} = this.state;
        return (
            <Spin size='large' spinning={isLoading}>
                <div className='main-page'>
                    <div className='title-view'>
                        <Row type='flex' justify='space-between' align='middle'>
                            <Col>
                                <MyTitle title='新增申请' imgSrc={ass.img.titleIcon}/>
                            </Col>
                        </Row>
                    </div>
                    {approvalArr.length > 0 && this._renderApproval()}
                </div>
                <ApprovalModal
                    title={title}
                    operateType='add'
                    history={history}
                    listId={listId}
                    disabled={false}
                    modalVisible={modalVisible}
                    setModalVisible={(v, refresh) => this._setModalVisible(v, refresh)}
                />
            </Spin>
        )
    }
}
