-- Inserting a line
START TRANSACTION READ WRITE;
SET @name = "";
SET @typename = "Line";
SET @level = "400";
SET @lineownername = "SUDHIROWNER";
SET @lineownerregionname = "NOT KNOWN";
SET @lineownermetadata = "NOT YET";

SET @end1SSName = "ACBIL";
SET @end2SSName = "ACBIL";
SET @lineNumber = 1;
SET @end1SSOwnerName = "GETCO";
SET @end2SSOwnerName = "GETCO";
SET @km = 25;
SET @conductor_type_name = "Twin ACSR Moose";
SET @sil = 500;
SET @noLoadMVar = 99;
SET @end1LRMvar = 99;
SET @end1IsSwitchable = 1;
SET @end2LRMvar = 99;
SET @end2IsSwitchable = 1;

-- Get the id of element type "Line" by replace ignore strategy
INSERT INTO element_types (type) VALUES (@typename)
ON DUPLICATE KEY UPDATE type = type;

SET @elementtypeid = (SELECT id
                      FROM element_types
                      WHERE type = @typename);

-- Get the voltage type id
INSERT INTO voltages (level) VALUES (@level)
ON DUPLICATE KEY UPDATE level = level;

SET @voltageid = (SELECT id
                  FROM voltages
                  WHERE level = @level);

-- Insert the element and get the id
INSERT INTO elements (name, element_types_id, voltages_id) VALUES (@name, @elementtypeid, @voltageid, @sil)
ON DUPLICATE KEY UPDATE name = name;
SET @elementid = (SELECT id
                  FROM elements
                  WHERE name = @name AND element_types_id = @elementtypeid AND voltages_id = @voltageid);

-- Get the region id of "NOT KNOWN"
INSERT INTO regions (name) VALUES (@lineownerregionname)
ON DUPLICATE KEY UPDATE name = name;
SET @regionid = (SELECT id
                 FROM regions
                 WHERE name = @lineownerregionname);

-- Get the owner id and create if absent with region as "NOT KNOWN"
INSERT INTO owners (name, metadata, regions_id) VALUES (@lineownername, @lineownermetadata, @regionid)
ON DUPLICATE KEY UPDATE name = name;
SET @ownerid = (SELECT id
                FROM owners
                WHERE name = @lineownername);

-- Create an entry in the elements has owners
INSERT INTO elements_has_owners (elements_id, owners_id) VALUES (@elementid, @ownerid)
ON DUPLICATE KEY UPDATE elements_id = elements_id;

-- Get the id of conductor_type "Twin ACSR Moose" by replace ignore strategy
INSERT INTO conductor_types (name) VALUES (@conductor_type_name)
ON DUPLICATE KEY UPDATE name = name;
SET @conductortypeid = (SELECT id
                        FROM conductor_types
                        WHERE name = @conductor_type_name);

-- Create an entry in the lines table
INSERT INTO lines (elements_id, conductor_types_id, number, line_length, noloadmvar)
VALUES (@elementid, @conductortypeid, @lineNumber, @km, @noLoadMVar)
ON DUPLICATE KEY UPDATE elements_id = elements_id;

COMMIT;

SELECT @elementid AS elementid;