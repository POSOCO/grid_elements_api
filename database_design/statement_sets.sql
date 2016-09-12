-- Inserting a substation
START TRANSACTION READ WRITE;
SET @name = "SudhirElement";
SET @typename = "Substation";
SET @level = "400";
SET @owner = "SUDHIROWNER";
SET @regionname = "NOT KNOWN";
SET @metadata = "NOT YET";

-- Get the id of element type "Substation" by replace ignore strategy
INSERT INTO element_types (type) VALUES (@typename)
ON DUPLICATE KEY UPDATE type = VALUES(type);

SET @elementtypeid = (SELECT id
                      FROM element_types
                      WHERE type = @typename);

-- Get the voltage type id
INSERT INTO voltages (level) VALUES (@level)
ON DUPLICATE KEY UPDATE level = VALUES(level);

SET @voltageid = (SELECT id
                  FROM voltages
                  WHERE level = @level);

-- Insert the element and get the id
INSERT INTO elements (name, element_types_id, voltages_id) VALUES (@name, @elementtypeid, @voltageid)
ON DUPLICATE KEY UPDATE name = VALUES(name);
SET @elementid = (SELECT id
                  FROM elements
                  WHERE name = @name AND element_types_id = @elementtypeid AND voltages_id = @voltageid);

-- Get the region id of "NOT KNOWN"
INSERT INTO regions (name) VALUES (@regionname)
ON DUPLICATE KEY UPDATE name = VALUES(name);
SET @regionid = (SELECT id
                 FROM regions
                 WHERE name = @regionname);

-- Get the owner id and create if absent with region as "NOT KNOWN"
INSERT INTO owners (name, metadata, regions_id) VALUES (@owner, @metadata, @regionid)
ON DUPLICATE KEY UPDATE name = VALUES(name);
SET @ownerid = (SELECT id
                FROM owners
                WHERE name = @owner);

-- Create an entry in the elements has owners
INSERT INTO elements_has_owners (elements_id, owners_id) VALUES (@elementid, @ownerid)
ON DUPLICATE KEY UPDATE elements_id = VALUES(elements_id);

-- Create an entry in the substations table
INSERT INTO substations (elements_id) VALUES (@elementid)
ON DUPLICATE KEY UPDATE elements_id = VALUES(elements_id);

SET @substationid = (SELECT id
                     FROM substations
                     WHERE elements_id = @elementid);
COMMIT;

SELECT
  @elementid    AS elementid,
  @substationid AS substationid;