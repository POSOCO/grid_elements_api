SELECT
  elems_table.id,
  elems_table.name,
  elems_table.elem_num,
  elems_table.type,
  elems_table.description,
  elems_table.level,
  elems_table.el_owners_list,
  elems_table.el_regions_list,
  elems_table.el_states_list,
  elems_table.ss_names_list,
  elems_table.ss_owners_list,
  elems_table.ss_regions_list,
  elems_table.ss_states_list
FROM
  (SELECT
     elements.*,
     voltages.level,
     element_types.type,
     GROUP_CONCAT(DISTINCT owners1.name ORDER BY owners1.name ASC SEPARATOR '/')   AS el_owners_list,
     GROUP_CONCAT(DISTINCT regions1.name ORDER BY regions1.name ASC SEPARATOR '/') AS el_regions_list,
     GROUP_CONCAT(DISTINCT states1.name ORDER BY states1.name ASC SEPARATOR '/')   AS el_states_list,
     GROUP_CONCAT(COALESCE(el_ss_info.el_regions_list, 'NA') ORDER BY el_ss_info.name ASC SEPARATOR
                  '|||')                                                           AS ss_regions_list,
     GROUP_CONCAT(COALESCE(el_ss_info.el_owners_list, 'NA') ORDER BY el_ss_info.name ASC SEPARATOR
                  '|||')                                                           AS ss_owners_list,
     GROUP_CONCAT(COALESCE(el_ss_info.el_states_list, 'NA') ORDER BY el_ss_info.name ASC SEPARATOR
                  '|||')                                                           AS ss_states_list,
     GROUP_CONCAT(COALESCE(el_ss_info.name, 'NA') ORDER BY el_ss_info.name ASC SEPARATOR
                  '|||')                                                           AS ss_names_list,
     GROUP_CONCAT(el_ss_info.el_name_with_owners ORDER BY el_ss_info.name ASC SEPARATOR
                  '|||')                                                           AS ss_names_with_owners_list
   FROM elements
     LEFT OUTER JOIN voltages ON voltages.id = elements.voltages_id
     LEFT OUTER JOIN element_types ON element_types.id = elements.element_types_id
     LEFT OUTER JOIN (
                       SELECT
                         elements_has_owners.*,
                         owners.name
                       FROM elements_has_owners
                         LEFT OUTER JOIN owners ON owners.id = elements_has_owners.owners_id)
       AS owners1 ON owners1.elements_id = elements.id
     LEFT OUTER JOIN (
                       SELECT
                         elements_has_regions.*,
                         regions.name
                       FROM elements_has_regions
                         LEFT OUTER JOIN regions ON regions.id = elements_has_regions.regions_id)
       AS regions1 ON regions1.elements_id = elements.id
     LEFT OUTER JOIN (
                       SELECT
                         elements_has_states.*,
                         states.name
                       FROM elements_has_states
                         LEFT OUTER JOIN states ON states.id = elements_has_states.states_id)
       AS states1 ON states1.elements_id = elements.id
     LEFT OUTER JOIN
     (
       SELECT
         elements_has_substations.*,
         ss_info.el_name_with_owners,
         ss_info.el_regions_list,
         ss_info.el_owners_list,
         ss_info.el_states_list,
         ss_info.name
       FROM elements_has_substations
         LEFT OUTER JOIN
         (
           SELECT
             substations.id,
             el.name,
             el.id                                                       AS ss_element_id,
             el.el_regions_list,
             el.el_owners_list,
             el.el_states_list,
             CONCAT(el.name, ' (', COALESCE(el.el_owners_list, ''), ')') AS el_name_with_owners
           FROM substations
             LEFT OUTER JOIN
             (SELECT
                elements.*,
                GROUP_CONCAT(DISTINCT owners1.name ORDER BY owners1.name ASC SEPARATOR '/')   AS el_owners_list,
                GROUP_CONCAT(DISTINCT regions1.name ORDER BY regions1.name ASC SEPARATOR '/') AS el_regions_list,
                GROUP_CONCAT(DISTINCT states1.name ORDER BY states1.name ASC SEPARATOR '/')   AS el_states_list,
                voltages.level
              FROM elements
                LEFT OUTER JOIN voltages ON voltages.id = elements.voltages_id
                LEFT OUTER JOIN (
                                  SELECT
                                    elements_has_owners.*,
                                    owners.name
                                  FROM elements_has_owners
                                    LEFT OUTER JOIN owners ON owners.id = elements_has_owners.owners_id)
                  AS owners1 ON owners1.elements_id = elements.id
                LEFT OUTER JOIN (
                                  SELECT
                                    elements_has_regions.*,
                                    regions.name
                                  FROM elements_has_regions
                                    LEFT OUTER JOIN regions ON regions.id = elements_has_regions.regions_id)
                  AS regions1 ON regions1.elements_id = elements.id
                LEFT OUTER JOIN (
                                  SELECT
                                    elements_has_states.*,
                                    states.name
                                  FROM elements_has_states
                                    LEFT OUTER JOIN states ON states.id = elements_has_states.states_id)
                  AS states1 ON states1.elements_id = elements.id
              GROUP BY elements.id
             ) AS el ON el.id = substations.elements_id
           GROUP BY substations.id) AS ss_info ON ss_info.id = elements_has_substations.substations_id
     ) AS el_ss_info ON el_ss_info.elements_id = elements.id
   GROUP BY elements.id) AS elems_table