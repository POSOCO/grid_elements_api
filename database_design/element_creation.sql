START TRANSACTION READ WRITE;


SET @name = ?;


SET @description = ?;


SET @sil = ?;


SET @stabilityLimit = ?;


SET @thermalLimit = ?;


SET @typeName = ?;


SET @voltage = ?;


SET @ownerName0 = ?;


SET @ownerMetadata0 = ?;


SET @ownerRegion0 = ?;


SET @ownerName1 = ?;


SET @ownerMetadata1 = ?;


SET @ownerRegion1 = ?;


SET @regionName0 = ?;


SET @regionName1 = ?;


SET @stateName0 = ?;


SET @stateName1 = ?;


SET @substationName0 = ?;


SET @substationVoltage0 = ?;


SET @substationName1 = ?;


SET @substationVoltage1 = ?;

INSERT INTO element_types (type)
VALUES (@typeName)
ON DUPLICATE KEY
UPDATE type = type;


SET @typeId =
(SELECT id
 FROM element_types
 WHERE type = @typeName);

INSERT INTO voltages (level)
VALUES (@voltage)
ON DUPLICATE KEY
UPDATE level = level;


SET @voltageId =
(SELECT id
 FROM voltages
 WHERE level = @voltage);

INSERT INTO elements (name, description, sil, stability_limit, thermal_limit, element_types_id, voltages_id)
VALUES (@name,
        @description,
        @sil,
        @stabilityLimit,
        @thermalLimit,
        @typeId,
        @voltageId)
ON DUPLICATE KEY
UPDATE name                             =
VALUES(name), description               =
VALUES(description), sil                =
VALUES(sil), stability_limit            =
VALUES(stability_limit), thermal_limit  =
VALUES(thermal_limit), element_types_id =
VALUES(element_types_id), voltages_id   =
VALUES(voltages_id);


SET @elementId =
(SELECT id
 FROM elements
 WHERE name = @name
       AND description = @description
       AND sil = @sil
       AND stability_limit = @stabilityLimit
       AND thermal_limit = @thermalLimit
       AND element_types_id = @typeId
       AND voltages_id = @voltageId);

INSERT INTO regions (name)
VALUES (@ownerRegion0)
ON DUPLICATE KEY
UPDATE name = name;


SET @ownerRegionId =
(SELECT id
 FROM regions
 WHERE name = @ownerRegion0);

INSERT INTO owners (name, metadata, regions_id)
VALUES (@ownerName0,
        @ownerMetadata0,
        @ownerRegionId)
ON DUPLICATE KEY
UPDATE name  = name,
  metadata   = metadata,
  regions_id = regions_id;


SET @ownerId =
(SELECT id
 FROM owners
 WHERE name = @ownerName0);

INSERT INTO elements_has_owners (elements_id, owners_id)
VALUES (@elementId,
        @ownerId)
ON DUPLICATE KEY
UPDATE elements_id             =
VALUES(elements_id), owners_id =
VALUES(owners_id);

INSERT INTO regions (name)
VALUES (@ownerRegion1)
ON DUPLICATE KEY
UPDATE name = name;


SET @ownerRegionId =
(SELECT id
 FROM regions
 WHERE name = @ownerRegion1);

INSERT INTO owners (name, metadata, regions_id)
VALUES (@ownerName1,
        @ownerMetadata1,
        @ownerRegionId)
ON DUPLICATE KEY
UPDATE name  = name,
  metadata   = metadata,
  regions_id = regions_id;


SET @ownerId =
(SELECT id
 FROM owners
 WHERE name = @ownerName1);

INSERT INTO elements_has_owners (elements_id, owners_id)
VALUES (@elementId,
        @ownerId)
ON DUPLICATE KEY
UPDATE elements_id             =
VALUES(elements_id), owners_id =
VALUES(owners_id);

INSERT INTO regions (name)
VALUES (@regionName0)
ON DUPLICATE KEY
UPDATE name = name;


SET @regionId =
(SELECT id
 FROM regions
 WHERE name = @regionName0);

INSERT INTO elements_has_regions (elements_id, regions_id)
VALUES (@elementId,
        @regionId)
ON DUPLICATE KEY
UPDATE elements_id              =
VALUES(elements_id), regions_id =
VALUES(regions_id);

INSERT INTO regions (name)
VALUES (@regionName1)
ON DUPLICATE KEY
UPDATE name = name;


SET @regionId =
(SELECT id
 FROM regions
 WHERE name = @regionName1);

INSERT INTO elements_has_regions (elements_id, regions_id)
VALUES (@elementId,
        @regionId)
ON DUPLICATE KEY
UPDATE elements_id              =
VALUES(elements_id), regions_id =
VALUES(regions_id);

INSERT INTO states (name)
VALUES (@stateName0)
ON DUPLICATE KEY
UPDATE name = name;


SET @stateId =
(SELECT id
 FROM states
 WHERE name = @stateName0);

INSERT INTO elements_has_states (elements_id, states_id)
VALUES (@elementId,
        @stateId)
ON DUPLICATE KEY
UPDATE elements_id             =
VALUES(elements_id), states_id =
VALUES(states_id);

INSERT INTO states (name)
VALUES (@stateName1)
ON DUPLICATE KEY
UPDATE name = name;


SET @stateId =
(SELECT id
 FROM states
 WHERE name = @stateName1);

INSERT INTO elements_has_states (elements_id, states_id)
VALUES (@elementId,
        @stateId)
ON DUPLICATE KEY
UPDATE elements_id             =
VALUES(elements_id), states_id =
VALUES(states_id);


SET @tempSSDescription = "No Description";


SET @tempSSSil = 0;


SET @tempSSStabilityLimit = 0;


SET @tempSSThermalLimit = 0;


SET @tempSSTypeName = "Substation";

INSERT INTO element_types (type)
VALUES (@tempSSTypeName)
ON DUPLICATE KEY
UPDATE type = type;


SET @tempSSTypeId =
(SELECT id
 FROM element_types
 WHERE type = @tempSSTypeName);

INSERT INTO voltages (level)
VALUES (@substationVoltage0)
ON DUPLICATE KEY
UPDATE level = level;


SET @tempSSVoltageId =
(SELECT id
 FROM voltages
 WHERE level = @substationVoltage0);

INSERT INTO elements (name, description, sil, stability_limit, thermal_limit, element_types_id, voltages_id)
VALUES (@substationName0,
        @tempSSDescription,
        @tempSSSil,
        @tempSSStabilityLimit,
        @tempSSThermalLimit,
        @tempSSTypeId,
        @tempSSVoltageId)
ON DUPLICATE KEY
UPDATE name        = name,
  description      = description,
  sil              = sil,
  stability_limit  = stability_limit,
  thermal_limit    = thermal_limit,
  element_types_id = element_types_id,
  voltages_id      = voltages_id;


SET @tempSSElementId =
(SELECT id
 FROM elements
 WHERE name = @substationName0
       AND element_types_id = @tempSSTypeId
       AND voltages_id = @tempSSVoltageId);

INSERT INTO substations (elements_id)
VALUES (@tempSSElementId)
ON DUPLICATE KEY
UPDATE elements_id =
VALUES(elements_id);


SET @tempSSSubstationId =
(SELECT id
 FROM substations
 WHERE elements_id = @tempSSElementId);

INSERT INTO elements_has_substations (elements_id, substations_id)
VALUES (@elementId,
        @tempSSSubstationId)
ON DUPLICATE KEY
UPDATE elements_id                  =
VALUES(elements_id), substations_id =
VALUES(substations_id);

INSERT INTO element_types (type)
VALUES (@tempSSTypeName)
ON DUPLICATE KEY
UPDATE type = type;


SET @tempSSTypeId =
(SELECT id
 FROM element_types
 WHERE type = @tempSSTypeName);

INSERT INTO voltages (level)
VALUES (@substationVoltage1)
ON DUPLICATE KEY
UPDATE level = level;


SET @tempSSVoltageId =
(SELECT id
 FROM voltages
 WHERE level = @substationVoltage1);

INSERT INTO elements (name, description, sil, stability_limit, thermal_limit, element_types_id, voltages_id)
VALUES (@substationName1,
        @tempSSDescription,
        @tempSSSil,
        @tempSSStabilityLimit,
        @tempSSThermalLimit,
        @tempSSTypeId,
        @tempSSVoltageId)
ON DUPLICATE KEY
UPDATE name        = name,
  description      = description,
  sil              = sil,
  stability_limit  = stability_limit,
  thermal_limit    = thermal_limit,
  element_types_id = element_types_id,
  voltages_id      = voltages_id;


SET @tempSSElementId =
(SELECT id
 FROM elements
 WHERE name = @substationName1
       AND element_types_id = @tempSSTypeId
       AND voltages_id = @tempSSVoltageId);

INSERT INTO substations (elements_id)
VALUES (@tempSSElementId)
ON DUPLICATE KEY
UPDATE elements_id =
VALUES(elements_id);


SET @tempSSSubstationId =
(SELECT id
 FROM substations
 WHERE elements_id = @tempSSElementId);

INSERT INTO elements_has_substations (elements_id, substations_id)
VALUES (@elementId,
        @tempSSSubstationId)
ON DUPLICATE KEY
UPDATE elements_id                  =
VALUES(elements_id), substations_id =
VALUES(substations_id);

COMMIT;

SELECT @elementId AS elementId;