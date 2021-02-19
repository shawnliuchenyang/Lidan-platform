import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, InputNumber, Input, Radio, Select, message, Spin, DatePicker, Tooltip, Checkbox, Form} from 'antd'
import router from 'umi/router';
import { queryCard, createSku, updateSkuDetail } from '@/service/cargoDetail'
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
      // const { query } = props.location
      // const asyncOperate = async() => {
      //   const citys = await getAllCity()
      //   const cityList = []
      //   for (var group in citys.data.data){
      //     cityList.push(citys.data.data[group]);
      //   }

      //   setcitys(cityList)
      //   if(query.type !== "create"){
      //     const { data } = await getSdkInfo({id:query.id})
      //     if(data){
      //     let res = JSON.parse(JSON.stringify(data))
      //     res.dateRange = [moment(res.enable_time, dateFormat),moment(res.expire_time, dateFormat)]
      //     settype(data.type)
      //     if(data.type == 1){
      //       setalgorithm_switch(data.algorithm_switch)

      //       // 默认返回-1 表示没有设置过算法策略
      //       setpromotion_disabled(data.promotion_stock !== -1)
      //       res = {
      //         ...res,
      //         card_label: res.sku_info.card_label,
      //         rights_tags: res.sku_info.rights_tags,
      //         price: res.price/100,
      //         tags: { 
      //           tag_id: query.type == "copy" ? "": res.sku_info.tag_id,
      //           tag_desc: query.type == "copy" ? "":  res.sku_info.tag_desc
      //          },
      //         area: res.area?JSON.parse(res.area):[],
      //         promotion_stock: res.promotion_stock == -1? "": res.promotion_stock,
      //         promotion_purchase_limit: res.promotion_purchase_limit == -1? "": res.promotion_purchase_limit
      //       }
      //     }

      //     if(data.type == 101){
      //       res = {
      //         ...res,
      //         price: res.price/100,
      //         rights_tags: res.sku_info.rights_tags,
      //         spend_times_limit: res.sku_info.spend_times_limit,
      //         tags: { 
      //           tag_id: query.type == "copy" ? "": res.sku_info.tag_id,
      //           tag_desc: query.type == "copy" ? "":  res.sku_info.tag_desc
      //          },
      //         area: res.area?JSON.parse(res.area):[],
      //       }
      //     }

      //     if(data.type == 102){
      //       res = {
      //         ...res,
      //         open_limit: res.sku_info.open_limit,
      //         spend_times_limit: res.sku_info.spend_times_limit,
      //         over_time_limit: res.sku_info.over_time_limit/60,
      //         compensate_fee_limit: res.sku_info.compensate_fee_limit/100,
      //       }
      //     }
          
      //     form.setFieldsValue(res)
      //   }
      //   }
      // }
      // asyncOperate()
      // setmode(query.type)
  }, []);

  const  handleChange = (type:string, value:any) => {

  }

  const back = () => {
    router.goBack()
  }

  const submit = async() => {
    const data = form.getFieldsValue()
    const { location } = props
    
    if(mode === "create" || mode === "copy"){
      const params = encodeData(data, mode)

      try {
        const res = await createSku(params)
        if(res.errno === 0){
          message.success("创建成功")
          back()
        }
      }catch(err){
        message.error(err)
      }
    }

    if(mode === "edit"){
      const { id } = location.query
      const params = encodeData(data, mode, id)
      try {
        const res = await updateSkuDetail(params)

        if(res.errno === 0){
          message.success("更新成功")
          back()
        }
      }catch(err){
        message.error(err)
      }
    }
  }

  const changeEditor = (e:any, type:string) => {
    if(type == "meet1"){
      setMeetInfo(e)
    }
  }


  console.log('meetinfo', meetInfo)
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.brumbs}>活动创建</div>
        </div>
        <div className={styles.body}>
        {
            true && <div onClick={() => console.log(encodeData(form.getFieldsValue(), mode))}>获取值</div>
        }
        <Form 
        form={form} 
      >

        <Form.Item label="活动名称" name="name" rules={[{ required: true}]}>
            <Input 
              placeholder="活动名称"
            />
        </Form.Item>

        <Form.Item label="活动形式" name="type" rules={[{ required: true}]}>
            <Select>
            <Option key={1} value={1}>{"线上活动"}</Option>
            <Option key={2} value={2}>{"线下活动"}</Option>
            <Option key={2} value={3}>{"混合活动"}</Option>
            </Select>
        </Form.Item>

        <Form.Item label="活动城市" name="city" rules={[{ required: true}]}>
            <Select>
              <Option key={1} value={1}>{"北京"}</Option>
              <Option key={2} value={2}>{"成都"}</Option>
            </Select>
        </Form.Item>

        <Form.Item label="活动地点" name="place" rules={[{ required: true}]}>
        <Input 
              placeholder="请输入活动地点"
            />
        </Form.Item>

        <Form.Item label="活动预算" name="budget" rules={[{ required: true}]}>
        <InputNumber 
              placeholder="请输入活动预算"
            />
        </Form.Item>

        <Form.Item label="活动有效期" name="dateRange">
          <RangePicker 
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
        <WangEditor 
          changeEditor={changeEditor}
          type="meet1"
            />
        </div>
          <div className={styles.btnGroup}>
             <Button onClick={back} className={styles.cancel}>返回</Button>
             <Button onClick={submit} className={styles.submit} type="primary">保存</Button>
          </div>
        </div>
      </div>
    )
}

export default Cargo
