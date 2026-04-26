import CodeBlock from '@src/components/CodeBlock';

const TYPESCRIPT_SAMPLE = `'use strict'

import { useMemo, useEffect } from 'react';
import { convertReactPropsToRevealProps } from '../utils/convertReactPropsToRevealProps';

const UPPER_CASE_CONST = 300;

/**
 * this is a JSDOC (shocking...)
 */

async function killMe2(arr: Array<any>) {
    return void arr.pop();
}

class Person {
    constructor(name){
        super('kill me')
        this.name = name;
    }
}`;

export default function CodeBlockTab() {
  return (
    <>
      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>CodeBlock:</div>

        <div>
          <CodeBlock language='typescript' code={TYPESCRIPT_SAMPLE} />
        </div>
      </div>

      <div className='w-96 h-10'>
        <CodeBlock code={'ls --name hello'} />
      </div>
    </>
  );
}
