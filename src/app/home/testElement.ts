export class TestElement {
    keyword: string;
    name: string;
    duration: number;
    status: string;
    innerElements: TestElement[];
    constructor(keyword, name) {
        this.keyword = keyword;
        this.name = name;
        this.innerElements = [];
    }
}