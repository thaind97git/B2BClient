import {
  Button,
  Form,
  InputNumber,
  Card,
  Row,
  Typography,
  Skeleton,
  Input,
  Divider
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getConfigSetting,
  GetConfigSettingData,
  updateConfigSetting,
  UpdateConfigSettingData
} from '../stores/SettingState';
const { Title } = Typography;
const connectToRedux = connect(
  createStructuredSelector({
    configSettingData: GetConfigSettingData,
    updateConfigSetting: UpdateConfigSettingData
  }),
  (dispatch) => ({
    getConfigSetting: () => dispatch(getConfigSetting()),
    updateConfigSetting: (values) => dispatch(updateConfigSetting(values))
  })
);

const AdminConfigSettingComponent = ({
  configSettingData,
  getConfigSetting,
  updateConfigSetting
}) => {
  const [minTimeOutOfDate, setMinTimeOutOfDate] = useState({});
  const [minTimeStartAuction, setMinTimeStartAuction] = useState({});
  useEffect(() => {
    getConfigSetting();
  }, [getConfigSetting]);

  useEffect(() => {
    if (!!configSettingData) {
      setMinTimeOutOfDate(configSettingData?.minOutOfDateTime);
      setMinTimeStartAuction(configSettingData?.minStartAuctionTime);
    }
  }, [configSettingData]);

  let initValues = {};
  if (configSettingData) {
    initValues.maxPrice = configSettingData?.maxPrice;
    initValues.maxQuantity = configSettingData?.maxQuantity;
    initValues.minPrice = configSettingData?.minPrice;
    initValues.minQuantity = configSettingData?.minQuantity;
    initValues.minDayOutOfDateTime = configSettingData?.minOutOfDateTime.days;
    initValues.minHourOutOfDateTime = configSettingData?.minOutOfDateTime.hours;
    initValues.minMinuteOutOfDateTime =
      configSettingData?.minOutOfDateTime.minutes;
    initValues.minDayStartAuctionTime =
      configSettingData?.minStartAuctionTime.days;
    initValues.minHourStartAuctionTime =
      configSettingData?.minStartAuctionTime.hours;
    initValues.minMinuteStartAuctionTime =
      configSettingData?.minStartAuctionTime.minutes;
  }
  if (!configSettingData) {
    return <Skeleton active />;
  }
  return (
    <Card
      title={
        <Row justify="space-between" align="middle">
          <Title level={4}>Configs Setting</Title>
        </Row>
      }
      style={{ width: '98%' }}
      bordered={false}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        layout="horizontal"
        initialValues={initValues}
        onFinish={(values) => {
          const configClone = { ...configSettingData };
          configClone.maxPrice = values.maxPrice;
          configClone.maxQuantity = values.maxQuantity;
          configClone.minPrice = values.minPrice;
          configClone.minQuantity = values.minQuantity;
          configClone.minOutOfDateTime.days = +values.minDayOutOfDateTime;
          configClone.minOutOfDateTime.hours = +values.minHourOutOfDateTime;
          configClone.minOutOfDateTime.minutes = +values.minMinuteOutOfDateTime;
          configClone.minStartAuctionTime.days = +values.minDayStartAuctionTime;
          configClone.minStartAuctionTime.hours = +values.minHourStartAuctionTime;
          configClone.minStartAuctionTime.minutes = +values.minMinuteStartAuctionTime;
          updateConfigSetting(configClone);
        }}
      >
        <Divider orientation="center" plain>
          <b>Request for Quotation</b>
        </Divider>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Max Quantity RFQ is required!'
            }
          ]}
          name="maxQuantity"
          label="Max Quantity RFQ"
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Min Quantity RFQ is required!'
            }
          ]}
          name="minQuantity"
          label="Min Quantity RFQ"
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Min Quantity RFQ is required!'
            }
          ]}
          name="maxPrice"
          label="Max Price RFQ"
        >
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/,*/g, '')}
            min={1}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Min Price RFQ is required!'
            }
          ]}
          name="minPrice"
          label="Min Price RFQ"
        >
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/,*/g, '')}
            min={1}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Divider orientation="center" plain>
          <span>
            Min time for Out Of Date:{' '}
            <b>
              {minTimeOutOfDate?.days} day<small>(s)</small> -{' '}
              {minTimeOutOfDate?.hours} hour<small>(s)</small> -{' '}
              {minTimeOutOfDate?.minutes} minute<small>(s)</small>
            </b>
          </span>
        </Divider>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Min day(s) for Out Of Date is required!'
            }
          ]}
          label="Min day(s)"
          name="minDayOutOfDateTime"
        >
          <Input
            onChange={(event) =>
              setMinTimeOutOfDate({
                ...minTimeOutOfDate,
                days: event.target.value
              })
            }
            type="number"
            suffix="Day(s)"
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Min hour(s) for Out Of Date is required!'
            }
          ]}
          label="Min hour(s)"
          name="minHourOutOfDateTime"
        >
          <Input
            onChange={(event) =>
              setMinTimeOutOfDate({
                ...minTimeOutOfDate,
                hours: event.target.value
              })
            }
            type="number"
            suffix="Hour(s)"
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Min minutes(s) for Out Of Date is required!'
            }
          ]}
          label="Min minute(s)"
          name="minMinuteOutOfDateTime"
        >
          <Input
            onChange={(event) =>
              setMinTimeOutOfDate({
                ...minTimeOutOfDate,
                minutes: event.target.value
              })
            }
            type="number"
            suffix="Minute(s)"
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>

        <Divider orientation="center" plain>
          <span>
            Min time for start Auction:{' '}
            <b>
              {minTimeStartAuction?.days} day<small>(s)</small> -{' '}
              {minTimeStartAuction?.hours} hour<small>(s)</small> -{' '}
              {minTimeStartAuction?.minutes} minute<small>(s)</small>
            </b>
          </span>
        </Divider>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Min day(s) for start auction time is required!'
            }
          ]}
          label="Min day(s)"
          name="minDayStartAuctionTime"
        >
          <Input
            onChange={(event) =>
              setMinTimeStartAuction({
                ...minTimeStartAuction,
                days: event.target.value
              })
            }
            type="number"
            suffix="Day(s)"
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Min hour(s) for start auction time is required!'
            }
          ]}
          label="Min hour(s)"
          name="minHourStartAuctionTime"
        >
          <Input
            onChange={(event) =>
              setMinTimeStartAuction({
                ...minTimeStartAuction,
                hours: event.target.value
              })
            }
            type="number"
            suffix="Hour(s)"
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Min minutes(s) for start auction time is required!'
            }
          ]}
          label="Min minute(s)"
          name="minMinuteStartAuctionTime"
        >
          <Input
            onChange={(event) =>
              setMinTimeStartAuction({
                ...minTimeStartAuction,
                minutes: event.target.value
              })
            }
            type="number"
            suffix="Minute(s)"
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>
        <Form.Item style={{ textAlign: 'end' }}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default connectToRedux(AdminConfigSettingComponent);
