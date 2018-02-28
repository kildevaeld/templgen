package template

import (
	"bytes"
	"time"

	"github.com/shiyanhui/hero"
)

type BlogEntryModel struct {
	Title       string
	PublishedAt time.Time
}

type BlogPageModel struct {
	Title   string
	Entries []BlogEntryModel
}

func BlogEntry(i int, entry *BlogEntryModel, buf *bytes.Buffer) {
	buf.WriteString(`
<li id="`)
	hero.FormatInt(uint64(i), buf)
	buf.WriteString(`">`)
	buf.WriteString(entry.Title)
	buf.WriteString(`</li>`)
}
func BlogEntryList(entries []BlogEntryModel, buf *bytes.Buffer) {
	buf.WriteString(`
</ul>`)
	for i, v := range entries {
		buf.WriteString(``)
		BlogEntry(i, v, buf)
		buf.WriteString(``)
	}
	buf.WriteString(`
</ul>`)
}
func BlogPage(ctx *BlogPageModel, buf *bytes.Buffer) {
	buf.WriteString(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>`)
	buf.WriteString(ctx.Title)
	buf.WriteString(`</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
    <script src="main.js"></script>
</head>
<body>
    <h1>Blog</h1>`)
	BlogEntryList(ctx.Entries, buf)
	buf.WriteString(`
</body>
</html>`)
}
