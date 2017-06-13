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
5. General SQL clause
```sql
SELECT column1, column2
FROM table_name
WHERE [ conditions ]
GROUP BY column1, column2
ORDER BY column1, column2
LIMIT offset, num_rows
```
6. To convert multi line sql string for variable, paste the sql in notepad++ and replace ```[\r\n]+``` with ``` \\\r\n```
7. Element get url ```http://localhost:3000/api/elements?cols[0]=elements_ss_table.name&operators[0]=LIKE&values[0]=akola&cols[1]=element_types.type&operators[1]==&values[1]=line&cols[2]=voltages.level&operators[2]==&values[2]=400```

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

## Strategy for getting the Line elements from elements table -- done
1. The goal is not to depend on the name attribute of the elements table since the names are hard coded and 
will not update themselves according to changes in substation names which can be a 
serious bug (A-B, B-A bug also will be present)
2. So the ideal strategy would be assign a GUID for line while it is created
3. To get a line element from elements table, we would first do a left outer join of lines with substations table and concatenate substations with '|||'
4. Then will call a select statement on the above table which has substations as 'SUB1|||SUB2' or 'SUB2|||SUB1' instead of using name as the search attribute
5. The ideal way to implement this strategy would be to write a pre-insertion trigger routine so that the insertion would be server agnostic
6. Otherwise we will have to implement this strategy in the server application program
7. While displaying line elements, we will derive the line name from doing the table join just as the step 3 but keep the concatenate character as '-'
8. That means the derived name of the element would be 'SUB1-SUB2'

## Strategy for getting the Bus Reactor and ICT elements from elements table -- done
1. The strategy will be similar to [getting_the_Line_elements_from_elements_table](strategy_for_getting_the_line_elements_from_elements_table)
2. So while creation we should ideally give GUID in name
3. To get the element use the substation name instead of name from the joined table for querying
4. While displaying the name of the element, use the substation name from joined table

## Strategy for getting the Line Reactor, FSC and TCSC elements from elements table -- done
1. The strategy will be similar to [getting_the_Line_elements_from_elements_table](strategy_for_getting_the_line_elements_from_elements_table)
2. So while creation we should ideally give GUID in name
3. To get the element use the substation name and line element derived from the line reactor information instead of name from the joined table for querying
4. While displaying the name of the element, use the substation name from joined table

## Queries for users
1. Get Substations info by name, voltage
2. Get lines info by name, voltage, conductor type, terminal substations
3. Get busReactors info by voltage, terminal substation, mvar
4. Get lineReactors, fsc, tcsc info by voltage, terminal substation
5. Get ict info by voltage ratio, terminal substation names/voltages 
6. Get elements by name, voltage level, terminal substation, type

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
13. Solve the line name bug (trying to insert B-A if A-B is already present) -- done
14. Make all names either capital/small/sentence case, preferably capital
15. Do the line controller get all function

## Links
1. Google Docs page ---> https://docs.google.com/document/d/1xqxND1KHwLpGc3jCcYlq9GWiVnqFbHW_GvWrCmRioVY/edit?usp=sharing
2. Github page ---> https://github.com/POSOCO/grid_elements_api 
3. UX Design present in the google slides page at ---> https://docs.google.com/presentation/d/1-8ZsxXvcw5Jf0lq-ZPb9ANdfun1_eSllwTq-7s_o04U/edit?usp=sharing
