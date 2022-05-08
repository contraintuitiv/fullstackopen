type Operation = '*' | '+' | '/' | '-'

const calculator = (a: number, b: number, c: Operation): number => {
    switch(c){
        case '*':
            return a*b;
        case '+':
            return a+b;
        case '-':
            return a-b;
        case '/':
            if(b===0) throw new Error('Kann nicht durch 0 teilen');
            return a/b;
        default:
            throw new Error('Oeration is not *, +, / or -');

    }
}

try {
    const a: number = Number(process.argv[2])
    const b: number = Number(process.argv[3])
    const c = process.argv[4]

    let op: Operation;

    switch(c){
        case '*':
            op='*';
            break;
        case '/':
            op='/';
            break;
        case '-':
            op='-';
            break;
        case '+':
            op='+';
            break;
        default:
            throw new Error("no valid operation");
    }

    console.log(calculator(a, b, op));

} catch (error: unknown) {
    let errorMessage = 'Something went wrong.'
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }