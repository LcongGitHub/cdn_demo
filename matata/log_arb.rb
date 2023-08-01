
require 'fileutils'
require 'json'

# 该脚本用于打印现有的arb文件，输出key和value 到对应的文件
# 打印key
file = File.read('lib/l10n/intl_en.arb')
data_hash = JSON.parse(file)
output = File.open('translation_key.txt', "w")
data_hash.keys.each do |key|
    output << key + "\r\n";
end
output.close

file = File.read('lib/l10n/intl_en.arb')
data_hash = JSON.parse(file)
output = File.open('translation_en_value.txt', "w")
data_hash.values.each do |value|
    output << value + "\r\n";
end
output.close

file = File.read('lib/l10n/intl_zh.arb')
data_hash = JSON.parse(file)
output = File.open('translation_zh_value.txt', "w")
data_hash.values.each do |value|
    output << value + "\r\n";
end
output.close
