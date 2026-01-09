
export default interface ErrorResult {
    type: string;
    message: string;
    details: ErrorResultDetailModel[];
}

interface ErrorResultDetailModel {
    context: string;
    messages: string[];
}