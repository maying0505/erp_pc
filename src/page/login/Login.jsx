import React from 'react'
import {Form, Input, Button, Icon, Spin, message, Divider, Modal} from 'antd'

const FormItem = Form.Item;
const createForm = Form.create;
import DocumentTitle from 'react-document-title'
import './index.scss'
import {hashHistory} from 'react-router'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import api from 'api';
import loginTitle from './login_title.png';
import loginIcon from './login_icon.png';

const DownLoadQrcodeUrl = 'https://sys.dezhierp.com/android/qrcode.jpg';

import LodashDebounce from 'common/util/debounce';

@createForm()
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        this.onKeyPressLogin = this.onKeyPressLogin.bind(this);
    }

    componentDidMount() {
        this.setState({loading: false});
        session.removeAll()
    }

    login = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({loading: true});
            request(`${api.login}?username=${values.userName}&password=${values.password}&mobileLogin=true`, {}, 'post')
                .then(res => {
                    this.setState({loading: false});
                    if (res.success) {
                        console.log('login data', res);
                        session.set('isLogin', true);
                        session.set('userInfo', res.data.loginName);
                        session.set('userName', res.data.name);
                        session.set('userAvatar', res.data.photo);
                        session.set('officeName', res.data.office.name);
                        session.set('companyName', res.data.company.name);
                        session.set('userId', res.data.id);
                        res.data3 ? session.set('token', res.data3) : session.set('token', '')
                        if (res.data2) {
                            if (res.data2.length === 0) {
                                hashHistory.push('/home');
                                session.set('menuInfo', []);
                                return
                            }
                            const curMenu = `/${res.data4[0].children[0].href}`;
                            console.log('curMenu', curMenu);
                            session.set('menuInfo', res.data4);
                            session.set('curMenu', curMenu);
                            hashHistory.push(curMenu);
                        } else {
                            session.set('menuInfo', [])
                        }
                    } else {
                        message.error(res.message)
                    }
                })
                .catch(err => {
                    this.setState({loading: false});
                    console.log('err', err);
                })
        })
    };

    onKeyPressLogin(event) {
        if (event.which === 13) {
            this.login();
        }
    }

    _onLoginNew = LodashDebounce(this.login);

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="login-page">
                {/*<DocumentTitle title="德智金服"/>*/}
                <div className="login-box">
                    <img className="welcome" src={loginTitle} alt='欢迎登陆'/>
                    <Spin spinning={this.state.loading} size="large">
                        <Form className="login-form my-login" onKeyPress={this.onKeyPressLogin}>
                            <FormItem>
                                {getFieldDecorator('userName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入账户名'
                                        }
                                    ],
                                })(
                                    <Input
                                        addonBefore={<Icon type='user' style={{fontSize: 20}}/>}
                                        placeholder="请输入账户"
                                    />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入密码'
                                        }
                                    ],
                                })(
                                    <Input
                                        addonBefore={<Icon type='lock' style={{fontSize: 20}}/>}
                                        autoComplete="off"
                                        type="password"
                                        placeholder="请输入密码"
                                    />
                                )}
                            </FormItem>
                            <Button
                                className='green-style'
                                type="primary"
                                onClick={this._onLoginNew}
                            >
                                登录
                            </Button>
                            <div className='lq'>
                                <div>
                                    <img className='logo' src={loginIcon} alt='德智金服'/>
                                </div>
                                <Divider type='vertical' style={{height: '50px'}}/>
                                <div className='dwl'>
                                    <img className='qrc' src={DownLoadQrcodeUrl} alt='下载App地址'/>
                                    <div style={{color: 'white'}}>扫码下载App</div>
                                    <img className='qrcL' src={DownLoadQrcodeUrl} alt='下载App地址'/>
                                </div>
                            </div>
                        </Form>


                    </Spin>
                </div>
            </div>
        )
    }
}

export default Login
