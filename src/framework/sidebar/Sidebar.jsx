import React from 'react'
import {browserHistory, Link} from 'react-router'
import {Menu, Icon, Switch, Layout} from 'antd';

const SubMenu = Menu.SubMenu;
import FAIcon from 'component/faicon'
import './index.scss'
import {local, session} from 'common/util/storage.js'

import loanPng from './loan.png';
import checkPng from './check.png';
import financePng from './finance.png';
import loanAfterPng from './loanAfter.png';
import recheckPng from './recheck.png';
import signPngPng from './sign.png';
import filePng from './file.png';
import calculatorPng from './calculator.png';
import searchPng from './search.png';
import zip from './zip.png';
import statistics from './statistics.png';
import oastatis from './oastatis.png';
import reimburse from './reimburse.png';
import {hashHistory} from 'react-router'


const afterLoanChildren = [
    {
        "name": "到期提醒",
        "href": "after-the-loan/expiration-reminding",
    },
    {
        "name": "逾期催收",
        "href": "after-the-loan/overdue-collect",
    },
    {
        "name": "还款列表",
        "href": "after-the-loan/repayments-list",
    }
];
const searchChildren = [
    {
        "name": "案件列表",
        "href": "search",
    },
    {
        "name": "还款列表",
        "href": "search/repayments-list",
    },
];
const reimburseChildren = [
    {
        "name": "我申请的",
        "href": "/reimburse/apply-list",
    },
    {
        "name": "待我审核",
        "href": "/reimburse/verify-list",
    },
    {
        "name": "我已审核",
        "href": "/reimburse/verified-list",
    },
];

const exportList = [
    {
        "name": "报销列表",
        "href": "/reimburse/export-list",
    },
];

const TabColor = '#5b70e9';
const TapType = [
    {id: 0, label: '业务'},
    {id: 1, label: '办公'}
];

class TabItem extends React.Component {
    render() {
        const {label, backgroundColor, id, onClick} = this.props;
        return (
            <div
                style={{
                    color: 'white',
                    fontSize: '16px',
                    padding: '15px 0',
                    flex: 1,
                    textAlign: 'center',
                    backgroundColor: backgroundColor
                }}
                onClick={() => onClick(id)}
                key={id}
            >
                {label}
            </div>
        )
    }
}

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUrl: '',
            tapSelectedIndex: TapType[0].id,
            tapOneCurrentUrl: '',
            tapTwoCurrentUrl: '',
        }
    }

    componentDidMount() { //预加载数据
        const cUrl = session.get('curMenu');
        const tabIndex = session.get('tabIndex');
        let {currentUrl, tapSelectedIndex} = this.state;
        if (cUrl) {
            currentUrl = cUrl;
        }
        if (tabIndex) {
            tapSelectedIndex = tabIndex;
        }
        this.setState({
            currentUrl,
            tapSelectedIndex,
        });
    }

    componentWillUnmount() {
        this.webSocket && this.webSocket.close();
    }

    _getItemIconByCode = (code) => {
        switch (code) {
            case 'enter': {
                return loanPng;
            }
            case 'risk_control': {
                return checkPng;
            }
            case 'sign': {
                return signPngPng;
            }
            case 'recheck': {
                return recheckPng;
            }
            case 'loan': {
                return financePng;
            }
            case 'tags': {
                return loanAfterPng;
            }
            case 'calculator': {
                return calculatorPng;
            }
            case 'file': {
                return filePng;
            }
            case 'search': {
                return searchPng;
            }
            case 'zip': {
                return zip;
            }
            case 'statistics': {
                return statistics;
            }
            case 'oastatis': {
                return oastatis;
            }
            case 'reimburse': {
                return reimburse;
            }
            default: {
                return financePng;
            }

        }
    };

    convertSidebarMenu(menuData) {
        return menuData.map((val) => {
            // if (val.children) {
            if (val.children && val.children.length > 0) {
                return (
                    <SubMenu
                        selectable={false}
                        key={'/' + val.href}
                        title={
                            <span>
                                    <img className={'sidebar-menu-icon-size'}
                                         src={this._getItemIconByCode(val.code)}
                                         alt={val.name}/>
                                    <span>{val.name}</span>
                                </span>
                        }
                    >
                        {
                            this.getSubMenu(val.children)
                        }
                    </SubMenu>
                )

            } else {
                return (
                    <Menu.Item key={'/' + val.href}>
                        <Link to={val.href}>
                            {val.target &&
                            <img className={'sidebar-menu-icon-size'}
                                 src={this._getItemIconByCode(val.code)}
                                 alt={val.name}
                            />
                            }
                            <span>{val.name}</span>
                        </Link>
                    </Menu.Item>
                )

            }
        })
    }

    getSideBarMenu(tabType) {
        const menuData = this.props.menuData;
        if (tabType === TapType[0].id) {
            return this.convertSidebarMenu(menuData[0].children, 'yt_');
        }
        if (tabType === TapType[1].id) {
            return this.convertSidebarMenu(menuData[1].children, 'yt_');
        }
    }

    _onClick = (item) => {
        if (item.key === '/finance') {
            session.remove('FinanceSearchQueryObjKey');
        }
    };

    getSubMenu(menuData) {
        return menuData.map((val) => {
            return (
                <Menu.Item
                    key={'/' + val.href}
                    style={this.props.miniMode === true && {display: 'none', transition: 0.3}}
                    handleClick={this._onClick}
                >
                    <Link to={val.href}>
                        {/*{*/}
                        {/*val.target &&*/}
                        {/*<img*/}
                        {/*className={'sidebar-menu-icon-size'}*/}
                        {/*src={this._getItemIconByCode(val.code)}*/}
                        {/*alt={val.name}*/}
                        {/*/>*/}
                        {/*}*/}
                        <span style={{color: 'white'}}>{val.name}</span>
                    </Link>
                </Menu.Item>
            )
        });
    }

    // getMenuPath(menuData, pathName) {
    //     let menuPath = []
    //     let currentPath = pathName.split('/')

    //     function getPath(data, pathName, parentPath) {
    //         if (!data) return

    //         for (let i = 0; i < data.length; i++) {
    //             let path = parentPath.slice()
    //             path.push(data[i].path)
    //             if (data[i].path == pathName) {
    //                 menuPath = path
    //                 break
    //             } else {
    //                 getPath(data[i].children, pathName, path)
    //             }
    //         }
    //     }

    //     while (menuPath.length === 0 && currentPath.length > 1) {
    //         getPath(menuData, currentPath.join('/'), [])
    //         currentPath.pop()
    //     }

    //     // menuPath array     current array
    //     return {
    //         menuPath: menuPath.slice(0, menuPath.length - 1).map(v => 'yt_' + v),
    //         current: menuPath.slice(menuPath.length - 1, menuPath.length).map(v => 'yt_' + v)
    //     }
    // }
    handleSelectKey(item, key, selectedKeys) {
        this.setState({
            currentUrl: item.key
        });
        session.set('curMenu', item.key)
    }


    _onTapPress = (tapSelectedIndex) => {
        this.setState(preState => ({
            tapSelectedIndex: preState.tapSelectedIndex === tapSelectedIndex ? null : tapSelectedIndex
        }));
    };

    _getTabChild = () => {
        const {miniMode} = this.props;
        const {tapSelectedIndex} = this.state;
        if (miniMode) {
            const props = {
                label: TapType[tapSelectedIndex].label,
                backgroundColor: TabColor,
                id: tapSelectedIndex,
                onClick: this._onTabClick,
                key: id,
            };
            return <TabItem {...props} />;
        } else {
            return TapType.map(item => {
                const {id, label} = item;
                const props = {
                    label: label,
                    backgroundColor: tapSelectedIndex === id ? TabColor : null,
                    id: id,
                    onClick: this._onTabClick,
                    key: id,
                };
                return <TabItem {...props} />;
            });
        }
    };

    _onTabClick = (tabIndex) => {
        let {tapOneCurrentUrl, tapTwoCurrentUrl, currentUrl} = this.state;
        let {menuData} = this.props;
        if (tabIndex === TapType[0].id) {
            currentUrl = menuData[0].children[0].children ? `/${menuData[0].children[0].children[0].href}` : `/${menuData[0].children[0].href}`;
            tapOneCurrentUrl = currentUrl;
        } else if (tabIndex === TapType[1].id) {
            currentUrl = menuData[1].children[0].children ? `/${menuData[1].children[0].children[0].href}` : `/${menuData[1].children[0].href}`;
            tapTwoCurrentUrl = currentUrl;
        }

        session.set('curMenu', currentUrl);
        session.set('tabIndex', tabIndex);
        hashHistory.push(currentUrl);
        this.setState({
            currentUrl,
            tapOneCurrentUrl,
            tapTwoCurrentUrl,
            tapSelectedIndex: tabIndex,
        });
    };

    render() {
        const mode = 'inline';
        const {tapSelectedIndex} = this.state;
        const clsBase = 'block';
        const clsHide = 'none';
        const tabChild = this._getTabChild();
        return (
            <aside className="yt-admin-framework-sidebar">
                <div className="my-menu-tab">
                    {tabChild}
                </div>

                <div
                    style={{
                        display: tapSelectedIndex === TapType[0].id ? `${clsBase}` : `${clsHide}`
                    }}
                >
                    <Menu
                        theme="dark"
                        selectedKeys={[this.state.currentUrl]}
                        onSelect={this.handleSelectKey.bind(this)}
                        mode={mode}
                        defaultOpenKeys={['/after-the-loan/expiration-reminding']}
                        onClick={(item) => this._onClick(item)}
                    >
                        {this.getSideBarMenu(TapType[0].id)}
                    </Menu>
                </div>
                <div
                    style={{
                        display: tapSelectedIndex === TapType[1].id ? `${clsBase}` : `${clsHide}`
                    }}
                >
                    <Menu
                        theme="dark"
                        selectedKeys={[this.state.currentUrl]}
                        onSelect={this.handleSelectKey.bind(this)}
                        mode={mode}
                        defaultOpenKeys={['/reimburse']}
                        onClick={(item) => this._onClick(item)}
                    >
                        {this.getSideBarMenu(TapType[1].id)}
                    </Menu>
                </div>
            </aside>
        )
    }
}

export default Sidebar
