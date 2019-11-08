export interface CompleteTime {
    id?: string;
    createTime: number;
    type: string;
    steps: number;
    lapTime: number[];
    completeTime: number;
    fortunateComponent?: number;
    godPage?: number;
    masterClue?: number;
}

export interface Coord {
    id?: string;
    a: string;
    b: string;
    c: string;
    d: string;
    type: string;
    teleport:string;
    challenge: string;
    description: string;
    w?: string;
}

export interface DialogData{
    title: string;
    record: any;
}