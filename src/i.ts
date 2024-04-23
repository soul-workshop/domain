import { Result } from 'rilata/src/common/result/types';

type R = Result<'Faile', 'Success'>

const result = '' as unknown as R;

function f(): void {
  if (result.isFailure()) {
    // result.value;
    console.log('fail')
    console.log(result.value);
    return;
  }
  console.log('scss');
  console.log(result.value);
}

f();
