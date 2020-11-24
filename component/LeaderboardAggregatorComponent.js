import { Table } from 'antd';
import { displayCurrency } from '../utils';

const columns = [
  {
    title: 'Aggregator Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Total RFQ',
    dataIndex: 'totalRfq',
    key: 'totalRfq'
  },
  {
    title: 'Total Group',
    dataIndex: 'totalGroup',
    key: 'totalGroup'
  },
  {
    title: 'Total Price',
    dataIndex: 'totalPrice',
    key: 'totalPrice'
  }
];

const dataTable = [
  {
    key: '1',
    name: 'Aggregator 1',
    totalRfq: 32,
    totalGroup: 3,
    totalPrice: displayCurrency(3000000)
  },
  {
    key: '2',
    name: 'Aggregator 2',
    totalRfq: 42,
    totalGroup: 2,
    totalPrice: displayCurrency(2400000)
  },
  {
    key: '3',
    name: 'Aggregator 3',
    totalRfq: 32,
    totalGroup: 1,
    totalPrice: displayCurrency(2000000)
  }
];

const LeaderboardAggregatorComponent = () => {
  return (
    <Table
      pagination={false}
      bordered
      columns={columns}
      dataSource={dataTable}
    />
  );
};

export default LeaderboardAggregatorComponent;
