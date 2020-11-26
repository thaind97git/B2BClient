import { Table } from 'antd';
import { displayCurrency } from '../utils';

const columns = [
  {
    title: 'Supplier Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Total Order',
    dataIndex: 'totalOrder',
    key: 'totalOrder'
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
    name: 'Supplier 1',
    totalOrder: 32,
    totalPrice: displayCurrency(2700000)
  },
  {
    key: '2',
    name: 'Supplier 2',
    totalOrder: 42,
    totalPrice: displayCurrency(2600000)
  },
  {
    key: '3',
    name: 'Supplier 3',
    totalOrder: 32,
    totalPrice: displayCurrency(2500000)
  },
  {
    key: '1',
    name: 'Supplier 4',
    totalOrder: 32,
    totalPrice: displayCurrency(2400000)
  },
  {
    key: '2',
    name: 'Supplier 5',
    totalOrder: 42,
    totalPrice: displayCurrency(2300000)
  },
  {
    key: '3',
    name: 'Supplier 6',
    totalOrder: 32,
    totalPrice: displayCurrency(2200000)
  },
  {
    key: '1',
    name: 'Supplier 7',
    totalOrder: 32,
    totalPrice: displayCurrency(2000000)
  },
  {
    key: '2',
    name: 'Supplier 8',
    totalOrder: 42,
    totalPrice: displayCurrency(2000000)
  },
  {
    key: '3',
    name: 'Supplier 9',
    totalOrder: 32,
    totalPrice: displayCurrency(2000000)
  },
  {
    key: '3',
    name: 'Supplier 10',
    totalOrder: 32,
    totalPrice: displayCurrency(2000000)
  }
];

const LeaderboardSupplierComponent = () => {
  return (
    <Table
      bordered
      pagination={false}
      columns={columns}
      dataSource={dataTable}
    />
  );
};

export default LeaderboardSupplierComponent;
