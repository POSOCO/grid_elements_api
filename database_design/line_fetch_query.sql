SELECT *
FROM
  (
    SELECT
      ss.substations_id AS ss_id,
      el.*,
      GROUP_CONCAT(
          DISTINCT ss.substations_id
          ORDER BY
          ss.substations_id ASC SEPARATOR '|||'
      )                 AS ss_ids
    FROM
      elements AS el
      LEFT JOIN
      elements_has_substations ss ON ss.elements_id = el.id
    GROUP BY
      el.id
    ORDER BY
      el.name ASC
  ) AS el_tb
WHERE
  el_tb.ss_ids = '176|||183' AND el_tb.element_types_id = 8 AND el_tb.voltages_id = 2 AND el_tb.elem_num = 1;


-- GETTING LINES DATA WITH THEIR OWNERS AND REGIONS INFORMATION START
SELECT
  `lines`.id,
  el.name,
  el.id                                                       AS element_id,
  el.el_regions_list,
  el.ss_regions_list,
  el.el_owners_list,
  el.ss_names_with_owners_list                                AS ss_names_with_owners_list,
  CONCAT(el.name, ' (', COALESCE(el.el_owners_list, ''), ')') AS el_owners_list
FROM `lines`
  -- JOIN FOR COMPLETE LINE ELEMENT INFO START
  LEFT OUTER JOIN
  (SELECT
     elements.*,
     voltages.level,
     GROUP_CONCAT(DISTINCT owners1.name ORDER BY owners1.name ASC SEPARATOR '/')   AS el_owners_list,
     GROUP_CONCAT(DISTINCT regions1.name ORDER BY regions1.name ASC SEPARATOR '/') AS el_regions_list,
     GROUP_CONCAT(DISTINCT el_ss_info.el_regions_list ORDER BY el_ss_info.el_regions_list ASC SEPARATOR
                  '|||')                                                           AS ss_regions_list,
     GROUP_CONCAT(DISTINCT el_ss_info.el_name_with_owners ORDER BY el_ss_info.el_name_with_owners ASC SEPARATOR
                  '|||')                                                           AS ss_names_with_owners_list
   FROM elements
     LEFT OUTER JOIN voltages ON voltages.id = elements.voltages_id
     -- JOIN FOR LINE ELEMENT COMPLETE OWNER INFO START
     LEFT OUTER JOIN (
                       SELECT
                         elements_has_owners.*,
                         owners.name
                       FROM elements_has_owners
                         -- JOIN FOR LINE ELEMENT COMPLETE OWNER NAME INFO START
                         LEFT OUTER JOIN owners ON owners.id = elements_has_owners.owners_id)
       AS owners1 ON owners1.elements_id = elements.id
     -- JOIN FOR LINE ELEMENT COMPLETE OWNER NAME INFO END
       -- JOIN FOR LINE ELEMENT COMPLETE OWNER INFO END
     -- JOIN FOR LINE ELEMENT COMPLETE REGION INFO START
     LEFT OUTER JOIN (
                       SELECT
                         elements_has_regions.*,
                         regions.name
                       FROM elements_has_regions
                         -- JOIN FOR LINE ELEMENT COMPLETE REGION NAME INFO START
                         LEFT OUTER JOIN regions ON regions.id = elements_has_regions.regions_id)
       AS regions1 ON regions1.elements_id = elements.id
     -- JOIN FOR LINE ELEMENT COMPLETE REGION NAME INFO END
       -- JOIN FOR LINE ELEMENT COMPLETE REGION INFO END
     -- JOIN FOR COMPLETE ELEMENT SUBSTATION LIST INFO START
     LEFT OUTER JOIN
     (
       SELECT
         elements_has_substations.*,
         ss_info.el_name_with_owners,
         ss_info.el_regions_list
       FROM elements_has_substations
         LEFT OUTER JOIN
         (
           -- GETTING SUBSTATIONS DATA WITH THEIR OWNERS AND REGIONS INFORMATION START
           SELECT
             substations.id,
             el.name,
             el.id                                                       AS ss_element_id,
             el.el_regions_list,
             el.el_owners_list,
             CONCAT(el.name, ' (', COALESCE(el.el_owners_list, ''), ')') AS el_name_with_owners
           FROM substations
             -- JOIN FOR COMPLETE SS ELEMENT INFO START
             LEFT OUTER JOIN
             (SELECT
                elements.*,
                GROUP_CONCAT(DISTINCT owners1.name ORDER BY owners1.name ASC SEPARATOR '/')   AS el_owners_list,
                GROUP_CONCAT(DISTINCT regions1.name ORDER BY regions1.name ASC SEPARATOR '/') AS el_regions_list,
                voltages.level
              FROM elements
                LEFT OUTER JOIN voltages ON voltages.id = elements.voltages_id
                -- JOIN FOR SS ELEMENT COMPLETE OWNER INFO START
                LEFT OUTER JOIN (
                                  SELECT
                                    elements_has_owners.*,
                                    owners.name
                                  FROM elements_has_owners
                                    -- JOIN FOR SS ELEMENT COMPLETE OWNER NAME INFO START
                                    LEFT OUTER JOIN owners ON owners.id = elements_has_owners.owners_id)
                  AS owners1 ON owners1.elements_id = elements.id
                -- JOIN FOR SS ELEMENT COMPLETE OWNER NAME INFO END
                  -- JOIN FOR SS ELEMENT COMPLETE OWNER INFO END
                -- JOIN FOR SS ELEMENT COMPLETE REGION INFO START
                LEFT OUTER JOIN (
                                  SELECT
                                    elements_has_regions.*,
                                    regions.name
                                  FROM elements_has_regions
                                    -- JOIN FOR SS ELEMENT COMPLETE REGION NAME INFO START
                                    LEFT OUTER JOIN regions ON regions.id = elements_has_regions.regions_id)
                  AS regions1 ON regions1.elements_id = elements.id
              -- JOIN FOR SS ELEMENT COMPLETE REGION NAME INFO END
              -- JOIN FOR SS ELEMENT COMPLETE REGION INFO END
              GROUP BY elements.id
             ) AS el ON el.id = substations.elements_id
           -- JOIN FOR COMPLETE SS ELEMENT INFO END
           GROUP BY substations.id) AS ss_info ON ss_info.id = elements_has_substations.substations_id
       -- GETTING SUBSTATIONS DATA WITH THEIR OWNERS AND REGIONS INFORMATION END
     ) AS el_ss_info ON el_ss_info.elements_id = elements.id
   -- JOIN FOR COMPLETE ELEMENT SUBSTATION LIST INFO END
   GROUP BY elements.id
  ) AS el ON el.id = `lines`.elements_id
-- JOIN FOR COMPLETE LINE ELEMENT INFO END
GROUP BY `lines`.id
-- GETTING LINES DATA WITH THEIR OWNERS AND REGIONS INFORMATION END

-- GETTING SUBSTATIONS DATA WITH THEIR OWNERS AND REGIONS INFORMATION START
SELECT
  substations.id, el.name, el.id AS ss_element_id, el.el_regions_list, el.el_owners_list,
                           CONCAT(el.name, ' (', COALESCE(el.el_owners_list,''),')' ) AS el_name_region
FROM
  substations
  -- JOIN FOR COMPLETE SS ELEMENT INFO START
  LEFT OUTER JOIN
  (SELECT elements.*, GROUP_CONCAT(DISTINCT owners1.name ORDER BY owners1.name ASC SEPARATOR '/') AS el_owners_list, GROUP_CONCAT(DISTINCT regions1.name ORDER BY regions1.name ASC SEPARATOR '/') AS el_regions_list, voltages.level FROM elements
    LEFT OUTER JOIN voltages ON voltages.id = elements.voltages_id
    -- JOIN FOR SS ELEMENT COMPLETE OWNER INFO START
    LEFT OUTER JOIN (
                      SELECT elements_has_owners.*, owners.name FROM elements_has_owners
                        -- JOIN FOR SS ELEMENT COMPLETE OWNER NAME INFO START
                        LEFT OUTER JOIN owners ON owners.id = elements_has_owners.owners_id)
      AS owners1 ON owners1.elements_id = elements.id
    -- JOIN FOR SS ELEMENT COMPLETE OWNER NAME INFO END
  -- JOIN FOR SS ELEMENT COMPLETE OWNER INFO END
  -- JOIN FOR SS ELEMENT COMPLETE REGION INFO START
    LEFT OUTER JOIN (
                      SELECT elements_has_regions.*, regions.name FROM elements_has_regions
                        -- JOIN FOR SS ELEMENT COMPLETE REGION NAME INFO START
                        LEFT OUTER JOIN regions ON regions.id = elements_has_regions.regions_id)
      AS regions1 ON regions1.elements_id = elements.id
  -- JOIN FOR SS ELEMENT COMPLETE REGION NAME INFO END
-- JOIN FOR SS ELEMENT COMPLETE REGION INFO END
  GROUP BY elements.id
  ) AS el ON el.id = substations.elements_id
-- JOIN FOR COMPLETE SS ELEMENT INFO END
GROUP BY substations.id
-- GETTING SUBSTATIONS DATA WITH THEIR OWNERS AND REGIONS INFORMATION END