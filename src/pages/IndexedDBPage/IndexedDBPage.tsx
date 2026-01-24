import { useState } from 'react';
import AddNewPerson from './content/AddNewPerson';
import GetAllPersons from './content/GetAllPersons';
import GetOnePerson from './content/GetOnePerson';
import type { Person } from './types';

export default function IndexedDBPage() {
  const [records, setRecords] = useState<Person[]>([]);

  return (
    <div className='size-full p-6 overflow-auto'>
      <div className='text-xl font-bold mb-4'>Indexed DB</div>

      <AddNewPerson setRecords={setRecords} />

      <GetOnePerson />

      <GetAllPersons records={records} setRecords={setRecords} />
    </div>
  );
}
