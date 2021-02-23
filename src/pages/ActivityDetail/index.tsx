import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, InputNumber, Input, Radio, Select, message, Spin, DatePicker, Tooltip, Checkbox, Form} from 'antd'
import router from 'umi/router';
import { createBaseinfo, getMeetingDetail } from '@/service/cargoDetail'
import { encodeData, SKUConfig }  from './utils'
import  WangEditor  from '@/components/WangEditor'
import Utils from '@/utils/common';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { username } = Utils.Json2Obj(Utils.getCookie('userInfo'));
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

type IProps = {
  location: any
}

const Cargo: FC<IProps> = (props) => {

  const [form] = Form.useForm();
  const [loading, setloading] = useState(false);
  const [mode, setmode] = useState("");
  const [type, settype] = useState(1);
  const [meetInfo, setMeetInfo] = useState({});

  const refInput = React.useRef(null);

  useEffect(() => {
      const { query } = props.location
      const asyncOperate = async() => {
        setloading(true)
        if(query.type !== "create"){
          const res  = await getMeetingDetail({meetingId:query.id})
          if(res && res.returncode === 0){
          let data = JSON.parse(JSON.stringify(res))      
          const { data : { baseInfo } } = data
          baseInfo.beginTime = moment(baseInfo.beginTime, dateFormat)
          baseInfo.endTime = moment(baseInfo.endTime, dateFormat)
          form.setFieldsValue(baseInfo)
        }
        }
        setloading(false)
      }
      asyncOperate()

      setmode(query.type)
  }, []);

  const back = () => {
    router.goBack()
  }

  const submit = async() => {
    let data = form.getFieldsValue()
    data.beginTime =  moment(data.beginTime).format(dateFormat)
    data.endTime =  moment(data.endTime).format(dateFormat)
    const { location } = props

      try {
        if(mode === "edit"){
          const { query } = props.location
          data.id = query.id
          const res = await createBaseinfo(data)
          if(res.returncode === 0){
            message.success("编辑成功")
            // back()
          }
        }
        else{
        const res = await createBaseinfo(data)
        if(res.returncode === 0){
          message.success("创建成功")
          // back()
        }
      }
      }catch(err){
        message.error(err)
      }
  }

  const changeEditor = (e:any, type:string) => {
    if(type == "meet1"){
      setMeetInfo(e)
    }
  }

    return (
      <div className={styles.container}>
        <Spin spinning={loading}>
        <div className={styles.header}>
          <div className={styles.brumbs}>活动创建</div>
        </div>
        <div className={styles.body}>
        <Form 
        form={form} 
      >

        <Form.Item label="会议名称" name="meetingName" rules={[{ required: true}]}>
            <Input 
              placeholder="请输入会议名称"
            />
        </Form.Item>

        <Form.Item label="会议主办方" name="sponsor" rules={[{ required: true}]}>
            <Input 
              placeholder="请输入会议主办方"
            />
        </Form.Item>

        <Form.Item label="会议地址" name="address" rules={[{ required: true}]}>
            <Input 
              placeholder="请输入会议地址"
            />
        </Form.Item>

        <Form.Item label="活动开始时间" name="beginTime">
          <DatePicker 
            showTime={{ format:'HH:mm:ss'}}
            />
        </Form.Item>

        <Form.Item label="活动开始时间" name="endTime">
          <DatePicker 
            showTime={{ format:'HH:mm:ss'}}
            />
        </Form.Item>

        {/* {hasSKUitems(type, "third_sku_id")?
          <Form.Item label="中台卡批次ID" name="third_sku_id" rules={[{ required: true}]}>
            <Input 
              disabled={edit || check}
              placeholder="请输入ID"
              onBlur={() => judgeCardInfo(false)}
            />
          </Form.Item>
        : null} */}

        </Form>

        <div>
        {/* <WangEditor 
          changeEditor={changeEditor}
          type="meet1"
            /> */}
        </div>
          <div className={styles.btnGroup}>
             <Button onClick={back} className={styles.cancel}>返回</Button>
             <Button onClick={submit} className={styles.submit} type="primary">保存</Button>
          </div>
        </div>
        </Spin>
      </div>
    )
}

export default Cargo
