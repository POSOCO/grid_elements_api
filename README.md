# grid_elements_api
An API for grid elements with apps using the API

## Going from Excel to DB

##For general element information
1. The table columns are id, name, description, sil, stability_limit, thermal_limit, voltages_id, elements_type_id, created-at, updated_at

###For 400 KV lines

1. The columns are End-1 S/S, End-2 S/S, Id, Line Owner, End-1 Owner, End-2 Owner, Km, Conductor Type, SIL, End1 LR MVAR, End1 LR is_switchable, End2 LR MVAR, End2 LR is_switchable

2. For End Substations, Line owners, conductor types we will query substations table for the name and get the foreign key and if not present, we will create one and use that id for foreign key

3. The substation owners can be recorded later while creating the substations table

4. We will fill in the element_id, line number, voltage level, mvar, is_switchable values from this excel table to the line reactors table

###Important Points
1. Use the statement `SET default_storage_engine=InnoDB;` in the creation sql so that all tables have the same engine

2. A short guide to use sql variables in statements - [https://www.safaribooksonline.com/library/view/mysql-cookbook-2nd/059652708X/ch01s27.html](https://www.safaribooksonline.com/library/view/mysql-cookbook-2nd/059652708X/ch01s27.html)

3. Use `multipleStatements: true` in the mysql connection arguments to execute multiple statements

##Todos
1. Add end substation_id attribute to line reactor table -- done

##Links
1. Google Docs page ---> https://docs.google.com/document/d/1xqxND1KHwLpGc3jCcYlq9GWiVnqFbHW_GvWrCmRioVY/edit?usp=sharing
2. Github page ---> https://github.com/POSOCO/grid_elements_api 
3. UX Design present in the google slides page at ---> https://docs.google.com/presentation/d/1-8ZsxXvcw5Jf0lq-ZPb9ANdfun1_eSllwTq-7s_o04U/edit?usp=sharing
