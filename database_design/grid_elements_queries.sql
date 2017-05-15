-- substations details SQL

SELECT
  substations.id,
  substations.elements_id,
  elements.name,
  elements.voltages_id,
  elements.elem_num,
  ss_owners.ss_owner_names,
  ss_regions.ss_region_names
FROM
  substations
  INNER JOIN
  elements ON substations.elements_id = elements.id
  LEFT JOIN
  (
    SELECT
      elements_has_owners.elements_id,
      GROUP_CONCAT(
          DISTINCT owners.name
          ORDER BY
          owners.name ASC SEPARATOR ', '
      ) AS ss_owner_names
    FROM
      elements_has_owners
      LEFT JOIN
      owners ON owners.id = elements_has_owners.owners_id
    GROUP BY
      elements_id
  ) AS ss_owners ON ss_owners.elements_id = substations.elements_id
  LEFT JOIN
  (
    SELECT
      elements_has_regions.elements_id,
      GROUP_CONCAT(
          DISTINCT regions.name
          ORDER BY
          regions.name ASC SEPARATOR ', '
      ) AS ss_region_names
    FROM
      elements_has_regions
      LEFT JOIN
      regions ON regions.id = elements_has_regions.regions_id
    GROUP BY
      elements_id
  ) AS ss_regions ON ss_regions.elements_id = substations.elements_id
ORDER BY
  elements.name ASC
LIMIT 0, 100;

-- get the elements substations names seperated by '-'

SELECT
  *
FROM
  (
    SELECT
      elements_ss_table.*,
      voltages.level,
      element_types.type,
      element_owners.owner_names,
      element_regions.region_names,
      GROUP_CONCAT(
          DISTINCT ss_table.name
          ORDER BY
          ss_table.name ASC SEPARATOR '-'
      ) AS ss_names,
      GROUP_CONCAT(
          DISTINCT ss_table.ss_owner_names
          ORDER BY
          ss_table.ss_owner_names ASC SEPARATOR ','
      ) AS ss_owner_names,
      GROUP_CONCAT(
          DISTINCT ss_table.ss_region_names
          ORDER BY
          ss_table.ss_region_names ASC SEPARATOR ','
      ) AS ss_region_names,
      GROUP_CONCAT(
          DISTINCT ss_table.id
          ORDER BY
          ss_table.id ASC SEPARATOR '|||'
      ) AS ss_ids
    FROM
      (
        SELECT
          elements.*,
          elements_has_substations.substations_id
        FROM
          elements
          LEFT JOIN
          elements_has_substations ON elements_has_substations.elements_id = elements.id
      ) AS elements_ss_table
      LEFT JOIN
      (
        SELECT
          substations.id,
          substations.elements_id,
          elements.name,
          elements.voltages_id,
          elements.elem_num,
          ss_owners.ss_owner_names,
          ss_regions.ss_region_names
        FROM
          substations
          INNER JOIN
          elements ON substations.elements_id = elements.id
          LEFT JOIN
          (
            SELECT
              elements_has_owners.elements_id,
              GROUP_CONCAT(
                  DISTINCT owners.name
                  ORDER BY
                  owners.name ASC SEPARATOR ', '
              ) AS ss_owner_names
            FROM
              elements_has_owners
              LEFT JOIN
              owners ON owners.id = elements_has_owners.owners_id
            GROUP BY
              elements_id
          ) AS ss_owners ON ss_owners.elements_id = substations.elements_id
          LEFT JOIN
          (
            SELECT
              elements_has_regions.elements_id,
              GROUP_CONCAT(
                  DISTINCT regions.name
                  ORDER BY
                  regions.name ASC SEPARATOR ', '
              ) AS ss_region_names
            FROM
              elements_has_regions
              LEFT JOIN
              regions ON regions.id = elements_has_regions.regions_id
            GROUP BY
              elements_id
          ) AS ss_regions ON ss_regions.elements_id = substations.elements_id
      ) AS ss_table ON ss_table.id = elements_ss_table.substations_id
      LEFT JOIN
      voltages ON voltages.id = elements_ss_table.voltages_id
      LEFT JOIN
      element_types ON element_types.id = elements_ss_table.element_types_id
      LEFT JOIN
      (
        SELECT
          elements_has_owners.elements_id,
          GROUP_CONCAT(
              DISTINCT owners.name
              ORDER BY
              owners.name ASC SEPARATOR ', '
          ) AS owner_names
        FROM
          elements_has_owners
          LEFT JOIN
          owners ON owners.id = elements_has_owners.owners_id
        GROUP BY
          elements_id
      ) AS element_owners ON element_owners.elements_id = elements_ss_table.id
      LEFT JOIN
      (
        SELECT
          elements_has_regions.elements_id,
          GROUP_CONCAT(
              DISTINCT regions.name
              ORDER BY
              regions.name ASC SEPARATOR ', '
          ) AS region_names
        FROM
          elements_has_regions
          LEFT JOIN
          regions ON regions.id = elements_has_regions.regions_id
        GROUP BY
          elements_id
      ) AS element_regions ON element_regions.elements_id = elements_ss_table.id
    GROUP BY
      elements_ss_table.id
  ) AS elems_table
ORDER BY elems_table.name ASC
LIMIT 0, 100