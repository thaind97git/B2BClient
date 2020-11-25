import { Table } from 'antd';

const columns = [
  {
    title: 'Buyer Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Total RFQ',
    dataIndex: 'totalRfq',
    key: 'totalRfq'
  }
];

const dataTable = [
  {
    key: '1',
    name: 'Buyer 1',
    totalRfq: 52
  },
  {
    key: '2',
    name: 'Buyer 2',
    totalRfq: 42
  },
  {
    key: '3',
    name: 'Buyer 3',
    totalRfq: 42
  },
  {
    key: '4',
    name: 'Buyer 4',
    totalRfq: 32
  },
  {
    key: '5',
    name: 'Buyer 5',
    totalRfq: 32
  },
  {
    key: '6',
    name: 'Buyer 6',
    totalRfq: 22
  },
  {
    key: '7',
    name: 'Buyer 7',
    totalRfq: 21
  },
  {
    key: '8',
    name: 'Buyer 8',
    totalRfq: 20
  },
  {
    key: '9',
    name: 'Buyer 9',
    totalRfq: 10
  },
  {
    key: '10',
    name: 'Buyer 10',
    totalRfq: 5
  }
];

const LeaderboardBuyerComponent = () => {
  return (
    <Table
      pagination={false}
      bordered
      columns={columns}
      dataSource={dataTable}
    />
  );
};

export default LeaderboardBuyerComponent;
