import { dynamicTableName } from '../../common/constants';
import Button from '../../components/controls/Button';
import { indexedDBClient } from '../../lib/IndexedDB';

export default function IndexedDBPage() {
  return (
    <div className='size-full p-6 overflow-auto'>
      <div>Indexed DB</div>

      <Button
        onClick={async () => {
          const result = await indexedDBClient.getAll({ tableName: dynamicTableName });

          console.log('result', result);
        }}
        className='mr-6'
      >
        Get all records from IndexedDB {dynamicTableName}
      </Button>
    </div>
  );
}
