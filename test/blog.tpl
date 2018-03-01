
import ./models.tpl

{# type BlogEntryModel {
    title string
    publishedAt date
}

type BlogPageModel {
    title string
    entries []BlogEntryModel
#}

{% template BlogEntry(i int, entry BlogEntryModel) %}
<li id="{%= i %}">{%= entry.title %}</li>
{% end %}

{% template BlogEntryList(entries []BlogEntryModel)%}
</ul>
    {% for i, v in entries %}
    {%= BlogEntry(i, v) %}
    {% end %}
</ul>
{% end %}

{% template BlogPage(ctx BlogPageModel) %}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{%= ctx.title %}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
    <script src="main.js"></script>
</head>
<body>
    <h1>Blog</h1>
    {%= BlogEntryList(ctx.entries)%}
</body>
</html>
{% end %}