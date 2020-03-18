import React from 'react'
import PropTypes from 'prop-types'
import { Spin, Row, message, Button, Divider } from 'antd';
import PicturesWall from 'component/img-upload'

class SubscriptionInfo extends React.Component {
    static propTypes = {
        pictureDataJson: PropTypes.object.isRequired,
    };
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            pictureDataJson: [],
        }
    }
    componentDidMount(){ //预加载数据
        if (this.props.pictureDataJson) {
            this.setState({
                pictureDataJson: this.props.pictureDataJson,
            },function(){
                this.setState({loading: false})
            })
        }   
    }
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        console.log(nextProps)
        if (nextProps.pictureDataJson !== this.state.pictureDataJson) {
            this.setState({
                pictureDataJson: nextProps.pictureDataJson,
            })
        }       
    }
    handleFormBack(){
        window.history.back()
    }
    render() {
        return(
            <Spin spinning={this.state.loading} size="large">
                <Row style={{width: '100%'}} >
                    <div className="show padding15">
                        <div className="white-title">
                            <p>风控措施执行情况：</p>
                            <Divider/>
                        </div>
                        <PicturesWall defaultFileList={this.state.pictureDataJson.situationDefaultJson} disabled={true}/>
                    </div>
                    <div className="show padding15">
                        <div className="white-title">
                            <p>签约资料：</p>
                            <Divider/>
                        </div>
                        <PicturesWall defaultFileList={this.state.pictureDataJson.signedDefaultJson} disabled={true}/>
                    </div>
                    <div className="show padding15">
                        <div className="white-title">
                            <p>其他资料：</p>
                            <Divider/>
                        </div>
                        <PicturesWall defaultFileList={this.state.pictureDataJson.otherDetailsDefaultJson} disabled={true}/>
                    </div>                    
                </Row>
                <div className="col-interval"><Button className="default-btn" style={{ float: 'left' }} onClick={this.handleFormBack}>返回</Button></div>
            </Spin>
        )
    }
}
export default SubscriptionInfo