require 'rubygems'
require 'json'

json = File.read('TI_Onomastic.json')
hash = JSON.parse( json )

hash.each do | item |
  /\$(\w+)\s/.match( item['description'] )
  item['phonetic'] = $1
end

File.open('TI_Onomastic_clean.json','w') do |f|
  f.write( hash.to_json )
end