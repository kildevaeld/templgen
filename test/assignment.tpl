
type Event {
    name string
    startDate date
}


{% template eventDetails(event Event) %}
<div>{%= event.name %}</div>
{% end %}

{% template eventList(title string, events []Event) %}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{%= title %}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
    <script src="main.js"></script>
</head>
<body>
    
    <ul>
        {% for i, v in events %}
        <li id="{%= i %}">{%= v.name %}</li>
        {% if i % 2 == 0 %}    
        <span>test mig {%= v.startDate%}</span>
        {% end %}
        {% end %}
        {%= eventDetails(v) %}
        rapper
    </ul>
    {# Comment #}
</body>
</html>
{% end %}

