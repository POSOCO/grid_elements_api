-- Get all the substations

SELECT
  elements.name,
  voltages.level,
  GROUP_CONCAT(DISTINCT owns.name SEPARATOR ', ') AS ownrs,
  GROUP_CONCAT(DISTINCT regs.name SEPARATOR ', ') AS regns,
  GROUP_CONCAT(DISTINCT sts.name SEPARATOR ', ')  AS stats
FROM elements
  LEFT OUTER JOIN element_types ON elements.element_types_id = element_types.id
  LEFT OUTER JOIN substations ON elements.id = substations.elements_id
  LEFT OUTER JOIN voltages ON elements.voltages_id = voltages.id
  LEFT OUTER JOIN (SELECT
                     owners.name,
                     elements_has_owners.elements_id
                   FROM elements_has_owners
                     LEFT OUTER JOIN owners ON elements_has_owners.owners_id = owners.id) AS owns
    ON elements.id = owns.elements_id
  LEFT OUTER JOIN (SELECT
                     regions.name,
                     elements_has_regions.elements_id
                   FROM elements_has_regions
                     LEFT OUTER JOIN regions ON regions.id = elements_has_regions.regions_id) AS regs
    ON regs.elements_id = elements.id
  LEFT OUTER JOIN (SELECT
                     states.name,
                     elements_has_states.elements_id
                   FROM elements_has_states
                     LEFT OUTER JOIN states ON states.id = elements_has_states.states_id) AS sts
    ON sts.elements_id = elements.id
WHERE element_types.type = "Substation"
GROUP BY elements.id
ORDER BY elements.name ASC;

-- Get all the lines

SELECT
  elements.name,
  voltages.level,
  lns.name,
  lns.line_length,
  lns.noloadmvar,
  GROUP_CONCAT(DISTINCT lns.number SEPARATOR ', ') AS line_number,
  GROUP_CONCAT(DISTINCT owns.name SEPARATOR ', ')  AS ownrs,
  GROUP_CONCAT(DISTINCT regs.name SEPARATOR ', ')  AS regns,
  GROUP_CONCAT(DISTINCT sts.name SEPARATOR ', ')   AS stats
FROM elements
  LEFT OUTER JOIN element_types ON elements.element_types_id = element_types.id
  LEFT OUTER JOIN substations ON elements.id = substations.elements_id
  LEFT OUTER JOIN voltages ON elements.voltages_id = voltages.id
  LEFT OUTER JOIN (SELECT
                     owners.name,
                     elements_has_owners.elements_id
                   FROM elements_has_owners
                     LEFT OUTER JOIN owners ON elements_has_owners.owners_id = owners.id) AS owns
    ON elements.id = owns.elements_id
  LEFT OUTER JOIN (SELECT
                     regions.name,
                     elements_has_regions.elements_id
                   FROM elements_has_regions
                     LEFT OUTER JOIN regions ON regions.id = elements_has_regions.regions_id) AS regs
    ON regs.elements_id = elements.id
  LEFT OUTER JOIN (SELECT
                     states.name,
                     elements_has_states.elements_id
                   FROM elements_has_states
                     LEFT OUTER JOIN states ON states.id = elements_has_states.states_id) AS sts
    ON sts.elements_id = elements.id
  LEFT OUTER JOIN (SELECT
                     conductor_types.name,
                     `lines`.number,
                     `lines`.line_length,
                     `lines`.noloadmvar,
                     `lines`.elements_id
                   FROM `lines`
                     LEFT OUTER JOIN conductor_types ON conductor_types.id = `lines`.conductor_types_id) AS lns
    ON lns.elements_id = elements.id
WHERE element_types.type = "Line"
GROUP BY elements.id
ORDER BY elements.name ASC