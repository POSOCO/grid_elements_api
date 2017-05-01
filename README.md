# grid_elements_api
An API for grid elements with apps using the API

## Going from Excel to DB

## For general element information
1. The table columns are id, name, description, sil, stability_limit, thermal_limit, voltages_id, elements_type_id, created-at, updated_at

### For 400 KV lines

1. The columns are End-1 S/S, End-2 S/S, Id, Line Owner, End-1 Owner, End-2 Owner, Km, Conductor Type, SIL, End1 LR MVAR, End1 LR is_switchable, End2 LR MVAR, End2 LR is_switchable

2. For End Substations, Line owners, conductor types we will query substations table for the name and get the foreign key and if not present, we will create one and use that id for foreign key

3. The substation owners can be recorded later while creating the substations table

4. We will fill in the element_id, line number, voltage level, mvar, is_switchable values from this excel table to the line reactors table

### Important Points
1. Use the statement `SET default_storage_engine=InnoDB;` in the creation sql so that all tables have the same engine

2. A short guide to use sql variables in statements - [https://www.safaribooksonline.com/library/view/mysql-cookbook-2nd/059652708X/ch01s27.html](https://www.safaribooksonline.com/library/view/mysql-cookbook-2nd/059652708X/ch01s27.html)

3. Use `multipleStatements: true` in the mysql connection arguments to execute multiple statements
4. MySQL transaction example using connection pooling [link](http://stackoverflow.com/questions/37246997/nodejs-node-mysql-transaction-with-a-loop)

## <a name="insert_if_absent_and_get_id_strategy"></a> Strategy for insert of not present and get id
```sql
INSERT IGNORE INTO tags (tags,...) VALUES (the_new_tags, ...);
SELECT tag_id FROM tags WHERE tags=the_new_tags;
```

## Creation Strategies for **states, region, voltages, element_types, conductor_types** tables rows - normal

## Creation Strategy for **owners** table rows
1. Start a [transaction](https://github.com/mysqljs/mysql#transactions)
2. Find the **region_id** by owner region name using the [insert_if_absent_and_get_id_strategy](#insert_if_absent_and_get_id_strategy)
3. Create an entry in the **owners** table
4. Commit the [transaction](https://github.com/mysqljs/mysql#transactions)
5. Return the created owner id

## Creation Strategy for **elements** table rows
1. Start a [transaction](https://github.com/mysqljs/mysql#transactions)
2. Find **volatage level** and **element type**. If not present create them and reatain the id using [insert_if_absent_and_get_id_strategy](#insert_if_absent_and_get_id_strategy)
3. Create an entry in the elements table
4. Find **owner id** by name and create if necessary by the [insert_if_absent_and_get_id_strategy](#insert_if_absent_and_get_id_strategy). Do the same for **region** and **state**
5. Create an entry in the **elements_has_regions, elements_has_owners, elements_has_states** tables
6. Find the **substation id** or create if required and get the id 
7. Create an entry in the **elements_has_substations** table
8. Commit the [transaction](https://github.com/mysqljs/mysql#transactions)
9. Return the created element id

## Creation Strategy for **substations** table rows
1. Start a [transaction](https://github.com/mysqljs/mysql#transactions)
2. Create an element in the **elements** table and get the id
3. Create an entry in the **substations** table
4. Commit the [transaction](https://github.com/mysqljs/mysql#transactions)
5. Return the created substation id

## Creation Strategy for **lines** table rows
1. Start a [transaction](https://github.com/mysqljs/mysql#transactions)
2. Find the **conductor type**. If not present create them and reatain the id using [insert_if_absent_and_get_id_strategy](#insert_if_absent_and_get_id_strategy)
3. Create an element in the **elements** table and get the id
4. Create an entry in the **lines** table
5. Commit the [transaction](https://github.com/mysqljs/mysql#transactions)
6. Return the created line id

## Creation Strategy for **line_reactors** table rows
1. Start a [transaction](https://github.com/mysqljs/mysql#transactions)
2. Create an element in the **elements** table and get the id
3. Find the line id or create if necessary
4. Create an entry in the **line_reactors** table
5. Commit the [transaction](https://github.com/mysqljs/mysql#transactions)
6. Return the created line reactor id

## Creation Strategy for **bus_reactors** table rows
1. Start a [transaction](https://github.com/mysqljs/mysql#transactions)
2. Create an element in the **elements** table and get the id
3. Create an entry in the **bus_reactors** table
4. Commit the [transaction](https://github.com/mysqljs/mysql#transactions)
5. Return the created bus reactor id

## Todos
1. Add end substation_id attribute to line reactor table -- done
2. Modify element creation sql to handle zero to multiple owners -- done
3. Modify element creation sql to handle zero to multiple substations -- done
4. Create line creation code -- important
5. Create functions for get id by creation if required, for states, region, owners, voltages, element_types, conductor_types -- done
6. Complete element creation by completing element substations in the function -- done
7. Complete Bus reactor creation -- done
8. Complete Line creation -- done
9. Complete Line Reactor creation -- done
10. Decide about the data duplication happening in elements_has_substations for substations
11. Regions, States, Voltages, ElementTypes, ConductorTypes, Owners, Substations, Lines, Line Reactors, Bus reactors, ICTs csv UI -- done
12. Create UI for FSCs and TCSCs
13. Solve the line name bug (trying to insert B-A if A-B is already present)
14. Make all names either capital/small/sentence case, preferably capital

## Links
1. Google Docs page ---> https://docs.google.com/document/d/1xqxND1KHwLpGc3jCcYlq9GWiVnqFbHW_GvWrCmRioVY/edit?usp=sharing
2. Github page ---> https://github.com/POSOCO/grid_elements_api 
3. UX Design present in the google slides page at ---> https://docs.google.com/presentation/d/1-8ZsxXvcw5Jf0lq-ZPb9ANdfun1_eSllwTq-7s_o04U/edit?usp=sharing
