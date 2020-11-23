import { Table } from 'antd';

const columns = [
  {
    title: 'Product Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Total RFQ',
    dataIndex: 'totalRfq',
    key: 'totalRfq'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  }
];

const dataTable = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
];

const LeaderboardSupplierComponent = () => {
  return <Table columns={columns} dataSource={dataTable} />;
};

export default LeaderboardSupplierComponent;
