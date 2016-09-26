## Important table design considerations
* (name) is unique in _regions_ table
* (name) is unique in _states_ table
* (name) is unique in _owners_ table
* (level) is unique in _voltages_ table
* (type) is unique in _element_types_ table
* (name, element_types_id, voltages_id) is unique in _elements_ table
* (element_id, number) is unique in _lines_ table
* name of a line would be in the format _"substation1-substation2-lineNumber"_ in order to preserve the uniqueness in the _elements_ table
* (elements_id) is unique in _bus_reactors_ table

## Creating an Owner
* Create the owner **_region_** ( || NA) and get the id
* Create the **_owner_**

_Main table - owners_

_Related Tables - regions_

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
* If an element substations are specified, for each substation
    * Create the **_substation_** and get the id
    * Create an entry in the **_elements_has_substations_** table

_Main table - elements_

_Related Tables - element_types, voltages[, owners, regions, states, substations]_

## Creating a Substation
* Create the Substation **_element_** and get the id
* Create an entry in the **_Substations_** table

_Main table - substations_

_Related Tables - elements_

## Creating a Line
* Create the Line **_element_** and get the id
* Create the line **_conductor_type_** and get the id
* Create the **_line_**

_Main table - lines_

_Related Tables - elements_

## Creating a Line Reactor
* Create the Line Reactor **_element_** and get the id
* Get the **_line_id_**
* Create the **_line_reactor_**

_Main table - line_reactors_

_Related Tables - elements_



