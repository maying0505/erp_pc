import React from 'react';
import { Cascader } from 'antd';
import {request} from 'common/request/request.js'
import api from 'api'

class MyCascader extends React.Component {
 constructor(props) {
        super(props)
        this.state = {
          addr: {},
        }
  }
  componentDidMount(){ //预加载数据
    this.loadlists() //获取数据列表
  }
  loadlists(){
   
    if (session.get('_allAddr')) {
      this.setState({
          addr: JSON.parse(session.get('_allAddr'))
      })
    } else {
        request(api.addressLinkage,{},'get', session.get('token')) //地址联动数据获取
            .then(res => {
                console.log(JSON.stringify(res))
                this.setState({
                    addr: res
                })
                session.set('_allAddr',JSON.stringify(res))
               
            })
    }
  }
  selectAddress(value) {
    console.log(value);
  }

  render() {
    return (
      <Cascader options={this.state.addr} onChange={this.selectAddress.bind(this)}/>
    );
  }
}
export default MyCascader
