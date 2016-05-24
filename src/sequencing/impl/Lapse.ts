/// <reference path="../ICompletable.ts"/>
/// <reference path="../ILapse.ts"/>
/// <reference path="../../../typings/rx.d.ts"/>
/// <reference path="../../logging/ILog.ts"/>
/// <reference path="../../logging/Log.ts"/>

module Sequenx
{
    export class Lapse implements ILapse, Rx.IDisposable
    {
        private _isStarted: boolean;
        private _isDisposed: boolean;
        private _isCompleted: boolean;
        private _refCountDisposable: Rx.RefCountDisposable;
        private _completedSubject: Rx.Subject<string> = new Rx.Subject<string>();
        private _log: ILog;

        get completed(): Rx.IObservable<any>
        {
            return this._completedSubject;
        }

        set completed(value: Rx.IObservable<any>)
        {

        }

        constructor(name: string)
        {
            this._log = new Log(name);
            this._refCountDisposable = new Rx.RefCountDisposable(Rx.Disposable.create(() => this.lapseCompleted()));
        }
        
        public getChildLog(name:string):ILog
	    {
	        return this._log.getChild(name);
	    }

        public sustain(name?:string): Rx.IDisposable
        {
            if (this._isCompleted || this._isDisposed)
                return Rx.Disposable.empty;
            
            if (name && Log.isEnabled)
                this._log.warning("Sustain " + name);
            
            return this._refCountDisposable.getDisposable();
        }

        public start(): void
        {
            if (this._isStarted || this._isCompleted || this._isDisposed)
                return;

            this._isStarted = true;
            this._refCountDisposable.dispose();
        }

        public dispose(): void
        {
            if (this._isDisposed)
                return;

            if (!this._isCompleted)
            {
                this._log.info("Cancelling");
            }

            this.lapseCompleted();
        }

        private lapseCompleted(): void
        {
            if (this._isCompleted)
                return;

            this._isCompleted = true;
            this._isDisposed = true;
            this._log.dispose();
            this._completedSubject.onCompleted();
        }
        
        //ILapseExtensions
        
        public sequence(action:(seq:ISequence) => void, message?:string):Rx.IDisposable
        {
            const sustain = this.sustain();
            const name = message ? message : 'Child';
            const log = this.getChildLog(name);
            const sequence = new Sequence(log);
            
            return null; 
        }
        
        public child(action:(lapse:ILapse) => void, message?:string):void
        {
            
        }
    }
}
