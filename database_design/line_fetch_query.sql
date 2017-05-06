SELECT
  *
FROM
  (
  SELECT
    ss.substations_id AS ss_id,
    el.*,
    GROUP_CONCAT(
      DISTINCT ss.substations_id
    ORDER BY
      ss.substations_id ASC SEPARATOR '|||'
    ) AS ss_ids
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
  el_tb.ss_ids = '176|||183' AND el_tb.element_types_id = 8 AND el_tb.voltages_id = 2 AND el_tb.elem_num = 1