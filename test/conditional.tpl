{% template test(greeting string, enter boolean)%}
{% if enter %}
   Hello, {%= greeting %}!
{% else %}
   Fairwell, {%= greeting %}
{% end %}

{% end %}