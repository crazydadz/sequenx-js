
module Sequenx
{
    export interface ILapse extends Rx.IDisposable
    {
        sustain(name?: string): IDisposable;
        getChildLog(name: string): ILog;
        name: string;

        //extensions
        child(action: (lapse: ILapse) => void, message?: string): void;
        sequence(action: (seq: Sequence) => void, message?: string): Sequence;
    }
}
