## Creating an Owner
* Create the owner **_region_** ( || NA) and get the id
* Create the **_owner_**

## Creating an Element
* Create the given **_element_type_** ( || miscellaneous) and get the id
* Create the given **_element_voltage_** ( || -1) and get the id
* Create the **_element_** with all the input parameters and get the id
* If an element owner is specified
    * Create the **_owner_** and get the id
    * Create an entry in the **_elements_has_owners_** table
* If an element region is specified
    * Create the **_region_** and get the id
    * Create an entry in the **_elements_has_regions_** table
* If an element state is specified
    * Create the **_state_** and get the id
    * Create an entry in the **_elements_has_states_** table
* If an element substations are specified, for each substation, do the following
    * Create the **_substation_** and get the id
    * Create an entry in the **_elements_has_substations_** table

## Creating an Substation
* Create the Substation **_element_** and get the id
* Create an entry in the **_Substations_** table

## Creating a Line
* Create the Line **_element_** and get the id
* Create the line **_conductor_type_** and get the id
* Create the **_line_**

## Creating a Line Reactor
* Create the Line Reactor **_element_** and get the id
* Get the **_line_id_**
* Create the **_line_reactor_**



