import React, { useState, useEffect, Fragment } from 'react';
import { Table, Button, Popconfirm, Form, Row, InputNumber, Space } from 'antd';
import { displayCurrency } from '../utils';
import QuotationDisplayComponent from './Utils/QuotationDisplayComponent';
import { connect } from 'react-redux';
import {
  SupplierRegisterProductResetter,
  SupplierUpdateQuotationResetter
} from '../stores/SupplierState';
const connectToRedux = connect(null, (dispatch) => ({
  resetData: () => {
    dispatch(SupplierUpdateQuotationResetter);
    dispatch(SupplierRegisterProductResetter);
  }
}));

const getRange = (quotations = [], quantity, key) => {
  let dataSource = quotations;
  if (key) {
    dataSource = dataSource.filter((quotation) => quotation.key !== key);
  }
  const min =
    dataSource.filter((quotation) => quotation.quantity >= quantity) || [];
  const max =
    dataSource.filter((quotation) => quotation.quantity < quantity) || [];
  const minSort = min.sort((a, b) => a.quantity - b.quantity);
  const maxSort = max.sort((a, b) => b.quantity - a.quantity);
  return {
    minSort,
    maxSort,
    minPrice: (minSort[0] || {}).price || 0,
    maxPrice: (maxSort[0] || {}).price || Infinity
  };
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  quotations = [],
  ...restProps
}) => {
  const [min, setMin] = useState();
  const [max, setMax] = useState();
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
          {dataIndex === 'price' ? (
            <InputNumber min={min} max={max} />
          ) : (
            <InputNumber
              onChange={(value) => {
                if (dataIndex === 'quantity') {
                  const { minPrice, maxPrice } = getRange(
                    quotations,
                    value,
                    record.key
                  );
                  setMin(minPrice);
                  setMax(maxPrice);
                  console.log({ minPrice, maxPrice });
                }
              }}
            />
          )}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
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
  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  const [form] = Form.useForm();
  const [data, setData] = useState(
    defaultQuotation.map((quo, index) => ({
      quantity: quo.quantity,
      key: defaultQuotation.key || index,
      price: quo.price
    }))
  );
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      quantity: '',
      price: '',
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
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = (key) => {
    const newDataSource = [...data];
    const newData = newDataSource.filter((item) => item.key !== key);
    setData(newData);
    typeof onGetQuotation === 'function' &&
      onGetQuotation(formatQuotation(newData));
  };

  const columns = [
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: '40%',
      editable: true,
      render: (text) => {
        return text + ` ${unitLabel || ''}`;
      }
    },
    {
      title: 'Price',
      dataIndex: 'price',
      width: '40%',
      editable: true,
      render: (text) => {
        return displayCurrency(text);
      }
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
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
          <Space>
            <a disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </a>
            {data.length >= 1 ? (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDelete(record.key)}
              >
                <a disabled={editingKey !== ''}>Delete</a>
              </Popconfirm>
            ) : null}
          </Space>
        );
      }
    }
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
  const handleAdd = () => {
    const { minPrice } = getRange(data, 1);
    const newData = {
      key: new Date().getTime() + '',
      quantity: 1,
      price: minPrice + 1000
    };
    setData([...data, newData]);
    typeof onGetQuotation === 'function' &&
      onGetQuotation(formatQuotation([...data, newData]));
  };
  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16
        }}
      >
        Add a quotation
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: (props) => <EditableCell quotations={data} {...props} />
            }
          }}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={data}
          columns={mergedColumns}
          pagination={false}
        />
      </Form>
      {!!data && (
        <Fragment>
          Display for Aggregator:
          <Row dir="row" style={{ marginTop: 12 }}>
            {data.map((data, index) => {
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

// import React, {
//   useContext,
//   useState,
//   useEffect,
//   useRef,
//   Fragment
// } from 'react';
// import { Table, Input, Button, Popconfirm, Form, Row, InputNumber } from 'antd';
// import { displayCurrency } from '../utils';
// import QuotationDisplayComponent from './Utils/QuotationDisplayComponent';
// import { connect } from 'react-redux';
// import {
//   SupplierRegisterProductResetter,
//   SupplierUpdateQuotationResetter
// } from '../stores/SupplierState';
// const EditableContext = React.createContext();

// const connectToRedux = connect(null, (dispatch) => ({
//   resetData: () => {
//     dispatch(SupplierUpdateQuotationResetter);
//     dispatch(SupplierRegisterProductResetter);
//   }
// }));

// const EditableRow = ({ index, ...props }) => {
//   const [form] = Form.useForm();
//   return (
//     <Form form={form} component={false}>
//       <EditableContext.Provider value={form}>
//         <tr {...props} />
//       </EditableContext.Provider>
//     </Form>
//   );
// };

// const EditableCell = ({
//   title,
//   editable,
//   children,
//   dataIndex,
//   record,
//   handleSave,
//   dataSource,
//   ...restProps
// }) => {
//   const [editing, setEditing] = useState(false);
//   const [minValue, setMinValue] = useState(0);
//   const [maxValue, setMaxValue] = useState();
//   const [currentQuantity, setCurrentQuantity] = useState(1);
//   const inputRef = useRef();
//   const form = useContext(EditableContext);

//   const getRange = (quotations = [], quantity) => {
//     const min =
//       quotations.filter((quotation) => quotation.quantity > quantity) || [];
//     const max =
//       quotations.filter((quotation) => quotation.quantity < quantity) || [];
//     const minSort = min.sort((a, b) => a.quantity - b.quantity);
//     const maxSort = max.sort((a, b) => b.quantity - a.quantity);
//     return {
//       minSort,
//       maxSort,
//       minPrice: (minSort[0] || {}).price || 0,
//       maxPrice: (maxSort[0] || {}).price || Infinity
//     };
//   };

//   useEffect(() => {
//     if (editing) {
//       inputRef.current.focus();
//     }
//   }, [editing]);

//   const toggleEdit = () => {
//     setEditing(!editing);
//     form.setFieldsValue({
//       [dataIndex]: record[dataIndex]
//     });
//   };

//   const save = async () => {
//     setCurrentQuantity(record.quantity);
//     const { minPrice, maxPrice } = getRange(dataSource, record.quantity);
//     console.log({ minPrice, maxPrice });
//     setMaxValue(maxPrice);
//     setMinValue(minPrice);
//     try {
//       console.log({ record });
//       const values = await form.validateFields();
//       values.price = parseInt(values.price);
//       console.log(values);
//       if (!!values.quantity) {
//         setCurrentQuantity(values.quantity);
//       } else {
//         setCurrentQuantity(0);
//       }
//       toggleEdit();
//       console.log(getRange(dataSource, (record || {}).quantity));
//       handleSave({ ...record, ...values });
//     } catch (errInfo) {
//       console.log('Save failed:', errInfo);
//     }
//   };

//   let childNode = children;
//   const checkPrice = (rule, value, x, y) => {
//     console.log({ minValue, maxValue, rule, value, x, y });
//     if (value && value.price > 1000) {
//       return Promise.resolve();
//     }

//     return Promise.reject('Price must be greater than zero!');
//   };
//   if (editable) {
//     childNode = editing ? (
//       <Form.Item
//         style={{
//           margin: 0
//         }}
//         name={dataIndex}
//         rules={[
//           {
//             required: true,
//             message: `${title} is required.`
//           },
//           {
//             validator: checkPrice
//           }
//         ]}
//       >
//         <InputNumber
//           style={{ width: '100%' }}
//           // type="number"
//           // min={getRange(dataSource, (record || {}).quantity).max.price}
//           // max={getRange(dataSource, (record || {}).quantity).min.price}
//           ref={inputRef}
//           onPressEnter={save}
//           onBlur={save}
//         />
//       </Form.Item>
//     ) : (
//       <div
//         className="editable-cell-value-wrap"
//         style={{
//           paddingRight: 24
//         }}
//         onClick={toggleEdit}
//       >
//         {children}
//       </div>
//     );
//   }

//   return <td {...restProps}>{childNode}</td>;
// };

// const formatQuotation = (arrayQuotation = []) => {
//   let result = [];
//   if (arrayQuotation.length > 0) {
//     result = arrayQuotation.map((quotation) => ({
//       quantity: +quotation.quantity,
//       price: +quotation.price
//     }));
//   }
//   return result;
// };

// const SupplierProductOptionComponent = ({
//   onGetQuotation,
//   unitLabel,
//   defaultQuotation = [],
//   resetData
// }) => {
//   const [dataSource, setDataSource] = useState(
//     defaultQuotation.map((quo, index) => ({
//       quantity: quo.quantity,
//       key: defaultQuotation.key || index,
//       price: quo.price
//     }))
//   );

//   useEffect(() => {
//     return () => {
//       resetData();
//     };
//   }, [resetData]);

//   const columns = [
//     {
//       title: 'Quantity',
//       dataIndex: 'quantity',
//       editable: true,
//       width: '40%',
//       render: (text) => {
//         return text + ` ${unitLabel || ''}`;
//       }
//     },
//     {
//       title: 'Unit Price',
//       dataIndex: 'price',
//       editable: true,
//       width: '40%',
//       render: (text) => {
//         return displayCurrency(text);
//       }
//     },
//     {
//       title: 'Operation',
//       dataIndex: 'operation',
//       render: (text, record) => {
//         return dataSource.length >= 1 ? (
//           <Popconfirm
//             title="Sure to delete?"
//             onConfirm={() => handleDelete(record.key)}
//           >
//             <a>Delete</a>
//           </Popconfirm>
//         ) : null;
//       }
//     }
//   ];

//   const handleDelete = (key) => {
//     const newDataSource = [...dataSource];
//     const newData = newDataSource.filter((item) => item.key !== key);
//     setDataSource(newData);
//     typeof onGetQuotation === 'function' &&
//       onGetQuotation(formatQuotation(newData));
//   };
//   const handleAdd = () => {
//     const newData = {
//       key: new Date().getTime() + '',
//       quantity: '1',
//       price: 0
//     };
//     setDataSource([...dataSource, newData]);
//     typeof onGetQuotation === 'function' &&
//       onGetQuotation(formatQuotation([...dataSource, newData]));
//   };
//   const handleSave = (row) => {
//     const newData = [...dataSource];
//     const index = newData.findIndex((item) => row.key === item.key);
//     const item = newData[index];
//     newData.splice(index, 1, { ...item, ...row });
//     setDataSource(newData);
//     typeof onGetQuotation === 'function' &&
//       onGetQuotation(formatQuotation(newData));
//   };

//   const components = {
//     body: {
//       row: EditableRow,
//       cell: (props) => <EditableCell {...props} dataSource={dataSource} />
//     }
//   };
//   const columnsTable = columns.map((col) => {
//     if (!col.editable) {
//       return col;
//     }

//     return {
//       ...col,
//       onCell: (record) => ({
//         record,
//         editable: col.editable,
//         dataIndex: col.dataIndex,
//         title: col.title,
//         handleSave: handleSave
//       })
//     };
//   });
//   return (
//     <div>
//       <Button
//         onClick={handleAdd}
//         type="primary"
//         style={{
//           marginBottom: 16
//         }}
//       >
//         Add a quotation
//       </Button>
//       <Table
//         components={components}
//         rowClassName={() => 'editable-row'}
//         bordered
//         dataSource={dataSource}
//         columns={columnsTable}
//         pagination={false}
//       />
//       {!!dataSource && (
//         <Fragment>
//           Display for Aggregator:
//           <Row dir="row" style={{ marginTop: 12 }}>
//             {dataSource.map((data, index) => {
//               return (
//                 <QuotationDisplayComponent
//                   key={index}
//                   quotation={data}
//                   unitLabel={unitLabel}
//                 />
//               );
//             })}
//           </Row>
//         </Fragment>
//       )}
//     </div>
//   );
// };

// export default connectToRedux(SupplierProductOptionComponent);
