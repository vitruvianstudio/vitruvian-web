export class ItemCredits {
    notes: string[]
    authors: string[]
    licenses: string[]
    urls: string[]

    constructor(authors:string[], licenses:string[], urls:string[], notes:string[]) {
        this.authors = authors
        this.licenses = licenses
        this.urls = urls
        this.notes = notes
    }
}
