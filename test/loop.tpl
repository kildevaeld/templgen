{% template loop(list []string, dict string) %}

{% for i, v in list %}
  index #{%= i %}
  value {%= v %}
{% end %}

{% for k, v in dict %}
  key {%= k %}
  value {%= v %}
{% end %}

{%end%}