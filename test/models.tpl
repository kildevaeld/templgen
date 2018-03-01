

type BlogEntryModel {
    title string
    publishedAt date
}

type BlogPageModel {
    title string
    entries []BlogEntryModel
}