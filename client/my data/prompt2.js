export const DATA_TYPE_OPTIONS = [
  { value: "string", label: "String" },
  { value: "alphabetic", label: "Alphabetic" },
  { value: "integer", label: "Integer" },
  { value: "float", label: "Float" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
  { value: "email", label: "Email" },
];
above are data type options
1)when i add data_type rule and data_type is date then date_fomrat save. it works fine. 
but when i save rule then check if data_lenght is there then remove data_length other.
if (data_type = date) then  data_lenght reomve

2)
when i edit data_type rule and data_type is date() 
 previous data_type != new dataType and new dataType= date) then if data_length  then reomve it
 .don't touch date_format wokring in current as it is working fine

when i edit data_type rule and data_type is other then date. previous data_type != new dataType and previous data_type = date) then if data_length is there from currentHeader then reomve it. don't touch date_format wokring in current as it is working fine


main  concept is lengh consist of variable(min,max) or fixed(fixed_value). 
for data_type="date" i want use to change  variable(min,max) or fixed(fixed_value) with date
for data_type other then date i want use to change  variable(min,max) or fixed(fixed_value) with number




