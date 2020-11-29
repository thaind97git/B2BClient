import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  Fragment
} from 'react';
import { Table, Input, Button, Popconfirm, Form, Row } from 'antd';
import { displayCurrency } from '../utils';
import QuotationDisplayComponent from './Utils/QuotationDisplayComponent';
import { connect } from 'react-redux';
import {
  SupplierRegisterProductResetter,
  SupplierUpdateQuotationResetter
} from '../stores/SupplierState';
const EditableContext = React.createContext();

const connectToRedux = connect(null, (dispatch) => ({
  resetData: () => {
    dispatch(SupplierUpdateQuotationResetter);
    dispatch(SupplierRegisterProductResetter);
  }
}));

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      values.price = parseInt(values.price);
      console.log(values);
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`
          }
        ]}
      >
        <Input type="number" ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const formatQuotation = (arrayQuotation = []) => {
  let result = [];
  if (arrayQuotation.length > 0) {
    result = arrayQuotation.map((quotation) => ({
      quantity: +quotation.quantity,
      price: +quotation.price
    }));
  }
  return result;
};

const SupplierProductOptionComponent = ({
  onGetQuotation,
  unitLabel,
  defaultQuotation = [],
  resetData
}) => {
  const [dataSource, setDataSource] = useState(
    defaultQuotation.map((quo, index) => ({
      quantity: quo.quantity,
      key: defaultQuotation.key || index,
      price: quo.price
    }))
  );

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  const columns = [
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      editable: true,
      width: '40%',
      render: (text) => {
        return text + ` ${unitLabel || ''}`;
      }
    },
    {
      title: 'Unit Price',
      dataIndex: 'price',
      editable: true,
      width: '40%',
      render: (text) => {
        return displayCurrency(text);
      }
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (text, record) => {
        return dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null;
      }
    }
  ];

  const handleDelete = (key) => {
    const newDataSource = [...dataSource];
    const newData = newDataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    typeof onGetQuotation === 'function' &&
      onGetQuotation(formatQuotation(newData));
  };
  const handleAdd = () => {
    const newData = {
      key: new Date().getTime() + '',
      quantity: '1',
      price: '0'
    };
    setDataSource([...dataSource, newData]);
    typeof onGetQuotation === 'function' &&
      onGetQuotation(formatQuotation([...dataSource, newData]));
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
    typeof onGetQuotation === 'function' &&
      onGetQuotation(formatQuotation(newData));
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  };
  const columnsTable = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave
      })
    };
  });
  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16
        }}
      >
        Add an quotation
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columnsTable}
        pagination={false}
      />
      {!!dataSource && (
        <Fragment>
          Display for Aggregator:
          <Row dir="row" style={{ marginTop: 12 }}>
            {dataSource.map((data, index) => {
              return (
                <QuotationDisplayComponent
                  key={index}
                  quotation={data}
                  unitLabel={unitLabel}
                />
              );
            })}
          </Row>
        </Fragment>
      )}
    </div>
  );
};

export default connectToRedux(SupplierProductOptionComponent);
