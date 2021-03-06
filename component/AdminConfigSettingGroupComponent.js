import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  addNewConfigGroupSetting,
  getConfigGroupSetting,
  GetConfigGroupSettingData,
  updateConfigGroupSetting,
  UpdateConfigGroupSettingData
} from '../stores/SettingState';
import {
  Table,
  Popconfirm,
  Form,
  Skeleton,
  InputNumber,
  Typography,
  Button,
  Row,
  Modal
} from 'antd';
import { displayCurrency } from '../utils';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let inputNode;
  if (dataIndex === 'fromPrice' || dataIndex === 'toPrice') {
    inputNode = (
      <InputNumber
        style={{ width: '100%' }}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value.replace(/,*/g, '')}
      />
    );
  } else if (dataIndex === 'minDifferencePercent') {
    inputNode = (
      <InputNumber
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value.replace(/,*/g, '')}
        min={0}
        max={100}
        style={{ width: '100%' }}
      />
    );
  } else {
    inputNode = (
      <InputNumber
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value.replace(/,*/g, '')}
        min={100}
        max={200}
        style={{ width: '100%' }}
      />
    );
  }
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const connectToRedux = connect(
  createStructuredSelector({
    configGroupSettingData: GetConfigGroupSettingData,
    updateConfigGroupSettingData: UpdateConfigGroupSettingData
  }),
  (dispatch) => ({
    getConfigGroupSetting: () => dispatch(getConfigGroupSetting()),
    updateConfigGroupSetting: (values) =>
      dispatch(updateConfigGroupSetting(values)),
    addNewConfigGroupSetting: (values, callback) =>
      dispatch(addNewConfigGroupSetting(values, callback))
  })
);

const getTableData = (data = []) => {
  return (
    data &&
    data.map((item) => {
      return {
        fromPrice: displayCurrency(item.fromPrice),
        toPrice: displayCurrency(item.toPrice),
        minDifferencePercent: `${item.minDifferencePercent} %`,
        maxDifferencePercent: `${item.maxDifferencePercent} %`,
        id: item.id,
        key: item.id
      };
    })
  );
};

const AdminConfigSettingGroupComponent = ({
  configGroupSettingData,
  updateConfigGroupSettingData,
  getConfigGroupSetting,
  updateConfigGroupSetting,
  addNewConfigGroupSetting
}) => {
  useEffect(() => {
    getConfigGroupSetting();
  }, [getConfigGroupSetting]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [openAdd, setOpenAdd] = useState(false);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    record.fromPrice = record.fromPrice?.replace(/,*/g, '').replace(/ đ*/g, '');
    record.toPrice = record.toPrice?.replace(/,*/g, '').replace(/ đ*/g, '');
    record.minDifferencePercent = record.minDifferencePercent
      ?.replace(/,*/g, '')
      .replace(/ %*/g, '');
    record.maxDifferencePercent = record.maxDifferencePercent
      ?.replace(/,*/g, '')
      .replace(/ %*/g, '');
    form.setFieldsValue({
      fromPrice: '',
      toPrice: '',
      minDifferencePercent: '',
      maxDifferencePercent: '',
      ...record
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      row.fromPrice = +row.fromPrice;
      row.toPrice = +row.toPrice;
      row.minDifferencePercent = +row.minDifferencePercent;
      row.maxDifferencePercent = +row.maxDifferencePercent;
      updateConfigGroupSetting({ ...row, id: key });
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const COLUMN = [
    {
      title: 'From Price',
      dataIndex: 'fromPrice',
      key: 'fromPrice',
      editable: true
    },
    {
      title: 'To Price',
      dataIndex: 'toPrice',
      key: 'toPrice',
      editable: true
    },
    {
      title: 'Min Margin Percentage',
      dataIndex: 'minDifferencePercent',
      key: 'minDifferencePercent',
      editable: true
    },
    {
      title: 'Max Margin Percentage',
      dataIndex: 'maxDifferencePercent',
      key: 'maxDifferencePercent',
      editable: true
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              onClick={() => save(record.key)}
              style={{
                marginRight: 8
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      }
    }
  ];
  const mergedColumns = COLUMN.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  if (!configGroupSettingData) {
    return <Skeleton active />;
  }

  return (
    <Form form={form} component={false}>
      <Modal
        title="Add new group config"
        visible={openAdd}
        onOk={() => {}}
        onCancel={() => setOpenAdd(false)}
        footer={false}
      >
        {openAdd ? (
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 12 }}
            layout="horizontal"
            onFinish={(values) => {
              console.log({ values });
              addNewConfigGroupSetting(values, () => {
                setOpenAdd(false);
              });
            }}
          >
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'From Price is required!'
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('toPrice') > value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('From must be less than To Price');
                  }
                })
              ]}
              name="fromPrice"
              label="From Price"
            >
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/,*/g, '')}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'To Price is required!'
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('fromPrice') < value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      'To Price must greater than From Price'
                    );
                  }
                })
              ]}
              name="toPrice"
              label="To Price"
            >
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/,*/g, '')}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Min Margin Percentage is required!'
                }
              ]}
              name="minDifferencePercent"
              label="Min Margin Percent"
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Max Margin Percentage is required!'
                }
              ]}
              name="maxDifferencePercent"
              label="Max Margin Percent"
            >
              <InputNumber min={100} max={200} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item style={{ textAlign: 'end' }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        ) : null}
      </Modal>
      <Row>
        <Button onClick={() => setOpenAdd(true)} type="primary">
          Add new config
        </Button>
      </Row>
      <br />
      <Table
        components={{
          body: {
            cell: EditableCell
          }
        }}
        bordered
        dataSource={getTableData(configGroupSettingData) || []}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel
        }}
      />
    </Form>
  );
};

export default connectToRedux(AdminConfigSettingGroupComponent);
