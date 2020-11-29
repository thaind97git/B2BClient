import { Table, Typography } from 'antd';
import { displayCurrency } from '../utils';

const { Title } = Typography;

const columns = [
  {
    title: 'Product Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Total Quantity',
    dataIndex: 'totalQuantity',
    key: 'totalQuantity'
  },
  {
    title: 'Total Sales',
    dataIndex: 'totalPrice',
    key: 'totalPrice'
  }
];

const dataTable = [
  {
    key: '1',
    name: 'Product 1',
    totalQuantity: 50,
    totalPrice: displayCurrency(2500000)
  },
  {
    key: '2',
    name: 'Jim Green',
    totalQuantity: 42,
    totalPrice: displayCurrency(2400000)
  },
  {
    key: '3',
    name: 'Joe Black',
    totalQuantity: 32,
    totalPrice: displayCurrency(2300000)
  },
  {
    key: '4',
    name: 'Joe Black',
    totalQuantity: 32,
    totalPrice: displayCurrency(2200000)
  },
  {
    key: '5',
    name: 'Joe Black',
    totalQuantity: 32,
    totalPrice: displayCurrency(2100000)
  },
  {
    key: '6',
    name: 'Joe Black',
    totalQuantity: 32,
    totalPrice: displayCurrency(2000000)
  },
  {
    key: '7',
    name: 'Joe Black',
    totalQuantity: 32,
    totalPrice: displayCurrency(2000000)
  },
  {
    key: '8',
    name: 'Joe Black',
    totalQuantity: 32,
    totalPrice: displayCurrency(2000000)
  },
  {
    key: '9',
    name: 'Joe Black',
    totalQuantity: 32,
    totalPrice: displayCurrency(2000000)
  },
  {
    key: '10',
    name: 'Joe Black',
    totalQuantity: 32,
    totalPrice: displayCurrency(2000000)
  }
];

const LeaderboardProductSupplierComponent = () => {
  return (
    <Table
      bordered
      columns={columns}
      dataSource={dataTable}
      pagination={false}
    />
  );
};

export default LeaderboardProductSupplierComponent;
