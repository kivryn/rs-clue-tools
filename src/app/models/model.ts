export interface CompleteTime {
    id?: string;
    createTime: number;
    type: string;
    steps: number;
    lapTime: number[];
    completeTime: number;
    fortunateComponent?: number;
    godPage?: number;
}