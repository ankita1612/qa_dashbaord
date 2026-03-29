Rule: Dependency
Features:
Main dependency
Radio: 1)required (default) 2) other value → show textbox (mandatory)
Sub dependencies (multiple)
Multi-select headers (excluding current header)
Radio: 1) required(default) 2) other value → textbox (mandatory)
Validation:
All fields required
Same header cannot repeat
List view with:
Edit
Delete

Final validation
At least 1 sub dependency required

create seprate component for sub dependancy
analysis clearly and tell me where to change?

Please give me fresh steps for this task. read requirement carefully and give me production friendly code.
with all validation
I want to add one more rule "dependancy"
1)when user select this rule then add 2 radio button show 1) required 2) some other value .
when "some other value" select one text box show with other_value_main_dependancy
default required selected
2)sub dependancies : user can add n number of sub dependancy
sub dependancy have 2 things 1) multiselect dropdown with list of headers except current header . user can select muliple dependancy with multiselect dropdown2) sub_required and sub_other_values radio botton. when sub_other_values select then textbox show with sub_other_text . when user "save sub dependancy" perform validation a) all fieleds are required b) same dependancy filed can use only 1 time. after save sub depndancy show in list view with edit and delete subdependacy 3) when user save atleast 1 sub dependancy should there and required 4) radio buton "required" is default selected. if "other value" then textbox is mandatory

not_match_found
cell_end_with
cell_start_with
cell_contains
rule.cell_contains_value

Add 1 rule "Fixed Headers" with variable fixed_header
when this rule selected
1)show textbox with add icon in same line. and clear icon is anything inside textbox. user can add n nuber of fixed headers
2)when click on add check textbox is null or not . if null give toaster message .if not null add to list view
3)after save show list view with edit and delete icon. with inlin edit and save ,cancel button.
show message with toaster.

when "save" button click check validation for aleast one fixed_header value.

Add 2 rule

1. "Data Redundant and Threshold"
   when this select 2 textbox. a)data_redundant_value b)data_redundant_threshold . both are mandatory. show toaster message for validation
2. "Regex"
   when this select 1 textbox. a)cell_contains_value. it is mandatory. show toaster message

Add Rule 1) Lenght validation
I have appliedRuleDataType[0].value variable that tell which data type of file
if it is null then set as string while checking

I want to add another rule "data length"
when "data length" choose i hade thse options "varible","fixed". deafult variable selected
if variable selected then 3 cases
if appliedRuleDataType[0].value is string,alphabetic,email,boolean then min_value and max_value
if appliedRuleDataType[0].value is float, integer then min_length and max_length
if appliedRuleDataType[0].value is date, integer then min_date and max_date

if fixed selected then 3 cases
if appliedRuleDataType[0].value is string,alphabetic,email,boolean then fixed_length
if appliedRuleDataType[0].value is float, integer then fixed_length
if appliedRuleDataType[0].value is date, integer then fixed_length

when user try to save give validation with toaster. all filed are required. give attractive design with taildwind css and production ready code.

we have already this code. please add more rule

2. add another rule for date fomat. if appliedRuleDataType[0].value=="date" then add rule "Date format"
   I have variable "date_format_options". when user select rule. open dropdown with list of date_format_options in drop down. default set to YYYY-MM-DD in dropdown

give production fridnly code with tailwind css
+++

In right panel when user click on "add rule" I want to show model box.
in model box I want user to choose any of these rule
currenly there are 2 rules. there can be n numbers

1. required
2. data type

when "required" choose I want I want to show another option with switchbox . is required or not
when "data type" choose I want I want to show list of data type like "string",
"alphabetic",
"integer",
"float",
"boolean",
"date",
"email"

give save ans cancel button. when save I got json like {
"Id": {
"data_type": "string",
"has_empty": true,
},
"URL": {
"has_empty": true,
},
"name": {
}

}. store only those rul which user add model box will be close.
when model box closed.

i can see list of added rules in right side partion
. I can edit that rule also. when edit show popup

Make these functionality with production friendly design, typescript , taildwind css

================

I wantt to create ShowValidationRules component with tailwindcss + typescript.
I got headers from file.
now i want it to divide 2 parts.
1)left part consist of list of headers . when we click on add headers it show applied rules . if no rule is applied then show top right "Add rule" button. and in center show "Add Rule button"
2)in right part we can add rules.
Make design production friendly and taildwind css

thisis my code.

1. when user upload file I want to perform file extension validation.
   2)if file validation atch then read headers from node.js
   3)after reading heade don;t show file upload part. show ShowValidationRules. is code production friendly
